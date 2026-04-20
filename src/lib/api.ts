import axios from "axios";

// Set this in .env: VITE_API_URL=https://your-deployed-api.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const TOKEN_KEY = "zb-token";
const REFRESH_KEY = "zb-refresh";

export const tokenStore = {
  get: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null),
  set: (token: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

api.interceptors.request.use((cfg) => {
  const t = tokenStore.get();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// Try refresh on 401 once
let refreshing: Promise<string | null> | null = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = tokenStore.getRefresh();
      if (!refresh) return Promise.reject(err);
      try {
        refreshing =
          refreshing ||
          axios
            .post(`${baseURL}/auth/refresh-token`, { refreshToken: refresh })
            .then((res) => {
              const newToken = res.data?.token;
              if (newToken) tokenStore.set(newToken, refresh);
              return newToken;
            })
            .finally(() => {
              refreshing = null;
            });
        const newToken = await refreshing;
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        tokenStore.clear();
      }
    }
    return Promise.reject(err);
  }
);

export default api;
