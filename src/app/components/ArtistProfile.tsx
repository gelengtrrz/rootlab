import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRootLab, ProcessItem, Project, ProcessExtension } from "../context/RootLabContext";
import { Image, Type, Link as LinkIcon, Plus, Send, Settings, ChevronDown, ChevronUp, Music, Video, FolderPlus, Trash2, Mail } from "lucide-react";

const ProcessItemCard = ({ 
  item, 
  themeFont, 
  themeColor, 
  onDelete,
  isOwner,
  onAddExtension
}: { 
  item: ProcessItem, 
  themeFont: string, 
  themeColor: string, 
  onDelete: (id: string) => void,
  isOwner: boolean,
  onAddExtension: (itemId: string, data: Omit<ProcessExtension, "id" | "createdAt">) => void
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [extType, setExtType] = useState<"image" | "note" | "audio" | "video" | "link">("note");
  const [extContent, setExtContent] = useState("");
  const [extCaption, setExtCaption] = useState("");
  const [extFile, setExtFile] = useState<string | null>(null);

  const handleExtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExtFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtension = () => {
    if ((extType === "note" || extType === "link") && !extContent.trim()) return;
    if ((extType === "image" || extType === "audio" || extType === "video") && !extFile) return;

    onAddExtension(item.id, {
      type: extType,
      content: (extType === "image" || extType === "audio" || extType === "video")
        ? (extFile as string)
        : extContent,
      caption: extCaption
    });
    setExtContent("");
    setExtCaption("");
    setExtFile(null);
    setShowExtensionForm(false);
    setExpanded(true); // Auto-expand to show the new extension
  };

  const renderContent = (type: string, content: string, caption?: string) => {
    switch (type) {
      case "image":
        return (
          <div className="relative group">
            <img src={content} alt="Proceso" className="w-full h-auto object-cover" />
            {caption && (
              <p className={`mt-4 ${themeFont} text-sm text-gray-700 leading-relaxed`} style={{ borderLeft: `2px solid ${themeColor}`, paddingLeft: '1rem' }}>
                {caption}
              </p>
            )}
          </div>
        );
      case "video":
        return (
          <div className="relative group bg-black/5 p-4 aspect-video flex items-center justify-center border border-black/10 overflow-hidden">
            {content && content.startsWith('data:') ? (
              <video src={content} controls className="w-full h-full object-cover" />
            ) : (
              <>
                <Video size={48} className="text-black/20" />
                <div className="absolute bottom-4 left-4 text-xs font-mono uppercase text-gray-500">Video</div>
              </>
            )}
            {caption && (
              <p className={`absolute -bottom-10 left-0 ${themeFont} text-sm text-gray-700 leading-relaxed`}>
                {caption}
              </p>
            )}
          </div>
        );
      case "audio":
        return (
          <div className="relative group bg-[#f5f3ef] p-6 border border-black/10">
            {content && content.startsWith('data:') ? (
              <audio src={content} controls className="w-full" />
            ) : (
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white">
                  <Music size={20} />
                </div>
                <div className="flex-grow h-2 bg-black/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#cc4f38]"></div>
                </div>
              </div>
            )}
            {caption && (
              <p className={`mt-4 ${themeFont} text-sm text-gray-700 leading-relaxed`} style={{ borderLeft: `2px solid ${themeColor}`, paddingLeft: '1rem' }}>
                {caption}
              </p>
            )}
          </div>
        );
      case "note":
        return (
          <div className="py-2">
            <p className={`${themeFont} text-sm leading-relaxed text-gray-600 font-light`}>
              {content}
            </p>
          </div>
        );
      case "link":
        return (
          <div className="border border-black/10 p-6 bg-white hover:bg-gray-50 transition-colors">
            <LinkIcon className="mb-4 text-gray-400" size={24} />
            <a href={content} target="_blank" rel="noreferrer" className="font-sans text-xs uppercase tracking-widest underline hover:text-[#cc4f38] block mb-4 break-all" style={{ color: themeColor }}>
              {content}
            </a>
            {caption && (
              <p className={`${themeFont} text-sm text-gray-500 mt-4`}>
                {caption}
              </p>
            )}
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
          {new Date(item.createdAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <button 
              onClick={() => onDelete(item.id)}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100"
              title="Eliminar contenido"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div className="text-[10px] font-sans uppercase tracking-widest text-gray-300">
            {item.type}
          </div>
        </div>
      </div>

      {renderContent(item.type, item.content, item.caption)}

      {/* Legacy extended content support */}
      {item.extendedContent && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <p className={`${themeFont} text-sm text-gray-600 leading-relaxed`}>
            {item.extendedContent}
          </p>
        </div>
      )}

      {/* Extensions (Evolución del proceso) */}
      {(item.extensions && item.extensions.length > 0) && (
        <div className="mt-6 pt-4 border-t border-dashed border-black/10">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mb-4"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Ocultar evolución" : `Ver evolución (${item.extensions.length})`}
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-8 pl-4 border-l-2 border-black/5 py-2">
                  {item.extensions.map((ext, idx) => (
                    <div key={ext.id} className="relative">
                      <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2">
                        <span>Anexo {idx + 1}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{new Date(ext.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                      {renderContent(ext.type, ext.content, ext.caption)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Add Extension Form for Owner */}
      {isOwner && (
        <div className="mt-6 pt-4 border-t border-black/5">
          {!showExtensionForm ? (
            <button 
              onClick={() => setShowExtensionForm(true)}
              className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              <Plus size={14} /> Expandir proceso
            </button>
          ) : (
            <div className="bg-gray-50 p-4 border border-black/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-sans uppercase tracking-widest text-gray-500">Añadir a este paso</span>
                <button onClick={() => setShowExtensionForm(false)} className="text-gray-400 hover:text-black">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="flex gap-2 mb-4">
                {[
                  { id: "note", icon: Type, label: "Nota" },
                  { id: "image", icon: Image, label: "Imagen" },
                  { id: "link", icon: LinkIcon, label: "Enlace" },
                  { id: "audio", icon: Music, label: "Audio" },
                  { id: "video", icon: Video, label: "Video" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setExtType(t.id as any)}
                    className={`p-2 border transition-colors ${
                      extType === t.id 
                        ? 'border-[#cc4f38] text-[#cc4f38] bg-white' 
                        : 'border-transparent text-gray-400 hover:bg-black/5'
                    }`}
                    title={t.label}
                  >
                    <t.icon size={16} />
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {extType === "note" ? (
                  <textarea
                    value={extContent}
                    onChange={(e) => setExtContent(e.target.value)}
                    placeholder="Desarrolla más esta idea..."
                    className="w-full bg-white border border-black/10 p-3 text-sm outline-none resize-none font-sans"
                    rows={3}
                  />
                ) : extType === "link" ? (
                  <input
                    type="text"
                    value={extContent}
                    onChange={(e) => setExtContent(e.target.value)}
                    placeholder="URL del enlace"
                    className="w-full bg-white border border-black/10 p-3 text-sm outline-none font-sans"
                  />
                ) : (
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      accept={extType === "image" ? "image/*" : extType === "video" ? "video/*" : "audio/*"} 
                      onChange={handleExtFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    />
                    {extType === "image" && extFile && (
                      <div className="h-32 w-32 overflow-hidden border border-black/10">
                          <img src={extFile} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    {(extType === "audio" || extType === "video") && extFile && (
                       <div className="p-4 bg-gray-50 border border-black/10 flex items-center justify-center">
                         {extType === "video" ? (
                           <video src={extFile} controls className="w-full max-h-32" />
                         ) : (
                           <audio src={extFile} controls className="w-full" />
                         )}
                       </div>
                    )}
                  </div>
                )}

                {extType !== "note" && (
                  <input
                    type="text"
                    value={extCaption}
                    onChange={(e) => setExtCaption(e.target.value)}
                    placeholder="Pie de foto / Descripción (opcional)"
                    className="w-full bg-white border border-black/10 p-3 text-sm outline-none font-sans"
                  />
                )}

                <button 
                  onClick={handleAddExtension}
                  disabled={(extType === "note" || extType === "link") ? !extContent.trim() : !extFile}
                  className="w-full bg-[#1a1a1a] text-white py-3 text-xs uppercase tracking-widest font-sans hover:bg-[#cc4f38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar Anexo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, getArtistBySlug, getArtistProcess, getArtistProjects, addProcessItem, addProject, updateArtistTheme, deleteProcessItem, deleteArtist, addProcessExtension } = useRootLab();
  
  const artist = getArtistBySlug(id || "");
  const isOwner = currentUser?.id === artist?.id;
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [type, setType] = useState<"image" | "note" | "link" | "audio" | "video">("image");
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [extendedContent, setExtendedContent] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const [themeFont, setThemeFont] = useState(artist?.themeFont || "font-mono");
  const [themeColor, setThemeColor] = useState(artist?.themeColor || "#cc4f38");

  useEffect(() => {
    if (artist) {
      setThemeFont(artist.themeFont || "font-mono");
      setThemeColor(artist.themeColor || "#cc4f38");
    }
  }, [artist]);

  if (!artist) {
    return (
      <div className="w-full min-h-screen pt-32 px-6 flex items-center justify-center">
        <h1 className="text-4xl font-serif text-gray-400">Artista no encontrado.</h1>
      </div>
    );
  }

  const projects = getArtistProjects(artist.id);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaFile(null);
    }
  };

  const handleSaveSettings = () => {
    updateArtistTheme(artist.id, themeFont, themeColor);
    setShowSettings(false);
  };

  const handleDeleteProfile = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este perfil y todo su contenido? Esta acción no se puede deshacer en este prototipo.")) {
      deleteArtist(artist.id);
      navigate("/artistas");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetProjectId = selectedProjectId;

    // Create new project if selected
    if (selectedProjectId === "new") {
      if (!newProjectTitle) return;
      const newProj = addProject({
        artistId: artist.id,
        title: newProjectTitle,
        description: newProjectDesc,
        coverImage: mediaFile || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080",
        discipline: artist.discipline
      });
      targetProjectId = newProj.id;
    }

    if (!targetProjectId) {
      alert("Por favor selecciona o crea un proyecto.");
      return;
    }

    let finalContent = content;
    if (type === "image" || type === "audio" || type === "video") {
        if (!mediaFile && selectedProjectId !== "new") return;
        finalContent = mediaFile || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080";
    } else {
        if (!content) return;
    }
    
    addProcessItem({
      artistId: artist.id,
      projectId: targetProjectId,
      type,
      content: finalContent,
      caption,
      extendedContent: extendedContent || undefined
    });
    
    setContent("");
    setMediaFile(null);
    setCaption("");
    setExtendedContent("");
    setNewProjectTitle("");
    setNewProjectDesc("");
    setShowForm(false);
  };

  return (
    <div className="w-full min-h-screen pt-24 px-6 md:px-12 lg:px-20 relative bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Header */}
        <header className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square overflow-hidden rounded-sm"
            >
              <img 
                src={artist.avatarUrl} 
                alt={artist.name} 
                className="w-full h-full object-cover grayscale mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: themeColor, opacity: 0.2 }}></div>
            </motion.div>
            <div className="mt-8">
              <p className={`${themeFont} text-sm text-gray-600 leading-relaxed font-light pl-4`} style={{ borderLeft: `1px solid ${themeColor}` }}>
                {artist.bio}
              </p>
            </div>
          </div>
          
          <div className="md:col-span-8 pt-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400 block">
                  {artist.discipline} &bull; {artist.location}
                </span>
                {isOwner && (
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-gray-400 hover:text-black transition-colors"
                    title="Configurar estética del perfil"
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-8xl leading-none uppercase font-black tracking-tighter text-[#111] mb-12">
                {artist.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 items-center">
                {isOwner && (
                  <>
                    <button 
                      onClick={() => setShowForm(!showForm)}
                      className="px-6 py-3 border border-black text-[#111] font-sans uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> 
                      {showForm ? "Cerrar" : "Añadir Archivo"}
                    </button>
                    <button 
                      onClick={handleDeleteProfile}
                      className="px-4 py-3 border border-red-200 text-red-500 font-sans uppercase tracking-widest text-[10px] hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-2"
                      title="Eliminar perfil"
                    >
                      <Trash2 size={14} />
                      Eliminar Perfil
                    </button>
                  </>
                )}
                <a 
                  href={`mailto:${artist.contactEmail || `contacto@${artist.slug}.art`}`}
                  className="px-6 py-3 border border-black bg-black text-white font-sans uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-black transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  Contactar
                </a>
              </div>
            </motion.div>

            {/* Aesthetic Settings Panel */}
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
                      <label className="block text-xs font-sans uppercase tracking-wider mb-3">Tipografía de Notas</label>
                      <select 
                        value={themeFont} 
                        onChange={(e) => setThemeFont(e.target.value)}
                        className="w-full p-2 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-black"
                      >
                        <option value="font-mono">Monoespaciada (Máquina de escribir)</option>
                        <option value="font-serif">Serif (Clásica/Editorial)</option>
                        <option value="font-sans">Sans-serif (Moderna/Limpia)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider mb-3">Color de Acento</label>
                      <div className="flex gap-3">
                        {["#cc4f38", "#2a4b7c", "#c99a2e", "#3d5a40", "#1a1a1a"].map(color => (
                          <button
                            key={color}
                            onClick={() => setThemeColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${themeColor === color ? "border-black scale-110" : "border-transparent"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleSaveSettings} className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest">
                      Guardar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Add Content Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-20 bg-white p-8 md:p-12 border border-gray-200 shadow-sm"
            >
              <h3 className="font-serif italic text-2xl md:text-3xl mb-8 text-gray-800">Documentar proceso</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Project Selection */}
                <div className="border-b border-gray-100 pb-8">
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                    Selecciona un Proyecto
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map(proj => (
                      <div 
                        key={proj.id}
                        onClick={() => setSelectedProjectId(proj.id)}
                        className={`cursor-pointer p-4 border transition-all ${selectedProjectId === proj.id ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <h4 className="font-serif text-lg mb-1 truncate">{proj.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{proj.description}</p>
                      </div>
                    ))}
                    <div 
                      onClick={() => setSelectedProjectId("new")}
                      className={`cursor-pointer p-4 border flex flex-col items-center justify-center transition-all min-h-[80px] ${selectedProjectId === "new" ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-400 border-dashed'}`}
                    >
                      <FolderPlus size={20} className="mb-2 text-gray-400" />
                      <span className="font-sans text-[10px] uppercase tracking-widest text-gray-600">Nuevo Proyecto</span>
                    </div>
                  </div>

                  {selectedProjectId === "new" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 space-y-4">
                      <input 
                        type="text" value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} required
                        placeholder="Título del proyecto" 
                        className="w-full bg-transparent border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-serif text-xl"
                      />
                      <input 
                        type="text" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} required
                        placeholder="Breve explicación de la investigación" 
                        className="w-full bg-transparent border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-sans text-sm"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Content Type */}
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">
                    Tipo de contenido
                  </label>
                  <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                    <button type="button" onClick={() => setType("note")} className={`px-4 py-3 border flex items-center gap-2 text-xs uppercase tracking-widest ${type === "note" ? "bg-black text-white border-black" : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400"}`}><Type size={16} /> Apunte</button>
                    <button type="button" onClick={() => setType("image")} className={`px-4 py-3 border flex items-center gap-2 text-xs uppercase tracking-widest ${type === "image" ? "bg-black text-white border-black" : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400"}`}><Image size={16} /> Imagen</button>
                    <button type="button" onClick={() => setType("video")} className={`px-4 py-3 border flex items-center gap-2 text-xs uppercase tracking-widest ${type === "video" ? "bg-black text-white border-black" : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400"}`}><Video size={16} /> Video</button>
                    <button type="button" onClick={() => setType("audio")} className={`px-4 py-3 border flex items-center gap-2 text-xs uppercase tracking-widest ${type === "audio" ? "bg-black text-white border-black" : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400"}`}><Music size={16} /> Audio</button>
                    <button type="button" onClick={() => setType("link")} className={`px-4 py-3 border flex items-center gap-2 text-xs uppercase tracking-widest ${type === "link" ? "bg-black text-white border-black" : "bg-transparent text-gray-600 border-gray-200 hover:border-gray-400"}`}><LinkIcon size={16} /> Link</button>
                  </div>

                  {/* Main Input based on type */}
                  <div className="mb-6">
                    {type === "image" || type === "audio" || type === "video" ? (
                      <div className="space-y-4">
                        <input 
                          type="file" 
                          accept={type === "image" ? "image/*" : type === "audio" ? "audio/*" : "video/*"} 
                          onChange={handleMediaFileChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                        />
                        {mediaFile && type === "image" && (
                          <div className="h-32 w-32 overflow-hidden border border-gray-200">
                              <img src={mediaFile} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                        {mediaFile && type === "video" && (
                          <div className="p-4 bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <video src={mediaFile} controls className="w-full max-h-48" />
                          </div>
                        )}
                        {mediaFile && type === "audio" && (
                          <div className="p-4 bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <audio src={mediaFile} controls className="w-full" />
                          </div>
                        )}
                      </div>
                    ) : type === "note" ? (
                      <textarea 
                        value={content} onChange={(e) => setContent(e.target.value)} required
                        className={`w-full bg-transparent border border-gray-200 p-4 focus:outline-none focus:border-black resize-none min-h-[120px] ${themeFont} text-sm`} 
                        placeholder="Pensamientos, errores, ideas descartadas..." 
                      />
                    ) : type === "link" ? (
                      <input 
                        type="url" value={content} onChange={(e) => setContent(e.target.value)} required
                        className="w-full bg-transparent border-b border-gray-300 pb-3 focus:outline-none focus:border-black font-sans text-sm" 
                        placeholder="https://" 
                      />
                    ) : null}
                  </div>
                </div>

                {/* Additional Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {type !== "note" && (
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Nota / Pie de foto (opcional)</label>
                      <input 
                        type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
                        className={`w-full bg-transparent border-b border-gray-300 pb-2 focus:outline-none focus:border-black ${themeFont} text-sm`} 
                        placeholder="Contexto breve..." 
                      />
                    </div>
                  )}
                  <div className={type === "note" ? "md:col-span-2" : ""}>
                    <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Contexto Expandido (opcional)</label>
                    <textarea 
                      value={extendedContent} onChange={(e) => setExtendedContent(e.target.value)}
                      className={`w-full bg-transparent border-b border-gray-300 pb-2 focus:outline-none focus:border-black resize-none min-h-[40px] ${themeFont} text-xs`} 
                      placeholder="Información adicional que se mostrará al expandir..." 
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="px-8 py-4 bg-black text-white font-sans uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors flex items-center gap-3">
                    <Send size={14} /> Archivar proceso
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects and their Process Feeds */}
        <div className="space-y-32 mb-32">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-gray-400 italic">Este artista aún no ha iniciado ningún proyecto.</p>
            </div>
          ) : (
            projects.map(project => {
              const projectProcess = getArtistProcess(artist.id, project.id);
              
              return (
                <section key={project.id} className="relative">
                  {/* Project Header */}
                  <div className="flex flex-col md:flex-row gap-8 items-start mb-16 relative z-10">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover filter grayscale opacity-80" />
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 md:pt-12">
                      <div className="inline-block px-3 py-1 bg-white border border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 mb-6">
                        Proyecto
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif italic text-[#111] mb-6">{project.title}</h2>
                      <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-xl">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Process Timeline for this project */}
                  <div className="pl-0 md:pl-[33%]">
                    <div className="border-t border-black/10 pt-12">
                      <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-gray-400 mb-12 flex items-center gap-4">
                        <span className="w-8 h-px bg-gray-300"></span>
                        Archivo vivo del proyecto
                      </h3>
                      
                      {projectProcess.length === 0 ? (
                        <p className="font-mono text-sm text-gray-400">Archivo vacío. El proceso está por comenzar.</p>
                      ) : (
                        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
                          <Masonry gutter="2rem">
                            {projectProcess.map((item) => (
                              <ProcessItemCard 
                                key={item.id} 
                                item={item} 
                                themeFont={themeFont} 
                                themeColor={themeColor}
                                onDelete={deleteProcessItem}
                                isOwner={isOwner}
                                onAddExtension={addProcessExtension}
                              />
                            ))}
                          </Masonry>
                        </ResponsiveMasonry>
                      )}
                    </div>
                  </div>
                </section>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
