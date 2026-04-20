import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

export type CartItem = {
  id: string;
  source: "ShopZone" | "FoodRush" | "StyleHub";
  title: string;
  price: number;
  image: string;
  qty: number;
  meta?: Record<string, string>;
};

type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "zb-cart";

// Cart works offline-first via localStorage.
// When the user is authenticated, mutations are also pushed to the server.
export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load: from server if logged in, else localStorage
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/cart")
        .then((r) => {
          const serverItems = (r.data?.cart?.items || []).map((i: any) => ({
            id: i.itemId,
            source: i.source,
            title: i.title,
            price: i.price,
            image: i.image,
            qty: i.qty,
            meta: i.meta }));
          if (serverItems.length) setItems(serverItems);
        })
        .catch(() => {
          /* fall back to local */
        });
    } else {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch {
          /* ignore */
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const pushAdd = (item: CartItem) => {
    if (!isAuthenticated) return;
    api.post("/cart/add", {
      itemId: item.id,
      source: item.source,
      title: item.title,
      price: item.price,
      image: item.image,
      qty: item.qty,
      meta: item.meta }).catch(() => {});
  };
  const pushUpdate = (id: string, qty: number) => {
    if (!isAuthenticated) return;
    api.put("/cart/update", { itemId: id, qty }).catch(() => {});
  };
  const pushRemove = (id: string) => {
    if (!isAuthenticated) return;
    api.delete(`/cart/remove/${id}`).catch(() => {});
  };
  const pushClear = () => {
    if (!isAuthenticated) return;
    api.delete("/cart/clear").catch(() => {});
  };

  const add: Ctx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      const next = found
        ? prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p))
        : [...prev, { ...item, qty }];
      pushAdd({ ...item, qty });
      return next;
    });
  };

  const remove: Ctx["remove"] = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    pushRemove(id);
  };
  const setQty: Ctx["setQty"] = (id, qty) => {
    setItems((prev) => (qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p))));
    pushUpdate(id, qty);
  };
  const clear = () => {
    setItems([]);
    pushClear();
  };

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + b.qty * b.price, 0), [items]);

  return <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
