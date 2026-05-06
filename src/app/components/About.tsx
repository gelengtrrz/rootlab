import React from "react";
import { motion } from "motion/react";
import image14 from "../../imports/image-14.png";

export function About() {
  return (
    <div className="w-full min-h-screen pt-32 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-4xl mx-auto pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#cc4f38] mb-8 block font-bold">
            Manifiesto
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-[#1a1a1a] leading-tight mb-16">
            El resultado es solo un <span className="font-sans uppercase not-italic tracking-tighter text-gray-300">accidente</span> del proceso.
          </h1>

          <div className="prose prose-lg prose-p:font-sans prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-8">
            <p className="text-2xl font-serif italic text-[#1a1a1a]">
              ¿Por qué RootLab pone el foco en el proceso creativo?
            </p>
            <p className="mt-4">
              En un mundo donde todo es inmediato, nos hemos acostumbrado a consumir el arte desde el impacto del primer segundo, y si, es importante, pero lo que no ves, también es arte. Todo lo que surge antes del resultado final, de la obra maestra, es el verdadero manifiesto de nuestra visión, de nuestro mundo interno, de nuestra manera de relacionarnos con el mundo que nos rodea. Todo lo que somos aparece en todo lo que hacemos, el artista como persona en el mundo que va tomando decisiones construye al creativo que lleva a cabo su arte.
            </p>

            <div className="flex flex-col md:flex-row gap-12 items-start mt-16">
              <div className="flex-1">
                <div className="border-l-4 border-black pl-8 py-2 bg-gray-50/50 pr-4 mb-16">
                  <p className="text-lg md:text-xl font-mono text-[#1a1a1a] leading-relaxed mb-0">
                    "Publicar pensamientos, dudas y avances ayuda al artista a crear desde una posición más consciente y saludable."
                  </p>
                </div>

                <p className="text-2xl font-serif italic text-[#1a1a1a] !mt-0">
                  El proceso tiene valor artístico propio.
                </p>
                <p className="mt-4">
                  Hay algo profundamente valioso en el simple acto de observar tu propio proceso. No para mejorarlo ni optimizarlo, sino para habitarlo. La industria ya tiene suficiente espacio para el producto final, RootLab es para lo que pasa antes.
                </p>
                
                <p>
                  En RootLab no hay "likes", ni contadores de visitas, ni algoritmos de popularidad. Queremos que el foco vuelva a la raíz.
                </p>
              </div>
              <div className="w-full md:w-5/12 shrink-0">
                <img 
                  src={image14} 
                  alt="Proceso creativo" 
                  className="w-full h-auto object-cover contrast-[1.05] brightness-[0.95] hover:brightness-100 transition-all duration-500 rounded-sm shadow-xl shadow-black/5"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic decorative element */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
    </div>
  );
}