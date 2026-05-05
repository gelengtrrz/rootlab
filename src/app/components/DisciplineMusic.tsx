import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useRootLab } from "../context/RootLabContext";
import musicCollage from "../../imports/image-1.png";

export function DisciplineMusic() {
  const { artists, processFeed, getArtistProjects } = useRootLab();

  const musicArtists = artists.filter(a => a.discipline === "Música");

  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative bg-[#1a1a1a] text-[#f5f3ef]">
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
            Música
          </h1>
          <p className="font-sans text-gray-400 mt-6 tracking-widest uppercase text-sm">
            Procesos creativos sonoros
          </p>
        </motion.header>

        {/* Collage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="w-full mb-24 flex justify-center items-center gap-6"
        >
          {/* Left quotes */}
          <div className="hidden lg:flex flex-col justify-between gap-10 max-w-[200px] self-stretch py-4">
            <p
              className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide"
              style={{ fontWeight: 100 }}
            >
              "It's absolutely essential that I get surprised and excited by what I'm doing, even if it's just for me. I think process is quite important. To allow the accidental to take place is often very good. So, I trick myself into things like that."
              <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— David Bowie, Classic Rock Magazine, 2001</span>
            </p>
            <p
              className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide"
              style={{ fontWeight: 100 }}
            >
              "Writing is a very natural process for me. I wait for when I've been through some horrible thing and…write about it."
              <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Amy Winehouse, PRS for Music – M Magazine, 2004</span>
            </p>
          </div>

          {/* Collage image — unchanged */}
          <img
            src={musicCollage}
            alt="Collage Música"
            className="max-w-lg w-full object-cover"
          />

          {/* Right quotes */}
          <div className="hidden lg:flex flex-col justify-between gap-10 max-w-[200px] self-stretch py-4">
            <p
              className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide"
              style={{ fontWeight: 100 }}
            >
              "The real work of the artist is a way of being in the world."
              <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Rick Rubin, The Creative Act: A Way of Being</span>
            </p>
            <p
              className="font-serif italic text-[11px] leading-relaxed text-[#f5f3ef]/40 tracking-wide"
              style={{ fontWeight: 100 }}
            >
              "I like to be around creation. I don't think there can be a time limit on creativity, like, 'Oh you have two hours in the studio'. It's all about creating an environment that you feel comfortable in, and I like having other people that do that, too."
              <span className="block not-italic font-sans text-[9px] tracking-widest uppercase text-[#f5f3ef]/25 mt-2">— Mac Miller, Clash Magazine, 2014</span>
            </p>
          </div>
        </motion.div>

        {/* Artistas musicales */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="font-serif italic text-3xl md:text-4xl text-[#f5f3ef] mb-12 border-b border-white/10 pb-6">
            Artistas y sus procesos
          </h2>

          {musicArtists.length === 0 ? (
            <p className="font-sans text-gray-500 tracking-widest uppercase text-sm">
              Aún no hay artistas musicales en el directorio.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {musicArtists.map((artist, i) => {
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

                      {/* Avatar */}
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