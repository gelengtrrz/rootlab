import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { db, ProfileRow } from "../../lib/supabase";

export function Artists() {
  const [artists, setArtists] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtists = async () => {
      const { data } = await db.profiles.loadAll();
      if (data) setArtists(data);
      setLoading(false);
    };
    loadArtists();
  }, []);

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 pb-8 border-b border-black/10 flex flex-col md:flex-row justify-between items-end">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-[#1a1a1a]"
          >
            Directorio <br />
            <span className="text-4xl md:text-6xl text-gray-400 font-sans tracking-tight uppercase">de Artistas</span>
          </motion.h1>
          <Link
            to="/mi-perfil"
            className="mt-8 md:mt-0 px-8 py-4 bg-[#1a1a1a] text-[#f5f3ef] font-sans uppercase tracking-widest text-xs hover:bg-[#cc4f38] transition-colors"
          >
            Unirme al directorio
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-sans text-xs uppercase tracking-widest text-gray-400">Cargando artistas...</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-serif italic text-xl text-gray-400">Aún no hay artistas en el directorio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {artists.map((artist, i) => (
              <motion.div
                key={artist.user_id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/artistas/${artist.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-200">
                    {artist.avatar_url ? (
                      <img
                        src={artist.avatar_url}
                        alt={artist.name}
                        className="w-full h-full object-cover filter contrast-[1.1] grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="font-serif text-4xl text-gray-500">{artist.name?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-black/20 pt-4 relative">
                    <h2 className="font-serif text-3xl font-bold group-hover:text-[#cc4f38] transition-colors mb-1">
                      {artist.name}
                    </h2>
                    <div className="flex justify-between items-center text-xs font-sans uppercase tracking-widest text-gray-500 mb-4">
                      <span>{artist.discipline}</span>
                      <span>{artist.location}</span>
                    </div>
                    <p className="font-sans text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {artist.bio}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-mono uppercase tracking-widest text-xs text-gray-400 group-hover:text-[#cc4f38] transition-colors">
                        Ver proceso &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}