import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Save, User, Image as ImageIcon, MapPin, AlignLeft, PaintBucket, Trash2 } from "lucide-react";
import { MOCK_DISCIPLINES } from "../data/mockData";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { db, ProfileRow } from "../../lib/supabase";

interface ProfileForm {
  name: string;
  bio: string;
  location: string;
  discipline: string;
  avatarUrl: string;
  contactEmail: string;
  themeColor: string;
}

export function MyProfile() {
  const { firebaseUser, authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const defaultValues: ProfileForm = {
    name: "",
    bio: "",
    location: "",
    discipline: "Artes plásticas",
    avatarUrl: "",
    contactEmail: "",
    themeColor: "#cc4f38",
  };

  const { register, handleSubmit, control, reset, setValue } = useForm<ProfileForm>({
    defaultValues,
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      navigate("/auth");
    }
  }, [firebaseUser, authLoading, navigate]);

  useEffect(() => {
    if (!firebaseUser) return;
    const loadProfile = async () => {
      setProfileLoading(true);
      const { data } = await db.profiles.getByUserId(firebaseUser.uid);
      if (data && data.length > 0) {
        const p = data[0];
        reset({
          name: p.name || "",
          bio: p.bio || "",
          location: p.location || "",
          discipline: p.discipline || "Artes plásticas",
          avatarUrl: p.avatar_url || "",
          contactEmail: p.contact_email || "",
          themeColor: p.theme_color || "#cc4f38",
        });
        setHasProfile(true);
      }
      setProfileLoading(false);
    };
    loadProfile();
  }, [firebaseUser, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("avatarUrl", reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!firebaseUser) return;
    const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const updates = {
      name: data.name,
      slug,
      bio: data.bio,
      location: data.location,
      discipline: data.discipline,
      avatar_url: data.avatarUrl,
      contact_email: data.contactEmail || null,
      theme_color: data.themeColor,
      theme_font: null,
    };

    let error: string | null = null;

    if (hasProfile) {
      const result = await db.profiles.update(firebaseUser.uid, updates);
      error = result.error;
    } else {
      const row: Omit<ProfileRow, "created_at"> = {
        user_id: firebaseUser.uid,
        ...updates,
      };
      const result = await db.profiles.upsert(row);
      error = result.error;
    }

    if (error) {
      toast.error("Error al guardar el perfil", { description: error });
    } else {
      setHasProfile(true);
      toast.success(hasProfile ? "Perfil actualizado" : "Perfil creado", {
        description: hasProfile
          ? "Tus cambios se han guardado correctamente."
          : "Bienvenido a RootLab. Tu perfil ya es visible en la sección de Artistas.",
      });
    }
  };

  const handleDeleteProfile = async () => {
    if (!firebaseUser) return;
    const { error } = await db.profiles.delete(firebaseUser.uid);
    if (error) {
      toast.error("Error al eliminar el perfil");
    } else {
      toast.success("Perfil eliminado");
      navigate("/");
    }
  };

  const previewUser = { ...defaultValues, ...formValues };

  if (authLoading || profileLoading) {
    return (
      <div className="w-full min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/50 font-sans tracking-widest uppercase text-xs">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative bg-[#1a1a1a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto pb-20 text-[#f5f3ef]"
      >
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            {hasProfile ? "Editar Perfil" : "Crear Perfil"}
          </h1>
          <p className="font-sans text-gray-400 text-lg max-w-2xl">
            {hasProfile
              ? "Actualiza tu información pública en el directorio."
              : "Únete al archivo. Completa tus datos para aparecer en el directorio de artistas."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-sans">
              <div className="bg-[#222] border border-white/10 p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <User size={20} className="text-gray-400" />
                  Información Básica
                </h2>
                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-gray-400">Nombre Artístico</label>
                  <input
                    {...register("name", { required: true })}
                    className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-white transition-colors text-white"
                    placeholder="Ej. Ana Lógica"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-gray-400">Correo de Contacto (Opcional)</label>
                  <input
                    type="email"
                    {...register("contactEmail")}
                    className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-white transition-colors text-white"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-gray-400 flex items-center gap-2">
                    <AlignLeft size={14} /> Biografía
                  </label>
                  <textarea
                    {...register("bio", { required: true })}
                    rows={4}
                    className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-white transition-colors resize-none text-white"
                    placeholder="¿Sobre qué investigas? ¿Cómo es tu proceso?"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-gray-400 flex items-center gap-2">
                      <MapPin size={14} /> Ubicación
                    </label>
                    <input
                      {...register("location", { required: true })}
                      className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-white transition-colors text-white"
                      placeholder="Ciudad, País"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-gray-400 flex items-center gap-2">
                      <PaintBucket size={14} /> Disciplina Principal
                    </label>
                    <select
                      {...register("discipline")}
                      className="w-full bg-[#111] border border-white/10 px-4 py-3 outline-none focus:border-white transition-colors appearance-none text-white"
                    >
                      {MOCK_DISCIPLINES.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#222] border border-white/10 p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <ImageIcon size={20} className="text-gray-400" />
                  Foto de Perfil y Estilo
                </h2>
                <div className="space-y-4">
                  <label className="text-xs tracking-wider uppercase text-gray-400">Seleccionar Imagen</label>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#111] overflow-hidden flex-shrink-0 border border-white/10">
                      {formValues.avatarUrl ? (
                        <img src={formValues.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-transparent focus:outline-none font-sans text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-sans file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer file:transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-gray-400">Color de Acento</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      {...register("themeColor")}
                      className="w-12 h-12 bg-transparent cursor-pointer border-none p-0"
                    />
                    <span className="text-sm text-gray-400 font-mono">Elige un color para destacar tu perfil</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#f5f3ef] text-[#1a1a1a] px-10 py-4 font-sans uppercase tracking-widest text-sm hover:bg-[#cc4f38] hover:text-white transition-colors"
              >
                <Save size={18} />
                {hasProfile ? "Guardar Cambios" : "Crear Perfil"}
              </button>

              {hasProfile && (
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="flex items-center justify-center gap-2 w-full md:w-auto border border-red-800/50 text-red-400 px-10 py-4 font-sans uppercase tracking-widest text-sm hover:bg-red-900/30 hover:border-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  Eliminar perfil
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <h3 className="text-xs tracking-widest uppercase text-gray-500 mb-4 border-b border-white/10 pb-2">
                Vista Previa
              </h3>
              <div className="bg-gray-200 text-[#1a1a1a] overflow-hidden group">
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-300">
                  {previewUser.avatarUrl ? (
                    <img
                      src={previewUser.avatarUrl}
                      alt={previewUser.name}
                      className="w-full h-full object-cover filter contrast-[1.1] grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#111]">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0 border-t border-black/20 relative">
                  <h2
                    className="font-serif text-3xl font-bold mb-1 transition-colors mt-4"
                    style={{ color: previewUser.themeColor }}
                  >
                    {previewUser.name || "Tu Nombre"}
                  </h2>
                  <div className="flex justify-between items-center text-xs font-sans uppercase tracking-widest text-gray-500 mb-4">
                    <span>{previewUser.discipline}</span>
                    <span>{previewUser.location || "Ubicación"}</span>
                  </div>
                  <p className="font-sans text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {previewUser.bio || "Tu biografía aparecerá aquí..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}