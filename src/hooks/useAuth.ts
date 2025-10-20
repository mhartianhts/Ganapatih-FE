"use client";

import { useCallback, useState } from "react";
import { useSession } from "@/context/session-context";
import { ApiError, apiFetch } from "@/lib/api";

type AuthResponse = {
  token: string;
  refreshToken: string;
};

type RegisterResponse = {
  id: number;
  username: string;
};

type AuthError = {
  message: string;
  status?: number;
  details?: unknown;
};

export function useAuth() {
  const { setSession, clearSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = (await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })) as AuthResponse;

      setSession(result);
      return result;
    } catch (err) {
      const fallback = createAuthError(err);
      setError(fallback);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = (await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })) as RegisterResponse;

      return result;
    } catch (err) {
      const fallback = createAuthError(err);
      setError(fallback);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
    register,
    logout: clearSession,
    resetError: () => setError(null),
  };
}

function createAuthError(err: unknown): AuthError {
  if (err instanceof ApiError) {
    return {
      message: err.message,
      status: err.status,
      details: err.details,
    };
  }

  if (err instanceof Error) {
    return { message: err.message };
  }

  if (typeof err === "object" && err !== null) {
    if ("message" in err || "status" in err) {
      return {
        message: String((err as { message?: unknown }).message ?? "Terjadi kesalahan"),
        status: Number((err as { status?: unknown }).status ?? undefined),
      };
    }
  }

  return {
    message: "Terjadi kesalahan tak dikenal. Coba lagi nanti.",
  };
}

