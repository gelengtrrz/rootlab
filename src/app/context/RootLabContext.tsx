import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../lib/supabase";
import type { ProfileRow, ProcessRow } from "../../lib/supabase";
import { useAuth } from "./AuthContext";

// ── Domain types ─────────────────────────────────────────────────────────────

export type Discipline =
  | "Música"
  | "Artes plásticas"
  | "Danza"
  | "Fotografía / Filmmaking"
  | "Escritura"
  | "Diseño gráfico / Ilustración";

export interface ProcessExtension {
  id: string;
  type: "image" | "note" | "audio" | "video" | "link";
  content: string;
  caption?: string;
  createdAt: string;
}

export interface ProcessItem {
  id: string;
  artistId: string;
  projectId?: string;
  type: "image" | "note" | "audio" | "video" | "link";
  content: string;
  caption?: string;
  extendedContent?: string;
  extensions?: ProcessExtension[];
  createdAt: string;
}

export interface Artist {
  id: string; // Firebase UID for real users; static id for demo entries
  slug: string;
  name: string;
  location: string;
  discipline: Discipline;
  bio: string;
  avatarUrl: string;
  contactEmail?: string;
  themeFont?: string;
  themeColor?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  artistId: string;
  coverImage: string;
  discipline: Discipline;
}

interface RootLabContextProps {
  artists: Artist[];
  projects: Project[];
  processFeed: ProcessItem[];
  currentUser: Artist | null;
  setCurrentUser: (artist: Artist | null) => void;
  addArtist: (artist: Omit<Artist, "id" | "slug">) => Artist;
  updateArtist: (artist: Artist) => void;
  addProject: (project: Omit<Project, "id">) => Project;
  addProcessItem: (item: Omit<ProcessItem, "id" | "createdAt">) => void;
  addProcessExtension: (itemId: string, ext: Omit<ProcessExtension, "id" | "createdAt">) => void;
  deleteProcessItem: (itemId: string) => void;
  deleteArtist: (artistId: string) => void;
  updateArtistTheme: (artistId: string, font: string, color: string) => void;
  getArtistBySlug: (slug: string) => Artist | undefined;
  getArtistProcess: (artistId: string, projectId?: string) => ProcessItem[];
  getArtistProjects: (artistId: string) => Project[];
}

// ── Row ↔ Domain mappers ──────────────────────────────────────────────────────

function profileToArtist(row: ProfileRow): Artist {
  return {
    id: row.user_id,
    slug: row.slug || "",
    name: row.name || "",
    location: row.location || "",
    discipline: (row.discipline as Discipline) || "Artes plásticas",
    bio: row.bio || "",
    avatarUrl: row.avatar_url || "",
    contactEmail: row.contact_email ?? undefined,
    themeFont: row.theme_font ?? undefined,
    themeColor: row.theme_color ?? undefined,
  };
}

function artistToProfileRow(
  artist: Artist,
  userId: string
): Omit<ProfileRow, "created_at"> {
  return {
    user_id: userId,
    name: artist.name,
    slug: artist.slug,
    location: artist.location,
    discipline: artist.discipline,
    bio: artist.bio,
    avatar_url: artist.avatarUrl,
    contact_email: artist.contactEmail ?? null,
    theme_font: artist.themeFont ?? null,
    theme_color: artist.themeColor ?? null,
    updated_at: new Date().toISOString(),
  };
}

function processRowToItem(row: ProcessRow): ProcessItem {
  return {
    id: row.id,
    artistId: row.user_id,
    projectId: row.project_id ?? undefined,
    type: row.type as ProcessItem["type"],
    content: row.content || "",
    caption: row.caption ?? undefined,
    extendedContent: row.extended_content ?? undefined,
    extensions: row.extensions || [],
    createdAt: row.created_at,
  };
}

function itemToProcessRow(item: ProcessItem, userId: string): ProcessRow {
  return {
    id: item.id,
    user_id: userId,
    project_id: item.projectId ?? null,
    type: item.type,
    content: item.content,
    caption: item.caption ?? null,
    extended_content: item.extendedContent ?? null,
    extensions: item.extensions || [],
    created_at: item.createdAt,
  };
}

// ── Static demo data ──────────────────────────────────────────────────────────

const MOCK_ARTISTS: Artist[] = [
  {
    id: "a1",
    slug: "elena-koval",
    name: "Elena Koval",
    location: "Berlín, Alemania",
    discipline: "Artes plásticas",
    bio: "Exploro la relación entre texturas orgánicas y espacios industriales. Mi proceso está lleno de capas que cubro y vuelvo a descubrir.",
    avatarUrl:
      "https://images.unsplash.com/photo-1619241805829-34fb64299391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwcm9maWxlJTIwcG9ydHJhaXQlMjByYXd8ZW58MXx8fHwxNzczMDcwNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    contactEmail: "hola@elenakoval.art",
  },
  {
    id: "a2",
    slug: "julian-mira",
    name: "Julián Mira",
    location: "Bogotá, Colombia",
    discipline: "Música",
    bio: "Productor de paisajes sonoros. Grabo sonidos de la ciudad y los convierto en melodías rotas.",
    avatarUrl:
      "https://images.unsplash.com/photo-1762160767032-9a639bc9f89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMHBvcnRyYWl0JTIwc3R1ZGlvfGVufDF8fHx8MTc3MzAyOTc3OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "a3",
    slug: "chloe-santos",
    name: "Chlöe Santos",
    location: "Madrid, España",
    discipline: "Danza",
    bio: "El movimiento como error constante. Investigo la caída, el peso y la torpeza como herramientas expresivas.",
    avatarUrl:
      "https://images.unsplash.com/photo-1528392944531-e63de93f8751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZXIlMjBwb3J0cmFpdCUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MzA3MDYwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    artistId: "a1",
    title: "Materia Silenciosa",
    description: "Una exploración de óleos y pigmentos naturales sobre lienzo desgarrado.",
    coverImage:
      "https://images.unsplash.com/photo-1526898834822-52c0ce699e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGV4cHJlc3Npb25pc3QlMjBwYWludGluZ3xlbnwxfHx8fDE3NzMwNzA2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    discipline: "Artes plásticas",
  },
  {
    id: "p2",
    artistId: "a2",
    title: "Ecos de Asfalto",
    description: "EP conceptual basado en field recordings nocturnos.",
    coverImage:
      "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwc3R1ZGlvJTIwc2V0dXB8ZW58MXx8fHwxNzczMDcwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    discipline: "Música",
  },
  {
    id: "p3",
    artistId: "a3",
    title: "Gravedad Cero",
    description: "Pieza coreográfica sobre la pérdida de control.",
    coverImage:
      "https://images.unsplash.com/photo-1761882619891-6529ff92df0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZXIlMjBpbiUyMG1vdGlvbiUyMHN0dWRpb3xlbnwxfHx8fDE3NzMwNzA2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    discipline: "Danza",
  },
];

const MOCK_PROCESS: ProcessItem[] = [
  {
    id: "i1",
    artistId: "a1",
    projectId: "p1",
    type: "image",
    content:
      "https://images.unsplash.com/photo-1765758014805-a7a6cc272982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGNoYW90aWMlMjBhcnQlMjBzdHVkaW98ZW58MXx8fHwxNzczMDcwNjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption:
      "El estudio es un caos absoluto hoy. No encuentro la espátula pequeña pero descubrí que usar cartón roto da una textura increíble. A veces el error es el camino.",
    extendedContent:
      "Ayer estuve trabajando en esto por 5 horas. Cada capa de pintura que agrego parece destruir la anterior, pero luego de que seca, todo cobra sentido de nuevo.",
    extensions: [
      {
        id: "ext1",
        type: "image",
        content:
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWxldHRlfGVufDF8fHx8MTc3MzA3MDYwMXww&ixlib=rb-4.1.0&q=80&w=1080",
        caption: "Detalle de la textura final con el cartón.",
        createdAt: new Date(Date.now() - 5000000).toISOString(),
      },
      {
        id: "ext2",
        type: "note",
        content: "Definitivamente la textura de cartón funcionó. La arena fue demasiado gruesa.",
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 10000000).toISOString(),
  },
  {
    id: "i2",
    artistId: "a1",
    projectId: "p1",
    type: "note",
    content: "¿Y si la tela no necesita estar tensada? ¿Qué pasa si la dejo caer por su propio peso?",
    extendedContent:
      "He estado pensando en esto mucho. La tensión del lienzo siempre me ha parecido una imposición, una forma de domesticar la obra antes de que nazca.",
    createdAt: new Date(Date.now() - 8000000).toISOString(),
  },
  {
    id: "i3",
    artistId: "a2",
    projectId: "p2",
    type: "image",
    content:
      "https://images.unsplash.com/photo-1666986527833-7ac743f9d243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29kYm9hcmQlMjB3YWxsJTIwaW5zcGlyYXRpb258ZW58MXx8fHwxNzczMDcwNjAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Mapeando la estructura del nuevo track. Cada color es un stem diferente.",
    createdAt: new Date(Date.now() - 5000000).toISOString(),
  },
  {
    id: "i4",
    artistId: "a3",
    projectId: "p3",
    type: "image",
    content:
      "https://images.unsplash.com/photo-1685463894505-d33387aa8430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXNzeSUyMHNrZXRjaGJvb2slMjBwYWdlc3xlbnwxfHx8fDE3NzMwNzA2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Apuntes coreográficos incomprensibles de las 3 AM.",
    createdAt: new Date(Date.now() - 2000000).toISOString(),
  },
];

// ── Context ───────────────────────────────────────────────────────────────────

const RootLabContext = createContext<RootLabContextProps | undefined>(undefined);

/** Merge Supabase rows into a base array, replacing any entry with the same id. */
function mergeById<T extends { id: string }>(base: T[], incoming: T[]): T[] {
  const incomingIds = new Set(incoming.map((x) => x.id));
  return [...base.filter((x) => !incomingIds.has(x.id)), ...incoming];
}

export function RootLabProvider({ children }: { children: ReactNode }) {
  const { firebaseUser, authLoading } = useAuth();

  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const raw = localStorage.getItem("rootlab_projects");
      return raw ? JSON.parse(raw) : MOCK_PROJECTS;
    } catch {
      return MOCK_PROJECTS;
    }
  });
  const [processFeed, setProcessFeed] = useState<ProcessItem[]>(MOCK_PROCESS);
  const [currentUser, setCurrentUserState] = useState<Artist | null>(null);

  // ── Load all public Supabase data on mount ────────────────────────────────
  useEffect(() => {
    (async () => {
      // Profiles → artists
      const { data: profileRows, error: pe } = await db.profiles.loadAll();
      if (!pe && profileRows && profileRows.length > 0) {
        const supaArtists = profileRows.map(profileToArtist);
        setArtists((prev) => mergeById(prev, supaArtists));
      }

      // Processes
      const { data: processRows, error: pre } = await db.processes.loadAll();
      if (!pre && processRows && processRows.length > 0) {
        const supaProcesses = processRows.map(processRowToItem);
        setProcessFeed((prev) => mergeById(prev, supaProcesses));
      }
    })();
  }, []);

  // ── Load current user profile from Supabase when Firebase auth changes ────
  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setCurrentUserState(null);
      return;
    }

    (async () => {
      const { data: rows, error } = await db.profiles.getByUserId(firebaseUser.uid);
      if (!error && rows && rows.length > 0) {
        const artist = profileToArtist(rows[0]);
        setCurrentUserState(artist);
        setArtists((prev) => mergeById(prev, [artist]));
      } else {
        setCurrentUserState(null);
      }
    })();
  }, [firebaseUser, authLoading]);

  // Persist projects locally
  useEffect(() => {
    try {
      localStorage.setItem("rootlab_projects", JSON.stringify(projects));
    } catch {/* storage quota */ }
  }, [projects]);

  // ── addArtist ─────────────────────────────────────────────────────────────
  const addArtist = (artistData: Omit<Artist, "id" | "slug">): Artist => {
    const uid = firebaseUser?.uid ?? uuidv4();
    const rawSlug = (artistData.name || "artista")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${rawSlug}-${uid.slice(0, 6)}`;

    const newArtist: Artist = {
      ...artistData,
      id: uid,
      slug,
      avatarUrl:
        artistData.avatarUrl ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080",
      themeFont: artistData.themeFont || "font-mono",
      themeColor: artistData.themeColor || "#1a1a1a",
    };

    setArtists((prev) => mergeById(prev, [newArtist]));
    setCurrentUserState(newArtist);

    if (firebaseUser) {
      db.profiles
        .upsert(artistToProfileRow(newArtist, firebaseUser.uid))
        .then(({ error }) => {
          if (error) console.error("Supabase profile upsert:", error);
        });
    }

    return newArtist;
  };

  // ── updateArtist ──────────────────────────────────────────────────────────
  const updateArtist = (updated: Artist): void => {
    setArtists((prev) => mergeById(prev, [updated]));
    if (currentUser?.id === updated.id) setCurrentUserState(updated);

    if (firebaseUser && updated.id === firebaseUser.uid) {
      db.profiles
        .upsert(artistToProfileRow(updated, firebaseUser.uid))
        .then(({ error }) => {
          if (error) console.error("Supabase profile update:", error);
        });
    }
  };

  // ── addProject (local) ────────────────────────────────────────────────────
  const addProject = (projectData: Omit<Project, "id">): Project => {
    const p: Project = { ...projectData, id: uuidv4() };
    setProjects((prev) => [...prev, p]);
    return p;
  };

  // ── addProcessItem ────────────────────────────────────────────────────────
  const addProcessItem = (itemData: Omit<ProcessItem, "id" | "createdAt">): void => {
    const item: ProcessItem = {
      ...itemData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      extensions: [],
    };
    setProcessFeed((prev) => [item, ...prev]);

    if (firebaseUser && itemData.artistId === firebaseUser.uid) {
      db.processes
        .insert(itemToProcessRow(item, firebaseUser.uid))
        .then(({ error }) => {
          if (error) console.error("Supabase process insert:", error);
        });
    }
  };

  // ── addProcessExtension (local) ───────────────────────────────────────────
  const addProcessExtension = (
    itemId: string,
    extData: Omit<ProcessExtension, "id" | "createdAt">
  ): void => {
    setProcessFeed((prev) =>
      prev.map((p) => {
        if (p.id !== itemId) return p;
        const ext: ProcessExtension = {
          ...extData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        return { ...p, extensions: [...(p.extensions || []), ext] };
      })
    );
  };

  // ── deleteProcessItem ─────────────────────────────────────────────────────
  const deleteProcessItem = (itemId: string): void => {
    setProcessFeed((prev) => prev.filter((p) => p.id !== itemId));
    if (firebaseUser) {
      db.processes
        .delete(itemId)
        .then(({ error }) => {
          if (error) console.error("Supabase process delete:", error);
        });
    }
  };

  // ── deleteArtist ──────────────────────────────────────────────────────────
  const deleteArtist = (artistId: string): void => {
    setArtists((prev) => prev.filter((a) => a.id !== artistId));
    setProjects((prev) => prev.filter((p) => p.artistId !== artistId));
    setProcessFeed((prev) => prev.filter((p) => p.artistId !== artistId));
    if (currentUser?.id === artistId) setCurrentUserState(null);

    if (firebaseUser && artistId === firebaseUser.uid) {
      db.profiles.delete(firebaseUser.uid).then(({ error }) => {
        if (error) console.error("Supabase profile delete:", error);
      });
      db.processes.deleteByUser(firebaseUser.uid).then(({ error }) => {
        if (error) console.error("Supabase processes delete:", error);
      });
    }
  };

  // ── updateArtistTheme ─────────────────────────────────────────────────────
  const updateArtistTheme = (artistId: string, font: string, color: string): void => {
    setArtists((prev) =>
      prev.map((a) => (a.id === artistId ? { ...a, themeFont: font, themeColor: color } : a))
    );
  };

  // ── Queries ───────────────────────────────────────────────────────────────
  const getArtistBySlug = (slug: string) => artists.find((a) => a.slug === slug);

  const getArtistProcess = (artistId: string, projectId?: string) =>
    processFeed
      .filter((p) => p.artistId === artistId && (!projectId || p.projectId === projectId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getArtistProjects = (artistId: string) =>
    projects.filter((p) => p.artistId === artistId);

  return (
    <RootLabContext.Provider
      value={{
        artists,
        projects,
        processFeed,
        currentUser,
        setCurrentUser: setCurrentUserState,
        addArtist,
        updateArtist,
        addProject,
        addProcessItem,
        addProcessExtension,
        deleteProcessItem,
        deleteArtist,
        updateArtistTheme,
        getArtistBySlug,
        getArtistProcess,
        getArtistProjects,
      }}
    >
      {children}
    </RootLabContext.Provider>
  );
}

export function useRootLab() {
  const ctx = useContext(RootLabContext);
  if (!ctx) throw new Error("useRootLab must be used within a RootLabProvider");
  return ctx;
}
