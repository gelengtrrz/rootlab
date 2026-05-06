import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import artStudioImg from "figma:asset/3cb444fa11f83cdf2addb289ecac77d28057f810.png";
import musicStudioImg from "figma:asset/9620de98cadb74414727747f3beb63b5558186ab.png";
import blurredPersonImg from "figma:asset/981712c06163159a080a448a5323b123ffe15e04.png";

export function Home() {
  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative overflow-x-hidden">
      {/* Background abstract elements */}
      <motion.div
        animate={{ opacity: [0.53, 0.05, 0.53] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 right-10 w-64 h-64 bg-[#cc4f38] rounded-full filter blur-3xl"
      />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#8c8881] rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      {/* Warm brown aura — in sync with orange */}
      <motion.div
        animate={{ opacity: [0.53, 0.05, 0.53] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[26%] -left-10 w-72 h-72 bg-[#c4520a] rounded-full filter blur-3xl"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16 md:mb-32 mt-8 md:mt-14 flex flex-col items-center text-center"
        >
          <h1 
            className="text-4xl md:text-6xl lg:text-8xl leading-none uppercase tracking-tighter mix-blend-difference text-[#2b1a10] font-['Rubik_Glitch']"
            style={{ transform: 'scale(1.084, 0.916)' }}
          >
            Lo que <span className="text-[#8c8881] opacity-30 hover:opacity-100 hover:text-[#cc4f38] transition-all duration-300 cursor-default">no ves</span> <br/>
            <span className="italic font-serif font-light lowercase text-[#cc4f38]">también</span> es arte.
          </h1>
          <h2 className="text-base md:text-xl lg:text-2xl mt-6 font-serif italic font-light text-gray-800" style={{ transform: 'scale(0.985)' }}>
            ¿Cómo se disfruta de crear si no es en el camino?
          </h2>
          <h3 className="text-sm md:text-base lg:text-lg mt-8 font-sans uppercase tracking-widest font-medium text-gray-900" style={{ transform: 'scale(0.985)' }}>
            Sin proceso no hay resultado.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start pb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg prose-p:font-sans prose-p:leading-relaxed prose-p:text-gray-700"
          >
            <p className="text-lg md:text-xl font-serif italic font-light">
              "La idea nace de la raíz. Desde RootLab queremos visibilizar el proceso creativo desde el origen, valorar la construcción del artista por encima del producto y con ello inspirar a otros a crear desde la calidad de sus ideas disfrutando del camino."
            </p>
            
            <div className="mt-12 flex gap-6">
              <Link 
                to="/explorar" 
                className="px-8 py-4 bg-[#1a1a1a] text-[#f5f3ef] font-sans uppercase tracking-widest text-sm hover:bg-[#cc4f38] transition-colors"
              >
                Explorar archivo
              </Link>
              <Link 
                to="/publicar-proceso" 
                className="px-8 py-4 border border-[#1a1a1a] text-[#1a1a1a] font-sans uppercase tracking-widest text-sm hover:bg-[#1a1a1a] hover:text-[#f5f3ef] transition-colors"
              >
                Publicar proceso
              </Link>
            </div>
          </motion.div>

          {/* Collage / Imagery */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] w-full flex justify-center"
          >
            <motion.img 
              animate={{ y: [-15, 15, -15], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
              whileHover={{ scale: 1.05, zIndex: 50, rotate: 0, transition: { duration: 0.4 } }}
              src={artStudioImg} 
              alt="Art studio" 
              className="absolute top-0 right-4 md:right-10 w-3/4 md:w-2/3 h-[75%] object-cover shadow-lg cursor-pointer will-change-transform"
              style={{ zIndex: 10 }}
            />
            <motion.img 
              animate={{ y: [15, -15, 15], rotate: [0.5, -0.5, 0.5] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
              whileHover={{ scale: 1.05, zIndex: 50, rotate: 0, transition: { duration: 0.4 } }}
              src={blurredPersonImg} 
              alt="Editorial movement blur" 
              className="absolute top-20 left-0 w-[60%] md:w-1/2 h-[65%] object-cover shadow-2xl cursor-pointer will-change-transform"
              style={{ zIndex: 20 }}
            />
            <motion.img 
              animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
              whileHover={{ scale: 1.08, zIndex: 50, rotate: 0, transition: { duration: 0.4 } }}
              src={musicStudioImg} 
              alt="Music studio setup" 
              className="absolute bottom-4 md:bottom-10 right-10 md:right-20 w-1/2 md:w-2/5 h-[45%] object-cover shadow-xl border border-white/20 cursor-pointer will-change-transform"
              style={{ zIndex: 30 }}
            />
            <div className="absolute bottom-[15%] left-[5%] text-xs font-mono uppercase tracking-[0.3em] text-[#1a1a1a] transform -rotate-90 origin-bottom-left z-40 mix-blend-overlay opacity-80">
              Archivo · Vivo
            </div>
            <div className="absolute top-10 right-0 text-[8rem] font-serif italic text-black/5 z-0 select-none pointer-events-none transform translate-x-1/4">
              01
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
