import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useRootLab, Discipline } from "../context/RootLabContext";
import { Filter } from "lucide-react";

export function Explore() {
  const { projects, getArtistBySlug, artists } = useRootLab();
  const [activeFilter, setActiveFilter] = useState<Discipline | "All">("All");

  const disciplines: (Discipline | "All")[] = [
    "All", "Música", "Artes plásticas", "Danza", "Fotografía / Filmmaking", "Escritura", "Diseño gráfico / Ilustración"
  ];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.discipline === activeFilter);

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-16 border-b border-black/10 pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-8xl font-serif italic mb-6 text-[#1a1a1a]"
          >
            Explorar Archivo
          </motion.h1>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <p className="font-sans text-gray-600 max-w-lg">
              Descubre proyectos en desarrollo. El archivo vivo de los artistas de RootLab.
            </p>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              <Filter size={18} className="text-gray-400" />
              {disciplines.map(disc => (
                <button
                  key={disc}
                  onClick={() => setActiveFilter(disc)}
                  className={`whitespace-nowrap px-4 py-2 font-sans text-sm tracking-widest uppercase transition-colors rounded-full border ${activeFilter === disc ? "bg-[#1a1a1a] text-[#f5f3ef] border-[#1a1a1a]" : "bg-transparent text-gray-500 border-gray-300 hover:border-[#1a1a1a]"}`}
                >
                  {disc === "All" ? "Todos" : disc}
                </button>
              ))}
            </div>
          </div>
        </header>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="2rem">
            {filteredProjects.map((project, i) => {
              const artist = artists.find(a => a.id === project.artistId);
              if (!artist) return null;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <Link to={`/artistas/${artist.slug}`} className="block">
                    <div className="relative overflow-hidden mb-4">
                      <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 font-sans text-xs uppercase tracking-widest">
                        {project.discipline}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <img 
                        src={artist.avatarUrl} 
                        alt={artist.name} 
                        className="w-10 h-10 rounded-full object-cover grayscale border border-black/20"
                      />
                      <div>
                        <h3 className="font-serif italic text-2xl group-hover:text-[#cc4f38] transition-colors">
                          {project.title}
                        </h3>
                        <p className="font-sans font-bold text-sm uppercase tracking-wide mt-1">
                          {artist.name}
                        </p>
                        <p className="font-sans text-xs text-gray-500 mt-1">
                          {artist.location}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

      </div>
    </div>
  );
}
