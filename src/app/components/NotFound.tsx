import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif italic text-[#1a1a1a] mb-4">404</h1>
        <p className="font-sans text-xl uppercase tracking-widest text-gray-500 mb-8">Esta página es un borrador perdido.</p>
        <Link 
          to="/" 
          className="px-8 py-4 border border-[#1a1a1a] text-[#1a1a1a] font-sans uppercase tracking-widest text-sm hover:bg-[#1a1a1a] hover:text-[#f5f3ef] transition-colors inline-block"
        >
          Volver al archivo principal
        </Link>
      </motion.div>
      
      {/* Decorative chaotic element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[15rem] md:text-[20rem] text-black/5 select-none pointer-events-none transform -rotate-12 uppercase tracking-tighter">
        Vacío
      </div>
    </div>
  );
}
