import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokenStore } from "@/lib/api";

export type User = { id: string; name: string; email: string; profilePhoto?: string };
type Ctx = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap: if a token is present, fetch /me
  useEffect(() => {
    const t = tokenStore.get();
    if (!t) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => {
        const u = r.data?.user;
        if (u) setUser({ id: u._id || u.id, name: u.name, email: u.email, profilePhoto: u.profilePhoto });
      })
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  // OAuth callback handler — supports /auth/callback?token=...&refresh=...
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/auth/callback") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const refresh = params.get("refresh");
      if (token) {
        tokenStore.set(token, refresh || undefined);
        window.history.replaceState({}, "", "/dashboard");
        api.get("/auth/me").then((r) => {
          const u = r.data?.user;
          if (u) setUser({ id: u._id || u.id, name: u.name, email: u.email, profilePhoto: u.profilePhoto });
        });
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.set(data.token, data.refreshToken);
    setUser({ id: data.user.id || data.user._id, name: data.user.name, email: data.user.email });
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    tokenStore.set(data.token, data.refreshToken);
    setUser({ id: data.user.id || data.user._id, name: data.user.name, email: data.user.email });
  };

  const loginWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
