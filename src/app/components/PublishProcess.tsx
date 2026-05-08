import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../lib/supabase";
import { Image as ImageIcon, FileText, Link as LinkIcon, Music, Video, FolderPlus, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

interface ProjectLocal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover_image: string;
  discipline: string;
  created_at: string;
}

export function PublishProcess() {
  const { firebaseUser, authLoading } = useAuth();
  const navigate = useNavigate();

  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [profileSlug, setProfileSlug] = useState<string>("");
  const [profileDiscipline, setProfileDiscipline] = useState<string>("");
  const [myProjects, setMyProjects] = useState<ProjectLocal[]>([]);
  const [step, setStep] = useState<"project" | "content">("project");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newProjectCover, setNewProjectCover] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "image" as "image" | "note" | "audio" | "video" | "link",
    content: "",
    caption: "",
    extendedContent: ""
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      navigate("/auth");
    }
  }, [firebaseUser, authLoading, navigate]);

  useEffect(() => {
    if (!firebaseUser) return;
    const checkProfile = async () => {
      const { data } = await db.profiles.getByUserId(firebaseUser.uid);
      if (data && data.length > 0) {
        setHasProfile(true);
        setProfileSlug(data[0].slug || "");
        setProfileDiscipline(data[0].discipline || "");
      } else {
        setHasProfile(false);
      }
    };
    checkProfile();
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser || !hasProfile) return;
    const loadProjects = async () => {
      const { data } = await db.projects.loadAll();
      if (data) {
        const mine = data.filter((p: any) => p.user_id === firebaseUser.uid);
        setMyProjects(mine);
      }
    };
    loadProjects();
  }, [firebaseUser, hasProfile]);

  if (authLoading || hasProfile === null) {
    return (
      <div className="w-full min-h-screen pt-40 flex items-start justify-center">
        <span className="font-sans text-xs uppercase tracking-widest text-gray-400">Cargando…</span>
      </div>
    );
  }

  if (!firebaseUser) return null;

  if (!hasProfile) {
    return (
      <div className="w-full min-h-screen pt-40 px-6 flex items-start justify-center relative overflow-hidden">
        <motion.div
          animate={{ opacity: [0.53, 0.05, 0.53] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 right-10 w-64 h-64 bg-[#cc4f38] rounded-full filter blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.53, 0.05, 0.53] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[26%] -left-10 w-72 h-72 bg-[#c4520a] rounded-full filter blur-3xl pointer-events-none"
        />
        <div className="text-center max-w-lg relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif italic text-[#1a1a1a] mb-6">
            Aún no tienes un perfil
          </h1>
          <p className="font-sans text-gray-600 mb-8">
            Para poder documentar y publicar tu proceso creativo en RootLab, primero necesitas configurar tu identidad en el directorio.
          </p>
          <Link
            to="/mi-perfil"
            className="inline-block px-8 py-4 bg-[#1a1a1a] text-[#f5f3ef] font-sans uppercase tracking-widest text-xs hover:bg-[#cc4f38] transition-colors"
          >
            Crear mi perfil
          </Link>
        </div>
      </div>
    );
  }

  const selectedProject = myProjects.find(p => p.id === selectedProjectId);

  const handleSelectExisting = (id: string) => {
    setSelectedProjectId(id);
    setCreatingNew(false);
  };

  const handleToggleNew = () => {
    setCreatingNew(prev => !prev);
    setSelectedProjectId(null);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProjectCover(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setNewProjectCover(null);
    }
  };

  const handleProjectContinue = async () => {
    if (creatingNew) {
      if (!newProject.title.trim() || !newProject.description.trim()) {
        toast.error("Completa el título y la descripción del proyecto.");
        return;
      }
      if (!newProjectCover) {
        toast.error("Añade una foto de portada para el proyecto.");
        return;
      }
      const newId = crypto.randomUUID();
      const row = {
        id: newId,
        user_id: firebaseUser.uid,
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        cover_image: newProjectCover,
        discipline: profileDiscipline,
        created_at: new Date().toISOString(),
      };
      const { error } = await db.projects.insert(row);
      if (error) {
        toast.error("Error al crear el proyecto");
        return;
      }
      setMyProjects(prev => [...prev, row]);
      setSelectedProjectId(newId);
    } else {
      if (!selectedProjectId) {
        toast.error("Selecciona un proyecto o crea uno nuevo.");
        return;
      }
    }
    setStep("content");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleTypeChange = (newType: any) => {
    setFormData({ ...formData, type: newType, content: "" });
    setFilePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalContent = formData.content;
    if (["image", "audio", "video"].includes(formData.type)) {
      if (!filePreview) {
        toast.error("Por favor, selecciona un archivo");
        return;
      }
      finalContent = filePreview;
    }
    const row = {
      id: crypto.randomUUID(),
      user_id: firebaseUser.uid,
      project_id: selectedProjectId,
      type: formData.type,
      content: finalContent,
      caption: formData.caption,
      extended_content: formData.extendedContent,
      extensions: [],
      created_at: new Date().toISOString(),
    };
    const { error } = await db.processes.insert(row);
    if (error) {
      toast.error("Error al publicar el proceso", { description: error });
      return;
    }
    toast.success("Proceso publicado", {
      description: "Tu fragmento de proceso se ha añadido al proyecto."
    });
    navigate(`/artistas/${profileSlug}`);
  };

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-3xl mx-auto pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-[#1a1a1a] mb-6">
            Documentar Proceso
          </h1>

          <div className="flex items-center gap-3 mb-12">
            <div className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest ${step === "project" ? "text-[#1a1a1a]" : "text-gray-400"}`}>
              <span className={`w-6 h-6 flex items-center justify-center border text-xs ${step === "project" ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-gray-300 text-gray-400"}`}>
                {step === "content" ? <Check size={12} /> : "1"}
              </span>
              Proyecto
            </div>
            <ChevronRight size={14} className="text-gray-300" />
            <div className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest ${step === "content" ? "text-[#1a1a1a]" : "text-gray-400"}`}>
              <span className={`w-6 h-6 flex items-center justify-center border text-xs ${step === "content" ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-gray-300 text-gray-400"}`}>
                2
              </span>
              Contenido
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "project" && (
              <motion.div
                key="step-project"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <p className="font-sans text-gray-600 max-w-lg">
                  Antes de añadir contenido, indica a qué proyecto pertenece este fragmento de proceso.
                </p>

                {myProjects.length > 0 && (
                  <div className="space-y-4">
                    <label className="font-sans text-xs uppercase tracking-widest text-gray-500 block">
                      Proyectos existentes
                    </label>
                    <div className="space-y-3">
                      {myProjects.map(project => (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => handleSelectExisting(project.id)}
                          className={`w-full text-left px-6 py-5 border transition-colors flex items-start justify-between gap-4 ${
                            selectedProjectId === project.id && !creatingNew
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-black/20 text-[#1a1a1a] hover:border-black/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {project.cover_image && (
                              <div className="w-10 h-10 flex-shrink-0 overflow-hidden">
                                <img src={project.cover_image} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-serif italic text-lg leading-tight">{project.title}</p>
                              <p className={`font-sans text-xs mt-1 ${selectedProjectId === project.id && !creatingNew ? "text-white/60" : "text-gray-500"}`}>
                                {project.description}
                              </p>
                            </div>
                          </div>
                          {selectedProjectId === project.id && !creatingNew && (
                            <Check size={18} className="flex-shrink-0 mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleToggleNew}
                    className={`flex items-center gap-3 px-6 py-4 border transition-colors w-full text-left ${
                      creatingNew
                        ? "border-[#cc4f38] bg-[#cc4f38] text-white"
                        : "border-black/20 text-[#1a1a1a] hover:border-black/50"
                    }`}
                  >
                    <FolderPlus size={16} />
                    <span className="font-sans text-xs uppercase tracking-widest">
                      {myProjects.length === 0 ? "Crear primer proyecto" : "Crear nuevo proyecto"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {creatingNew && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6 pt-2">
                          <div className="space-y-2">
                            <label className="font-sans text-xs uppercase tracking-widest text-gray-500">
                              Título del proyecto
                            </label>
                            <input
                              value={newProject.title}
                              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                              className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-serif text-xl"
                              placeholder="Ej. Serie Umbral, Álbum sin título..."
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="font-sans text-xs uppercase tracking-widest text-gray-500">
                              Foto de portada <span className="text-[#cc4f38]">*</span>
                            </label>
                            <div className="flex items-start gap-6">
                              <div className="w-20 h-20 flex-shrink-0 overflow-hidden border border-black/20 bg-gray-100">
                                {newProjectCover ? (
                                  <img src={newProjectCover} alt="Portada" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCoverChange}
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                                />
                                <p className="mt-2 font-sans text-xs text-gray-400">
                                  Una foto representativa del proyecto.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="font-sans text-xs uppercase tracking-widest text-gray-500">
                              Descripción del proyecto
                            </label>
                            <textarea
                              value={newProject.description}
                              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                              rows={3}
                              className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-serif text-lg resize-none"
                              placeholder="¿De qué trata este proyecto? ¿Qué estás investigando?"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={handleProjectContinue}
                  className="w-full md:w-auto px-12 py-5 bg-[#1a1a1a] text-white font-sans uppercase tracking-widest text-sm hover:bg-[#cc4f38] transition-colors flex items-center gap-3"
                >
                  Continuar
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {step === "content" && (
              <motion.div
                key="step-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <div className="border-l-4 border-[#cc4f38] pl-5 py-1 flex items-center gap-4">
                  {(selectedProject?.cover_image || newProjectCover) && (
                    <div className="w-10 h-10 flex-shrink-0 overflow-hidden">
                      <img
                        src={selectedProject?.cover_image || newProjectCover || ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-gray-500">Proyecto</p>
                    <p className="font-serif italic text-xl text-[#1a1a1a] mt-1">
                      {selectedProject?.title || newProject.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("project")}
                      className="font-sans text-xs uppercase tracking-widest text-gray-400 hover:text-[#cc4f38] transition-colors mt-2"
                    >
                      ← Cambiar proyecto
                    </button>
                  </div>
                </div>

                <p className="font-sans text-gray-600 max-w-lg">
                  Añade un nuevo fragmento a este proyecto.
                </p>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <label className="font-sans text-xs uppercase tracking-widest text-gray-500 block">Tipo de contenido</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { id: "image", icon: ImageIcon, label: "Imagen" },
                        { id: "note", icon: FileText, label: "Nota" },
                        { id: "audio", icon: Music, label: "Audio" },
                        { id: "video", icon: Video, label: "Vídeo" },
                        { id: "link", icon: LinkIcon, label: "Enlace" }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleTypeChange(type.id)}
                          className={`flex items-center gap-2 px-6 py-3 border transition-colors ${
                            formData.type === type.id
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-black/20 text-[#1a1a1a] hover:border-black/50"
                          }`}
                        >
                          <type.icon size={16} />
                          <span className="font-sans text-xs uppercase tracking-widest">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-widest text-gray-500">
                      {formData.type === "note" ? "Texto de la nota" :
                       formData.type === "link" ? "URL del enlace" :
                       "Subir archivo"}
                    </label>
                    {formData.type === "note" ? (
                      <textarea
                        required name="content" value={formData.content} onChange={handleChange} rows={4}
                        className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-serif text-xl resize-none"
                        placeholder="Escribe tu reflexión o idea aquí..."
                      />
                    ) : formData.type === "link" ? (
                      <input
                        required type="url" name="content" value={formData.content} onChange={handleChange}
                        className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-sans text-lg"
                        placeholder="https://ejemplo.com/referencia..."
                      />
                    ) : (
                      <div className="space-y-4">
                        <input
                          required={!filePreview} type="file"
                          accept={formData.type === "image" ? "image/*" : formData.type === "audio" ? "audio/*" : "video/*"}
                          onChange={handleFileChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                        />
                        {filePreview && formData.type === "image" && (
                          <div className="h-32 w-32 overflow-hidden border border-black/20">
                            <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
                          </div>
                        )}
                        {filePreview && formData.type === "video" && (
                          <video src={filePreview} controls className="w-full max-h-48" />
                        )}
                        {filePreview && formData.type === "audio" && (
                          <audio src={filePreview} controls className="w-full" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-widest text-gray-500">Descripción breve</label>
                    <input
                      required name="caption" value={formData.caption} onChange={handleChange}
                      className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-sans text-lg"
                      placeholder="¿Qué estamos viendo/escuchando?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-widest text-gray-500">Contexto extendido (Opcional)</label>
                    <textarea
                      name="extendedContent" value={formData.extendedContent} onChange={handleChange} rows={4}
                      className="w-full bg-transparent border-b border-black/20 pb-3 focus:outline-none focus:border-black font-serif text-xl resize-none"
                      placeholder="Añade más contexto, reflexiones o detalles..."
                    />
                  </div>

                  <button type="submit" className="w-full md:w-auto px-12 py-5 bg-[#1a1a1a] text-white font-sans uppercase tracking-widest text-sm hover:bg-[#cc4f38] transition-colors">
                    Publicar Proceso
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}