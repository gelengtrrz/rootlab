/**
 * Zero-dependency Supabase client built on native fetch.
 * Covers Auth (email/password + Google OAuth) and DB (profiles + processes).
 */
import { projectId, publicAnonKey } from "../../utils/supabase/info";

// ── Constants ─────────────────────────────────────────────────────────────────

const REST_BASE = `https://${projectId}.supabase.co/rest/v1`;
const AUTH_BASE = `https://${projectId}.supabase.co/auth/v1`;
const SESSION_KEY = "rootlab_session_v1";

const ANON_HEADERS = {
  apikey: publicAnonKey,
  "Content-Type": "application/json",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  uid: string;   // Supabase user UUID (used as user_id in DB tables)
  email: string;
}

export interface ProfileRow {
  user_id: string;
  name: string;
  slug: string;
  location: string;
  discipline: string;
  bio: string;
  avatar_url: string;
  contact_email: string | null;
  theme_font: string | null;
  theme_color: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessRow {
  id: string;
  user_id: string;
  project_id: string | null;
  type: string;
  content: string;
  caption: string | null;
  extended_content: string | null;
  extensions: any[];
  created_at: string;
}

type DbResult<T> = { data: T | null; error: string | null };

// ── Auth – internal session state ─────────────────────────────────────────────

type SessionListener = (session: SupabaseSession | null) => void;
let _session: SupabaseSession | null = null;
const _listeners: SessionListener[] = [];

function emitSession(s: SupabaseSession | null) {
  _listeners.forEach((fn) => fn(s));
}

function persistSession(s: SupabaseSession | null) {
  _session = s;
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {/* storage quota */}
  emitSession(s);
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

async function tokenResponseToSession(res: Response): Promise<SupabaseSession> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      body.error_description || body.msg || body.error || `Error ${res.status}`
    );
  }
  // Supabase signup without email confirmation returns user but no access_token
  if (!body.access_token) {
    throw new Error(
      "Revisa tu correo y confirma tu cuenta antes de iniciar sesión."
    );
  }
  const payload = decodeJwtPayload(body.access_token);
  if (!payload?.sub) throw new Error("Token de autenticación inválido.");
  const session: SupabaseSession = {
    access_token: body.access_token,
    refresh_token: body.refresh_token,
    uid: payload.sub,
    email: body.user?.email || payload.email || "",
  };
  persistSession(session);
  return session;
}

// ── Auth – public API ─────────────────────────────────────────────────────────

export const sbAuth = {
  /** Returns the current in-memory session. */
  getSession(): SupabaseSession | null { return _session; },

  /**
   * Subscribe to session changes.
   * Returns an unsubscribe function.
   */
  onSessionChange(fn: SessionListener): () => void {
    _listeners.push(fn);
    return () => {
      const i = _listeners.indexOf(fn);
      if (i > -1) _listeners.splice(i, 1);
    };
  },

  /**
   * Must be called once on app startup.
   * Reads OAuth callback tokens from the URL hash (after Google redirect)
   * and falls back to localStorage.
   */
  init(): SupabaseSession | null {
    // 1. OAuth callback: tokens in URL hash
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const p = new URLSearchParams(hash.slice(1));
      const access_token = p.get("access_token");
      const refresh_token = p.get("refresh_token");
      if (access_token && refresh_token) {
        const payload = decodeJwtPayload(access_token);
        if (payload?.sub) {
          const session: SupabaseSession = {
            access_token,
            refresh_token,
            uid: payload.sub,
            email: payload.email || "",
          };
          persistSession(session);
          // Rewrite to a valid hash-router path so createHashRouter gets a
          // clean route (must happen BEFORE the router reads window.location)
          window.history.replaceState(
            {},
            "",
            window.location.pathname + window.location.search + "#/mi-perfil"
          );
          return session;
        }
      }
    }

    // 2. Restore from localStorage
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SupabaseSession;
        if (s?.access_token) { _session = s; return s; }
      }
    } catch {/* ignore */}

    return null;
  },

  /** Email/password registration. */
  async signUpWithEmail(email: string, password: string): Promise<SupabaseSession> {
    const res = await fetch(`${AUTH_BASE}/signup`, {
      method: "POST",
      headers: ANON_HEADERS,
      body: JSON.stringify({ email, password }),
    });
    return tokenResponseToSession(res);
  },

  /** Email/password sign-in. */
  async signInWithEmail(email: string, password: string): Promise<SupabaseSession> {
    const res = await fetch(`${AUTH_BASE}/token?grant_type=password`, {
      method: "POST",
      headers: ANON_HEADERS,
      body: JSON.stringify({ email, password }),
    });
    return tokenResponseToSession(res);
  },

  /**
   * Redirects the browser to Supabase's Google OAuth endpoint.
   * After authorization, Supabase redirects back to `window.location.origin`
   * with tokens in the URL hash — handled by `sbAuth.init()` on the next load.
   *
   * The Google OAuth credentials must be configured in:
   * Supabase Dashboard → Authentication → Providers → Google
   * Client ID:     310466989293-nc92v3ha58soau7h0n65dmnv1c655fu9.apps.googleusercontent.com
   * Client Secret: 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
   */
  signInWithGoogle(): void {
    const redirectTo = encodeURIComponent(window.location.origin);
    window.location.href =
      `${AUTH_BASE}/authorize?provider=google&redirect_to=${redirectTo}`;
  },

  /** Sign out and clear session. */
  async signOut(): Promise<void> {
    if (_session?.access_token) {
      await fetch(`${AUTH_BASE}/logout`, {
        method: "POST",
        headers: {
          ...ANON_HEADERS,
          Authorization: `Bearer ${_session.access_token}`,
        },
      }).catch(() => {/* best-effort */});
    }
    persistSession(null);
  },

  /** Refresh access token using the stored refresh token. */
  async refresh(): Promise<SupabaseSession | null> {
    if (!_session?.refresh_token) return null;
    const res = await fetch(`${AUTH_BASE}/token?grant_type=refresh_token`, {
      method: "POST",
      headers: ANON_HEADERS,
      body: JSON.stringify({ refresh_token: _session.refresh_token }),
    });
    if (!res.ok) { persistSession(null); return null; }
    return tokenResponseToSession(res);
  },
};

// ── DB – helpers ──────────────────────────────────────────────────────────────

/** Returns headers with the user's JWT (for writes) or the anon key (for public reads). */
function makeHeaders(useAuth = false): Record<string, string> {
  const bearer = (useAuth && _session?.access_token) ? _session.access_token : publicAnonKey;
  return {
    apikey: publicAnonKey,
    Authorization: `Bearer ${bearer}`,
    "Content-Type": "application/json",
  };
}

async function restGet<T>(
  table: string,
  params: Record<string, string> = {}
): Promise<DbResult<T>> {
  try {
    const url = new URL(`${REST_BASE}/${table}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), { headers: makeHeaders(false) });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: (await res.json()) as T, error: null };
  } catch (e: any) {
    return { data: null, error: String(e?.message ?? e) };
  }
}

async function restPost<T>(
  table: string,
  body: object,
  prefer: string
): Promise<DbResult<T>> {
  try {
    const res = await fetch(`${REST_BASE}/${table}`, {
      method: "POST",
      headers: { ...makeHeaders(true), Prefer: prefer },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { data: null, error: await res.text() };
    const json = await res.json();
    return { data: (Array.isArray(json) ? json[0] : json) as T, error: null };
  } catch (e: any) {
    return { data: null, error: String(e?.message ?? e) };
  }
}

async function restDelete(
  table: string,
  params: Record<string, string>
): Promise<{ error: string | null }> {
  try {
    const url = new URL(`${REST_BASE}/${table}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers: makeHeaders(true),
    });
    if (!res.ok) return { error: await res.text() };
    return { error: null };
  } catch (e: any) {
    return { error: String(e?.message ?? e) };
  }
}

// ── DB – public API ───────────────────────────────────────────────────────────

export const db = {
  profiles: {
    /** Read all profiles — visible to every visitor. */
    loadAll: () => restGet<ProfileRow[]>("profiles"),

    /** Read a single profile by Supabase user UID. Returns array of 0 or 1. */
    getByUserId: (uid: string) =>
      restGet<ProfileRow[]>("profiles", { user_id: `eq.${uid}` }),

    /** Create or update a profile (upsert on user_id primary key). */
    upsert: (row: Omit<ProfileRow, "created_at">) =>
      restPost<ProfileRow>(
        "profiles",
        row,
        "resolution=merge-duplicates,return=representation"
      ),

    /** Delete a profile by Supabase user UID. */
    delete: (uid: string) =>
      restDelete("profiles", { user_id: `eq.${uid}` }),
  },

  processes: {
    /** Read all processes, newest first — visible to every visitor. */
    loadAll: () =>
      restGet<ProcessRow[]>("processes", { order: "created_at.desc" }),

    /** Insert a new process item. */
    insert: (row: ProcessRow) =>
      restPost<ProcessRow>("processes", row, "return=representation"),

    /** Delete a single process by UUID. */
    delete: (id: string) =>
      restDelete("processes", { id: `eq.${id}` }),

    /** Delete all processes owned by a given Supabase user UID. */
    deleteByUser: (uid: string) =>
      restDelete("processes", { user_id: `eq.${uid}` }),
  },
};