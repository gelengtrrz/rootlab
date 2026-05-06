import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useRootLab } from "../context/RootLabContext";
import imgLeft from "../../imports/image-20.png";
import imgRight from "../../imports/image-18.png";

export function DisciplineDisenoGrafico() {
  const { artists, processFeed } = useRootLab();
  const filtered = artists.filter(a => a.discipline === "Diseño gráfico / Ilustración");

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative bg-[#1a1a1a] text-[#f5f3ef] overflow-hidden">
      <div className="max-w-7xl mx-auto pb-32">

        {/* Header */}
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
            Diseño Gráfico / Ilustración
          </h1>
          <p className="font-sans text-gray-400 mt-4 tracking-widest uppercase text-sm">
            La imagen como sistema de pensamiento
          </p>
        </motion.header>

        {/* Díptico con frases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="w-full mb-28 flex items-center gap-16 justify-center"
        >
          {/* Imagen izquierda */}
          <div className="flex-shrink-0">
            <img
              src={imgLeft}
              alt="Diseño gráfico izquierda"
              className="block"
              style={{ height: "440px", width: "auto" }}
            />
          </div>

          {/* Espacio central con frases */}
          <div className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[280px] flex flex-col justify-between items-center px-6 py-10 self-stretch">
            <p
              className="font-serif italic text-[9px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
              style={{ fontWeight: 100 }}
            >
              "The nature of process involves failure. You have at it. It doesn't work. You keep pushing [...] Then you desperately stab at it, believing this isn't going to work. And it does!"
              <span className="block not-italic font-sans text-[8px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">
                — Saul Bass, A Life in Film &amp; Design, 2011
              </span>
            </p>
            <div className="w-px flex-1 bg-white/10 my-8" />
            <p
              className="font-serif italic text-[10px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
              style={{ fontWeight: 100 }}
            >
              "I allow the subconscious part of my brain to work. That's the accumulation of my whole life."
              <span className="block not-italic font-sans text-[8px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">
                — Paula Scher, How to Think Like a Great Graphic Designer, 2012
              </span>
            </p>
            <div className="w-px flex-1 bg-white/10 my-8" />
            <p
              className="font-serif italic text-[9px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
              style={{ fontWeight: 100 }}
            >
              "I see myself as a kind of translator, translating an audio event into a visual event. I use real elements in unreal ways."
              <span className="block not-italic font-sans text-[8px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">
                — Storm Thorgerson, The Guardian, 2013
              </span>
            </p>
          </div>

          {/* Imagen derecha */}
          <div className="flex-shrink-0">
            <img
              src={imgRight}
              alt="Diseño gráfico derecha"
              className="block"
              style={{ height: "440px", width: "auto" }}
            />
          </div>
        </motion.div>

        {/* Artistas */}
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
              Aún no hay artistas de diseño gráfico / ilustración en el directorio.
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
  );
}