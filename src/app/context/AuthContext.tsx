import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { sbAuth, SupabaseSession } from "../../lib/supabase";

// Minimal user shape – matches the `firebaseUser.uid` references used throughout the app
export interface AppUser {
  uid: string;   // Supabase UUID
  email: string;
}

interface AuthContextProps {
  firebaseUser: AppUser | null; // named "firebaseUser" for compatibility with existing components
  authLoading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function toAppUser(s: SupabaseSession | null): AppUser | null {
  return s ? { uid: s.uid, email: s.email } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise synchronously from localStorage / OAuth hash
  const [firebaseUser, setFirebaseUser] = useState<AppUser | null>(() =>
    toAppUser(sbAuth.init())
  );
  const [authLoading, setAuthLoading] = useState(false);

  // Keep state in sync whenever the session changes (e.g. sign-out from another tab)
  useEffect(() => {
    return sbAuth.onSessionChange((s) => setFirebaseUser(toAppUser(s)));
  }, []);

  // Background token refresh on mount — silently extends sessions near expiry
  useEffect(() => {
    const s = sbAuth.getSession();
    if (s?.refresh_token) sbAuth.refresh().catch(() => {});
  }, []);

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    const s = await sbAuth.signUpWithEmail(email, password);
    setFirebaseUser(toAppUser(s));
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    const s = await sbAuth.signInWithEmail(email, password);
    setFirebaseUser(toAppUser(s));
  };

  /**
   * Redirects the browser to Supabase → Google OAuth.
   * The returned Promise never resolves (page navigates away).
   * After OAuth, the user returns to the app origin; `sbAuth.init()`
   * reads the tokens from the URL hash and restores the session.
   */
  const signInWithGoogle = async (): Promise<void> => {
    sbAuth.signInWithGoogle(); // synchronous redirect
  };

  const signOut = async (): Promise<void> => {
    await sbAuth.signOut();
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        authLoading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
