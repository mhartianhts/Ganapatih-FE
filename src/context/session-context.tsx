"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { registerTokenProvider } from "@/lib/api";

type SessionValue = {
  token: string;
  refreshToken: string;
};

type SessionContextValue = {
  session: SessionValue | null;
  setSession: (session: SessionValue) => void;
  clearSession: () => void;
  initializing: boolean;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionValue | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = window.localStorage.getItem(REFRESH_KEY);

    if (storedToken && storedRefreshToken) {
      setSessionState({ token: storedToken, refreshToken: storedRefreshToken });
    }

    setInitializing(false);
  }, []);

  const persistSession = useCallback((value: SessionValue | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (value) {
      window.localStorage.setItem(TOKEN_KEY, value.token);
      window.localStorage.setItem(REFRESH_KEY, value.refreshToken);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
    }
  }, []);

  const setSession = useCallback(
    (value: SessionValue) => {
      setSessionState(value);
      persistSession(value);
    },
    [persistSession]
  );

  const clearSession = useCallback(() => {
    setSessionState(null);
    persistSession(null);
  }, [persistSession]);

  const value = useMemo<SessionContextValue>(
    () => ({ session, setSession, clearSession, initializing }),
    [session, setSession, clearSession, initializing]
  );

  useEffect(() => {
    registerTokenProvider({
      getToken: () => session?.token ?? null,
      getRefreshToken: () => session?.refreshToken ?? null,
      setTokens: (tokens) => setSession(tokens),
      clear: () => clearSession(),
    });
  }, [session, setSession, clearSession]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession harus dipakai di dalam SessionProvider");
  }
  return context;
}

