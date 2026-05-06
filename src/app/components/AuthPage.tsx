import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

// Maps Supabase error messages to friendly Spanish strings
function parseAuthError(message: string): string {
  if (!message) return "Ha ocurrido un error. Inténtalo de nuevo.";
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already in use"))
    return "Este correo ya está en uso.";
  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid credentials") ||
    m.includes("invalid email or password")
  )
    return "Correo o contraseña incorrectos.";
  if (m.includes("user not found"))
    return "No existe ninguna cuenta con este correo.";
  if (m.includes("weak password") || m.includes("should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return "Error de red. Comprueba tu conexión.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Espera un momento.";
  if (m.includes("email not confirmed") || m.includes("confirma"))
    return "Confirma tu correo antes de iniciar sesión.";
  // Fallback: show the original message (Supabase messages are user-readable)
  return message;
}

// Minimal Google "G" SVG logo
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, firebaseUser, authLoading } =
    useAuth();
  const navigate = useNavigate();

  // Redirect once authenticated (handles both email and OAuth flows)
  useEffect(() => {
    if (!authLoading && firebaseUser) {
      navigate("/mi-perfil");
    }
  }, [firebaseUser, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      navigate("/mi-perfil");
    } catch (err: any) {
      setError(parseAuthError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth is a full-page redirect — no async/catch needed
  const handleGoogle = () => {
    setLoading(true);
    signInWithGoogle(); // browser navigates away; this never returns
  };

  return (
    <div className="w-full min-h-screen pt-32 px-6 flex items-start justify-center relative overflow-hidden bg-[#1a1a1a] text-[#f5f3ef]">
      {/* Auras */}
      <motion.div
        animate={{ opacity: [0.53, 0.05, 0.53] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 right-10 w-64 h-64 bg-[#cc4f38] rounded-full filter blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.53, 0.05, 0.53] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[26%] -left-10 w-72 h-72 bg-[#c4520a] rounded-full filter blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10 pb-24"
      >
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-serif italic mb-2">
          {mode === "login" ? "Entrar" : "Únete al archivo"}
        </h1>
        <p className="font-sans text-gray-400 text-sm mb-10 tracking-wide">
          {mode === "login"
            ? "Accede a tu cuenta para documentar tu proceso."
            : "Crea una cuenta y empieza a construir tu archivo creativo."}
        </p>

        {/* Mode toggle */}
        <div className="flex border-b border-white/10 mb-10">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={`px-0 pb-3 mr-8 font-sans text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                mode === m
                  ? "border-[#cc4f38] text-[#f5f3ef]"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Google OAuth button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-white/20 py-4 font-sans text-xs uppercase tracking-widest hover:border-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-3 mb-8 disabled:opacity-40"
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-sans text-xs uppercase tracking-widest text-gray-500">o</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest text-gray-400">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border-b border-white/20 pb-3 focus:outline-none focus:border-white transition-colors font-sans text-base text-[#f5f3ef] placeholder:text-gray-600"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-widest text-gray-400">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-transparent border-b border-white/20 pb-3 focus:outline-none focus:border-white transition-colors font-sans text-base text-[#f5f3ef] placeholder:text-gray-600"
              placeholder={mode === "register" ? "Mínimo 6 caracteres" : "••••••••"}
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5f3ef] text-[#1a1a1a] py-4 font-sans uppercase tracking-widest text-xs hover:bg-[#cc4f38] hover:text-white transition-colors disabled:opacity-40"
          >
            {loading ? "Un momento..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="font-sans text-xs text-gray-500 mt-8 tracking-wide">
          {mode === "login" ? (
            <>
              ¿Todavía no tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className="text-[#cc4f38] hover:opacity-70 transition-opacity"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-[#cc4f38] hover:opacity-70 transition-opacity"
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>

        <p className="font-sans text-xs text-gray-600 mt-6 tracking-wide">
          <Link to="/" className="hover:text-gray-400 transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
