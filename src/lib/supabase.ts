/**
 * Minimal Supabase REST client using native fetch.
 * No npm package required — avoids the missing @supabase/* sub-package issue.
 */
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/rest/v1`;

const BASE_HEADERS: Record<string, string> = {
  apikey: publicAnonKey,
  Authorization: `Bearer ${publicAnonKey}`,
  "Content-Type": "application/json",
};

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Low-level helpers ─────────────────────────────────────────────────────────

async function restGet<T>(
  table: string,
  params: Record<string, string> = {}
): Promise<DbResult<T>> {
  try {
    const url = new URL(`${BASE}/${table}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), { headers: BASE_HEADERS });
    if (!res.ok) return { data: null, error: await res.text() };
    return { data: (await res.json()) as T, error: null };
  } catch (e: any) {
    return { data: null, error: String(e.message ?? e) };
  }
}

async function restPost<T>(
  table: string,
  body: object,
  prefer: string
): Promise<DbResult<T>> {
  try {
    const res = await fetch(`${BASE}/${table}`, {
      method: "POST",
      headers: { ...BASE_HEADERS, Prefer: prefer },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { data: null, error: await res.text() };
    const json = await res.json();
    return { data: (Array.isArray(json) ? json[0] : json) as T, error: null };
  } catch (e: any) {
    return { data: null, error: String(e.message ?? e) };
  }
}

async function restDelete(
  table: string,
  params: Record<string, string>
): Promise<{ error: string | null }> {
  try {
    const url = new URL(`${BASE}/${table}`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers: BASE_HEADERS,
    });
    if (!res.ok) return { error: await res.text() };
    return { error: null };
  } catch (e: any) {
    return { error: String(e.message ?? e) };
  }
}

// ── Public database API ───────────────────────────────────────────────────────

export const db = {
  profiles: {
    /** Load every profile (for the public Artists directory). */
    loadAll: () => restGet<ProfileRow[]>("profiles"),

    /** Load a single user's profile by Firebase UID. Returns array of 0 or 1. */
    getByUserId: (uid: string) =>
      restGet<ProfileRow[]>("profiles", { user_id: `eq.${uid}` }),

    /** Upsert (create or update) a profile row. */
    upsert: (row: Omit<ProfileRow, "created_at">) =>
      restPost<ProfileRow>(
        "profiles",
        row,
        "resolution=merge-duplicates,return=representation"
      ),

    /** Delete a profile by Firebase UID. */
    delete: (uid: string) =>
      restDelete("profiles", { user_id: `eq.${uid}` }),
  },

  processes: {
    /** Load all processes, newest first. */
    loadAll: () =>
      restGet<ProcessRow[]>("processes", { order: "created_at.desc" }),

    /** Insert a new process item. */
    insert: (row: ProcessRow) =>
      restPost<ProcessRow>("processes", row, "return=representation"),

    /** Delete a single process by its UUID. */
    delete: (id: string) =>
      restDelete("processes", { id: `eq.${id}` }),

    /** Delete all processes belonging to a Firebase UID. */
    deleteByUser: (uid: string) =>
      restDelete("processes", { user_id: `eq.${uid}` }),
  },
};
