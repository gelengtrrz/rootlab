import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useRootLab } from "../context/RootLabContext";

export function Disciplines() {
  const disciplines = [
    { label: "Música", path: "/disciplinas/musica" },
    { label: "Artes plásticas", path: "/disciplinas/artes-plasticas" },
    { label: "Danza", path: "/disciplinas/danza" },
    { label: "Fotografía / Filmmaking", path: "/disciplinas/fotografia-filmmaking" },
    { label: "Escritura", path: "/disciplinas/escritura" },
    { label: "Diseño gráfico / Ilustración", path: "/disciplinas/diseno-grafico-ilustracion" },
  ];

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative bg-[#1a1a1a] text-[#f5f3ef]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 border-b border-white/20 pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-[#f5f3ef]"          >
            Disciplinas
          </motion.h1>
          <p className="font-sans text-gray-400 mt-6 tracking-widest uppercase text-sm">
            Explora procesos a través del medio.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {disciplines.map((disc, i) => (
            <motion.div
              key={disc.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-b md:border-r border-white/10 group relative overflow-hidden"
            >
              <Link to={disc.path} className="block p-12 md:p-16 aspect-square flex flex-col justify-between h-full">
                <div className="absolute inset-0 bg-[#cc4f38] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                
                <h2 className="relative z-10 font-serif text-4xl md:text-5xl italic group-hover:text-white transition-colors">
                  {disc.label}
                </h2>
                
                <div className="relative z-10 mt-auto flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="font-sans uppercase tracking-widest text-xs">Explorar proyectos &rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}