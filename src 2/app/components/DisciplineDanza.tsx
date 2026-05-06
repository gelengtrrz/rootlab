import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useRootLab } from "../context/RootLabContext";
import imgCollage from "../../imports/image-11.png";

const imgLeft = "https://images.unsplash.com/photo-1760543318292-969bcb8aec07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsZXQlMjBkYW5jZXIlMjBzdGFnZSUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3NjM1NDM0M3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function DisciplineDanza() {
  const { artists, processFeed } = useRootLab();
  const filtered = artists.filter(a => a.discipline === "Danza");

  return (
    <div className="w-full min-h-screen pt-32 relative bg-[#1a1a1a] text-[#f5f3ef] overflow-hidden">

      {/* Header — con padding */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16 border-b border-white/20 pb-8"
          >
            <Link
              to="/disciplinas"
              className="font-sans text-xs uppercase tracking-[0.3em] text-[#cc4f38] mb-6 block hover:opacity-70 transition-opacity"
            >
              ← Disciplinas
            </Link>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-[#f5f3ef] leading-tight">
              Danza
            </h1>
            <p className="font-sans text-gray-400 mt-4 tracking-widest uppercase text-sm">
              El cuerpo como lenguaje creativo
            </p>
          </motion.header>
        </div>
      </div>

      {/* Díptico — fuera de cualquier contenedor con padding, verdadero ancho completo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="w-full mb-28 flex items-center justify-between"
        style={{ overflow: "visible" }}
      >
        {/* Imagen izquierda — collage, pegada al borde izquierdo */}
        <div className="flex-shrink-0">
          <img
            src={imgCollage}
            alt="Danza izquierda"
            className="block"
            style={{ height: "340px", width: "auto" }}
          />
        </div>

        {/* Citas centrales — columna estrecha */}
        <div className="w-[220px] flex-shrink-0 flex flex-col justify-between items-center px-4 py-8">
          <div className="text-center">
            <p className="font-serif italic text-[#f5f3ef]/55 text-[10px] leading-relaxed tracking-wide">
              "I'm not so interested in how they move as in what moves them."
            </p>
            <p className="font-sans text-[#f5f3ef]/25 text-[8px] uppercase tracking-widest mt-2 not-italic">
              — Pina Bausch, The Guardian, "Step-by-step guide to dance: Pina Bausch/Tanztheater Wuppertal", Sanjoy Roy, 2010
            </p>
          </div>

          <div className="w-px h-8 bg-white/10 my-5" />

          <div className="text-center">
            <p className="font-serif italic text-[#f5f3ef]/55 text-[10px] leading-relaxed tracking-wide">
              "En realidad, la libertad es necesaria para la vida, tal cual, pero en un proceso creativo la falta de libertad es inaudita. No es compatible crear artísticamente con censuras de ninguna clase"
            </p>
            <p className="font-sans text-[#f5f3ef]/25 text-[8px] uppercase tracking-widest mt-2 not-italic">
              — Revista La Flamenca: Revista nº 3 / año 2004 Marzo Abril
            </p>
          </div>

          <div className="w-px h-8 bg-white/10 my-5" />

          <div className="text-center">
            <p className="font-serif italic text-[#f5f3ef]/55 text-[10px] leading-relaxed tracking-wide">
              "The ballet has to be in unison, but the energy comes at you not because of its perfect aesthetic or architectural vision, but because of the emotion."
            </p>
            <p className="font-sans text-[#f5f3ef]/25 text-[8px] uppercase tracking-widest mt-2 not-italic">
              — Benjamin Millepied: "It's Not A Matter Of Perfection", 2021
            </p>
          </div>
        </div>

        {/* Imagen derecha — ballet B&W, pegada al borde derecho */}
        <div className="flex-shrink-0">
          <img
            src={imgLeft}
            alt="Danza derecha"
            className="block"
            style={{ height: "340px", width: "auto" }}
          />
        </div>
      </motion.div>

      {/* Artistas — con padding */}
      <div className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-serif italic text-3xl md:text-4xl text-[#f5f3ef] mb-12 border-b border-white/10 pb-6">
              Artistas y sus procesos
            </h2>

            {filtered.length === 0 ? (
              <p className="font-sans text-gray-500 tracking-widest uppercase text-sm">
                Aún no hay artistas de danza en el directorio.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {filtered.map((artist, i) => {
                  const process = processFeed.filter(p => p.artistId === artist.id);
                  return (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="border border-white/10 group relative overflow-hidden"
                    >
                      <Link
                        to={`/artistas/${artist.slug}`}
                        className="block p-10 flex flex-col justify-between h-full"
                      >
                        <div className="absolute inset-0 bg-[#cc4f38] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />

                        <div className="relative z-10 w-16 h-16 rounded-full overflow-hidden mb-6 border border-white/20">
                          {artist.avatarUrl ? (
                            <img
                              src={artist.avatarUrl}
                              alt={artist.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/10" />
                          )}
                        </div>

                        <h3 className="relative z-10 font-serif text-2xl italic group-hover:text-white transition-colors mb-2">
                          {artist.name}
                        </h3>
                        <p className="relative z-10 font-sans text-xs uppercase tracking-widest text-gray-400 group-hover:text-white/80 transition-colors mb-4">
                          {artist.location}
                        </p>
                        <p className="relative z-10 font-sans text-sm text-gray-500 group-hover:text-white/70 transition-colors line-clamp-3">
                          {artist.bio}
                        </p>

                        <div className="relative z-10 mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          <span className="font-sans uppercase tracking-widest text-xs">
                            Ver proceso ({process.length}) →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}