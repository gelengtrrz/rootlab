import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useRootLab } from "../context/RootLabContext";
import imgLeft from "../../imports/image-13.png";
import imgRight from "../../imports/image1-1.png";

export function DisciplineEscritura() {
  const { artists, processFeed } = useRootLab();
  const filtered = artists.filter(a => a.discipline === "Escritura");

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
              Escritura
            </h1>
            <p className="font-sans text-gray-400 mt-4 tracking-widest uppercase text-sm">
              La palabra como proceso vivo
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
      >
        {/* Imagen izquierda — escritura, pegada al borde izquierdo */}
        <div className="flex-shrink-0" style={{ marginLeft: "-24px" }}>
          <img
            src={imgLeft}
            alt="Escritura izquierda"
            className="block"
            style={{ height: "360px", width: "auto" }}
          />
        </div>

        {/* Espacio central — citas */}
        <div className="flex-shrink-0 w-[160px] md:w-[200px] lg:w-[240px] flex flex-col justify-between items-center px-8 py-10">
          <p
            className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
            style={{ fontWeight: 100 }}
          >
            "Jamás vas a saber el resultado de ese proceso creativo, ni sabes qué van a decir los otros. Yo siempre tengo la impresión de que con cada novela me la juego, con cada novela empiezo de cero."
            <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Julia Navarro, Diario Correo, octubre de 2024</span>
          </p>
          <div className="w-px flex-1 bg-white/10 my-8" />
          <p
            className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
            style={{ fontWeight: 100 }}
          >
            "All you have to do is write one true sentence. Write the truest sentence that you know."
            <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Ernest Hemingway, A Moveable Feast, p.12, 1964</span>
          </p>
          <div className="w-px flex-1 bg-white/10 my-8" />
          <p
            className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide text-center"
            style={{ fontWeight: 100 }}
          >
            "Sólo se escribe lo que no está, lo que ya no queda, lo que es necesario apuntar, porque se olvida."
            <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Gata Cattana, "Desapariciones", La Escala de Mohs, 2016</span>
          </p>
        </div>

        {/* Imagen derecha — collage, pegada al borde derecho */}
        <div className="flex-shrink-0" style={{ background: "#1a1a1a" }}>
          <img
            src={imgRight}
            alt="Escritura derecha"
            className="block"
            style={{ height: "360px", width: "auto", mixBlendMode: "lighten" }}
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
                Aún no hay artistas de escritura en el directorio.
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