"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  clearSession,
  getStoredUser,
  getToken,
  persistSession,
} from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Pulihkan sesi saat refresh: verifikasi token ke backend via GET /api/me
  useEffect(() => {
    async function restore() {
      const savedToken = getToken();
      const savedUser = getStoredUser();

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.me(savedToken);
        setUser(res.data ?? savedUser);
        setToken(savedToken);
      } catch {
        // Token kadaluarsa / tidak valid -> bersihkan sesi
        clearSession();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    if (!res?.token) throw new Error("Login gagal: token tidak diterima");
    persistSession({ token: res.token, user: res.data });
    setToken(res.token);
    setUser(res.data);
    return res;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const res = await authApi.register({ username, email, password });
    if (!res?.token) throw new Error("Register gagal: token tidak diterima");
    persistSession({ token: res.token, user: res.data });
    setToken(res.token);
    setUser(res.data);
    return res;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isLoggedIn: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
