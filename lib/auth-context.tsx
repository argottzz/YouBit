"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import {
  authApi,
  clearSession,
  getStoredUser,
  getToken,
  persistSession,
} from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        clearSession();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    restore();
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const res = await authApi.login(input);
    if (!res?.token) throw new Error("Login gagal: token tidak diterima");
    persistSession({ token: res.token, user: res.data });
    setToken(res.token);
    setUser(res.data);
  }, []);

  const register = useCallback(
    async (input: { username: string; email: string; password: string }) => {
      const res = await authApi.register(input);
      if (!res?.token) throw new Error("Register gagal: token tidak diterima");
      persistSession({ token: res.token, user: res.data });
      setToken(res.token);
      setUser(res.data);
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!token,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
