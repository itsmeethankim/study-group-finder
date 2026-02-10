"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { fetchMe } from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean | null;
  setLoggedIn: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedInState] = useState<boolean | null>(null);

  const refreshAuth = async () => {
    const me = await fetchMe();
    setLoggedInState(me !== null);
  };

  const setLoggedIn = (value: boolean) => {
    setLoggedInState(value);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
