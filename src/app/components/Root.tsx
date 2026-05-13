import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";

export function Root() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, authLoading, signOut } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Explorar", path: "/explorar" },
    { name: "Artistas", path: "/artistas" },
    { name: "Disciplinas", path: "/disciplinas" },
    { name: "Sobre el proceso", path: "/sobre-el-proceso" },
    { name: "Publicar proceso", path: "/publicar-proceso" },
    { name: "Mi perfil", path: "/mi-perfil" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
<div className="noise-overlay pointer-events-none" style={{ opacity: 0.3 }}></div>
      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-[1200] pointer-events-none p-6 md:p-10 flex justify-between items-start">
        <Link 
          to="/" 
          className="pointer-events-auto mix-blend-difference hover:mix-blend-normal group w-1/3"
        >
        </Link>
        <div className={`w-1/3 flex ${menuOpen ? "justify-start" : "justify-center"} transition-all duration-300`}>
          {!menuOpen && location.pathname === "/" && (
            <h1 className="text-3xl md:text-5xl uppercase tracking-tighter pointer-events-auto mix-blend-difference group cursor-default" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="text-white group-hover:text-[#8B4513] transition-colors duration-300">Root</span>
              <span className="italic font-light text-white group-hover:text-[var(--color-rootlab-accent)] transition-colors duration-300">Lab</span>
            </h1>
          )}
          {!menuOpen && location.pathname !== "/" && (
            <Link 
              to="/" 
              className="pointer-events-auto mix-blend-difference hover:mix-blend-normal group"
            >
              <h1 className="text-3xl md:text-5xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white group-hover:text-[#8B4513]">Root</span>
                <span className="italic font-light text-white group-hover:text-[var(--color-rootlab-accent)]">Lab</span>
              </h1>
            </Link>
          )}
        </div>
        <div className="w-1/3 flex justify-end">
          {/* Mobile Nav Toggle */}
          <button 
            onClick={toggleMenu}
            className="pointer-events-auto mix-blend-difference hover:mix-blend-normal text-white p-2 group transition-all duration-300"
          >
            {menuOpen ? (
              <X size={32} />
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <line x1="4" x2="20" y1="6" y2="6" className="transition-colors duration-300 group-hover:stroke-[#8B4513]" />
                <line x1="4" x2="20" y1="12" y2="12" className="transition-colors duration-300 group-hover:stroke-[var(--color-rootlab-accent)]" />
                <line x1="4" x2="20" y1="18" y2="18" className="transition-colors duration-300 group-hover:stroke-[#8B4513]" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Nav */}
<div className="hidden pointer-events-auto absolute top-24 left-10 text-sm tracking-wider font-sans uppercase z-[1000] space-y-2 mix-blend-difference text-white/80 hover:text-white transition-colors">
  <nav className="flex flex-col items-start gap-4">
            {navLinks.slice(1).map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative group overflow-hidden ${location.pathname === link.path ? "text-white" : ""}`}
              >
                <span className="relative z-10">{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-px bg-current transform origin-left transition-transform duration-300 ${location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </Link>
            ))}
            {/* Auth link — desktop */}
            {!authLoading && (
              firebaseUser ? (
                <button
                  onClick={handleSignOut}
                  className="relative group overflow-hidden text-left"
                >
                  <span className="relative z-10">Cerrar sesión</span>
                  <span className="absolute bottom-0 left-0 w-full h-px bg-current transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              ) : (
                <Link
                  to="/auth"
                  className={`relative group overflow-hidden ${location.pathname === "/auth" ? "text-white" : ""}`}
                >
                  <span className="relative z-10">Entrar</span>
                  <span className={`absolute bottom-0 left-0 w-full h-px bg-current transform origin-left transition-transform duration-300 ${location.pathname === "/auth" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
className="fixed inset-0 bg-[#1a1a1a] z-[1100] flex items-center justify-center p-6"          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setMenuOpen(false)}
                    className="text-white hover:text-[#cc4f38] transition-colors duration-300 text-lg uppercase tracking-tighter"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Auth link — mobile menu */}
              {!authLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.1 + 0.3 }}
                >
                  {firebaseUser ? (
                    <button
                      onClick={handleSignOut}
                      className="text-white hover:text-[#cc4f38] transition-colors duration-300 text-lg uppercase tracking-tighter"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Cerrar sesión
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="text-white hover:text-[#cc4f38] transition-colors duration-300 text-lg uppercase tracking-tighter"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Entrar
                    </Link>
                  )}
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

<main className="flex-grow pt-0 pb-20 z-10 relative">        <Outlet />
      </main>

      <footer className="w-full bg-[#1a1a1a] text-white p-10 md:p-20 mt-auto z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="inline-block group cursor-pointer">
              <h2 className="text-3xl md:text-5xl uppercase tracking-tighter mb-6 transition-colors" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white group-hover:text-[#8B4513] transition-colors duration-300">Root</span>
                <span className="italic font-light text-white group-hover:text-[var(--color-rootlab-accent)] transition-colors duration-300">Lab</span>
              </h2>
            </Link>
            <p className="text-sm text-gray-400 font-sans max-w-sm leading-relaxed">
              Un archivo creativo vivo para artistas multidisciplinares. <br/>
              Sin jerarquías, sin métricas de popularidad.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 font-sans text-sm tracking-wider uppercase text-gray-300">
            <h3 className="text-white font-bold mb-2">Navegación</h3>
            <Link to="/explorar" className="hover:text-white transition-colors">Explorar Procesos</Link>
            <Link to="/artistas" className="hover:text-white transition-colors">Artistas</Link>
            <Link to="/mi-perfil" className="hover:text-white transition-colors">Mi Perfil</Link>
            <Link to="/sobre-el-proceso" className="hover:text-white transition-colors">Sobre Esta Iniciativa</Link>
            <Link to="/publicar-proceso" className="hover:text-white transition-colors">Publicar Proceso</Link>
          </div>

          <div className="flex flex-col gap-4 font-sans text-sm tracking-wider uppercase text-gray-300">
            <h3 className="text-white font-bold mb-2">Valores</h3>
            <span>Proceso sobre resultado</span>
            <span>Colaboración horizontal</span>
            <span>Sin métricas públicas</span>
            <span>Multidisciplinariedad</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-xs text-gray-500 font-sans tracking-widest uppercase flex justify-between">
          <span>2026</span>
          <span>Plataforma cultural independiente</span>
        </div>
      </footer>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
