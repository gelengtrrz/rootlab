import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useAuth } from "../context/AuthContext";
import { db, ProfileRow } from "../lib/supabase";
import { Image, Type, Link as LinkIcon, Plus, Send, Settings, ChevronDown, ChevronUp, Music, Video, FolderPlus, Trash2, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProjectRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover_image: string;
  discipline: string;
  created_at: string;
}

interface ProcessRow {
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

const ProcessItemCard = ({
  item,
  themeFont,
  themeColor,
  isOwner,
  onDelete,
  onUpdate,
}: {
  item: ProcessRow;
  themeFont: string;
  themeColor: string;
  isOwner: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ProcessRow>) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editCaption, setEditCaption] = useState(item.caption || "");
  const [editExtended, setEditExtended] = useState(item.extended_content || "");

  const handleSaveEdit = async () => {
    await onUpdate(item.id, {
      content: editContent,
      caption: editCaption,
      extended_content: editExtended,
    });
    setEditMode(false);
    toast.success("Contenido actualizado");
  };

  const renderContent = (type: string, content: string, caption?: string | null) => {
    switch (type) {
      case "image":
        return (
          <div>
            <img src={content} alt="Proceso" className="w-full h-auto object-cover" />
            {caption && (
              <p className={`mt-4 ${themeFont} text-sm text-gray-700 leading-relaxed`} style={{ borderLeft: `2px solid ${themeColor}`, paddingLeft: "1rem" }}>
                {caption}
              </p>
            )}
          </div>
        );
      case "video":
        return (
          <div className="bg-black/5 p-4 border border-black/10">
            {content && content.startsWith("data:") ? (
              <video src={content} controls className="w-full" />
            ) : (
              <div className="flex items-center justify-center h-32"><Video size={48} className="text-black/20" /></div>
            )}
            {caption && <p className={`mt-4 ${themeFont} text-sm text-gray-700`}>{caption}</p>}
          </div>
        );
      case "audio":
        return (
          <div className="bg-[#f5f3ef] p-6 border border-black/10">
            {content && content.startsWith("data:") ? (
              <audio src={content} controls className="w-full" />
            ) : (
              <div className="flex items-center gap-4"><Music size={20} /></div>
            )}
            {caption && <p className={`mt-4 ${themeFont} text-sm text-gray-700`}>{caption}</p>}
          </div>
        );
      case "note":
        return (
          <div className="py-2">
            <p className={`${themeFont} text-sm leading-relaxed text-gray-600 font-light`}>{content}</p>
          </div>
        );
      case "link":
        return (
          <div className="border border-black/10 p-6 bg-white hover:bg-gray-50 transition-colors">
            <LinkIcon className="mb-4 text-gray-400" size={24} />
            <a href={content} target="_blank" rel="noreferrer" className="font-sans text-xs uppercase tracking-widest underline hover:opacity-70 block mb-4 break-all" style={{ color: themeColor }}>
              {content}
            </a>
            {caption && <p className={`${themeFont} text-sm text-gray-500 mt-4`}>{caption}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative p-6 group/card ${item.type === "note" ? "bg-transparent border-t border-b border-black/10" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-400">
          {new Date(item.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <button onClick={() => setEditMode(!editMode)} className="text-gray-300 hover:text-blue-500 transition-colors opacity-0 group-hover/card:opacity-100">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100">
                <Trash2 size={14} />
              </button>
            </>
          )}
          <div className="text-[10px] font-sans uppercase tracking-widest text-gray-300">{item.type}</div>
        </div>
      </div>

      {renderContent(item.type, item.content, item.caption)}

      {item.extended_content && !editMode && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className={`${themeFont} text-sm text-gray-600 leading-relaxed`}>{item.extended_content}</p>
        </div>
      )}

      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-black/10 space-y-4 bg-gray-50 p-4">
              {item.type === "note" && (
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4}
                  className={`w-full bg-white border border-black/10 p-3 focus:outline-none focus:border-black resize-none ${themeFont} text-sm`} />
              )}
              {item.type === "link" && (
                <input type="url" value={editContent} onChange={e => setEditContent(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 focus:outline-none focus:border-black font-sans text-sm" />
              )}
              <input value={editCaption} onChange={e => setEditCaption(e.target.value)}
                className="w-full bg-white border border-black/10 p-3 focus:outline-none focus:border-black font-sans text-sm"
                placeholder="Descripción breve..." />
              <textarea value={editExtended} onChange={e => setEditExtended(e.target.value)} rows={3}
                className={`w-full bg-white border border-black/10 p-3 focus:outline-none focus:border-black resize-none ${themeFont} text-sm`}
                placeholder="Contexto extendido..." />
              <div className="flex gap-3">
                <button onClick={handleSaveEdit} className="px-5 py-2 bg-[#1a1a1a] text-white text-[10px] uppercase tracking-widest font-sans hover:bg-[#cc4f38] transition-colors">Guardar</button>
                <button onClick={() => setEditMode(false)} className="px-5 py-2 border border-gray-300 text-gray-500 text-[10px] uppercase tracking-widest font-sans">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProjectSection = ({
  project,
  isOwner,
  processItems,
  themeFont,
  themeColor,
  onDeleteProject,
  onDeleteProcess,
  onUpdateProcess,
}: {
  project: ProjectRow;
  isOwner: boolean;
  processItems: ProcessRow[];
  themeFont: string;
  themeColor: string;
  onDeleteProject: (id: string) => void;
  onDeleteProcess: (id: string) => void;
  onUpdateProcess: (id: string, updates: Partial<ProcessRow>) => void;
}) => {
  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-16 relative z-10">
        <div className="w-full md:w-1/3">
          <div className="aspect-[3/4] overflow-hidden relative">
            {project.cover_image ? (
              <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover filter grayscale opacity-80" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Image size={32} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3 md:pt-12">
          <div className="inline-block px-3 py-1 bg-white border border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 mb-6">Proyecto</div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-[#111] mb-6">{project.title}</h2>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-xl">{project.description}</p>
          {isOwner && (
            <button
              onClick={() => {
                if (window.confirm(`¿Eliminar el proyecto "${project.title}"?`)) onDeleteProject(project.id);
              }}
              className="mt-8 flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-4 py-2"
            >
              <Trash2 size={12} /> Eliminar proyecto
            </button>
          )}
        </div>
      </div>
      <div className="pl-0 md:pl-[33%]">
        <div className="border-t border-black/10 pt-12">
          <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-gray-400 mb-12 flex items-center gap-4">
            <span className="w-8 h-px bg-gray-300"></span>
            Archivo vivo del proyecto
          </h3>
          {processItems.length === 0 ? (
            <p className="font-mono text-sm text-gray-400">Archivo vacío. El proceso está por comenzar.</p>
          ) : (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
              <Masonry gutter="2rem">
                {processItems.map(item => (
                  <ProcessItemCard
                    key={item.id}
                    item={item}
                    themeFont={themeFont}
                    themeColor={themeColor}
                    isOwner={isOwner}
                    onDelete={onDeleteProcess}
                    onUpdate={onUpdateProcess}
                  />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      </div>
    </section>
  );
};

export function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  const [artist, setArtist] = useState<ProfileRow | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [processes, setProcesses] = useState<ProcessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [themeColor, setThemeColor] = useState("#cc4f38");
  const [themeFont, setThemeFont] = useState("font-serif");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);

      const { data: profiles } = await db.profiles.loadAll();
      if (profiles) {
        const found = profiles.find((p: ProfileRow) => p.slug === id);
        if (found) {
          setArtist(found);
          setThemeColor(found.theme_color || "#cc4f38");
          setThemeFont(found.theme_font || "font-serif");
          if (firebaseUser && firebaseUser.uid === found.user_id) {
            setIsOwner(true);
          }

          const { data: projectData } = await db.projects.loadAll();
          if (projectData) {
            const mine = projectData.filter((p: any) => p.user_id === found.user_id);
            setProjects(mine);
          }

          const { data: processData } = await db.processes.loadAll();
          if (processData) {
            const mine = processData.filter((p: any) => p.user_id === found.user_id);
            setProcesses(mine);
          }
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id, firebaseUser]);

  const handleDeleteProject = async (projectId: string) => {
    await db.projects.delete(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setProcesses(prev => prev.filter(p => p.project_id !== projectId));
    toast.success("Proyecto eliminado");
  };

  const handleDeleteProcess = async (processId: string) => {
    await db.processes.delete(processId);
    setProcesses(prev => prev.filter(p => p.id !== processId));
    toast.success("Contenido eliminado");
  };

  const handleUpdateProcess = async (processId: string, updates: Partial<ProcessRow>) => {
    await db.processes.update(processId, updates as any);
    setProcesses(prev => prev.map(p => p.id === processId ? { ...p, ...updates } : p));
  };

  const handleSaveSettings = async () => {
    if (!artist) return;
    await db.profiles.upsert({
      ...artist,
      theme_color: themeColor,
      theme_font: themeFont,
    });
    setArtist(prev => prev ? { ...prev, theme_color: themeColor, theme_font: themeFont } : prev);
    setShowSettings(false);
    toast.success("Estética guardada");
  };

  const handleDeleteProfile = async () => {
    if (!artist) return;
    if (window.confirm("¿Eliminar este perfil y todo su contenido?")) {
      await db.profiles.delete(artist.user_id);
      navigate("/artistas");
      toast.success("Perfil eliminado");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-32 flex items-center justify-center">
        <p className="font-sans text-xs uppercase tracking-widest text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="w-full min-h-screen pt-32 px-6 flex items-center justify-center">
        <h1 className="text-4xl font-serif text-gray-400">Artista no encontrado.</h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 px-6 md:px-12 lg:px-20 relative bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square overflow-hidden rounded-sm"
            >
              {artist.avatar_url ? (
                <img src={artist.avatar_url} alt={artist.name} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-90" />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="font-serif text-6xl text-gray-500">{artist.name?.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: themeColor, opacity: 0.2 }}></div>
            </motion.div>
            <div className="mt-8">
              <p className={`${themeFont} text-sm text-gray-600 leading-relaxed font-light pl-4`} style={{ borderLeft: `1px solid ${themeColor}` }}>
                {artist.bio}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 pt-4">
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="flex justify-between items-start mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400 block">
                  {artist.discipline} &bull; {artist.location}
                </span>
                {isOwner && (
                  <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-black transition-colors">
                    <Settings size={18} />
                  </button>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-8xl leading-none uppercase font-black tracking-tighter text-[#111] mb-12">
                {artist.name}
              </h1>

              <div className="flex flex-wrap gap-4 items-center">
                {isOwner && (
                  <button
                    onClick={handleDeleteProfile}
                    className="px-4 py-3 border border-red-200 text-red-500 font-sans uppercase tracking-widest text-[10px] hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Eliminar Perfil
                  </button>
                )}
                
                  href={`mailto:${artist.contact_email || ""}`}
                  className="px-6 py-3 border border-black bg-black text-white font-sans uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-black transition-colors flex items-center gap-2"
                >
                  <Mail size={14} /> Contactar
                </a>
              </div>
            </motion.div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 p-6 bg-white border border-gray-200 overflow-hidden"
                >
                  <h4 className="font-sans uppercase text-[10px] tracking-widest text-gray-500 mb-6">Estética del Perfil</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider mb-3">Tipografía</label>
                      <select value={themeFont} onChange={e => setThemeFont(e.target.value)}
                        className="w-full p-2 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-black">
                        <option value="font-mono">Monoespaciada</option>
                        <option value="font-serif">Serif</option>
                        <option value="font-sans">Sans-serif</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider mb-3">Color de Acento</label>
                      <div className="flex gap-3">
                        {["#cc4f38", "#2a4b7c", "#c99a2e", "#3d5a40", "#1a1a1a"].map(color => (
                          <button key={color} onClick={() => setThemeColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${themeColor === color ? "border-black scale-110" : "border-transparent"}`}
                            style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleSaveSettings} className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest">Guardar</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="space-y-32 mb-32">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-gray-400 italic">Este artista aún no ha iniciado ningún proyecto.</p>
            </div>
          ) : (
            projects.map(project => (
              <ProjectSection
                key={project.id}
                project={project}
                isOwner={isOwner}
                processItems={processes.filter(p => p.project_id === project.id)}
                themeFont={themeFont}
                themeColor={themeColor}
                onDeleteProject={handleDeleteProject}
                onDeleteProcess={handleDeleteProcess}
                onUpdateProcess={handleUpdateProcess}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}