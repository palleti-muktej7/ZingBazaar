// Tiny localStorage-backed recents tracker for products, restaurants and fashion.
const KEY = (k: string) => `zb:recent:${k}`;
const MAX = 12;

export function pushRecent(kind: "shop" | "food" | "style", id: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY(kind));
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...list.filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY(kind), JSON.stringify(next));
  } catch {
    // Ignore localStorage errors
  }
}

export function getRecent(kind: "shop" | "food" | "style"): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY(kind));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentOrder(payload: { id: string; restaurantId?: string; restaurantName?: string; total: number; eta: number; placedAt: number; items: string[] }) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY("orders"));
    const list = raw ? JSON.parse(raw) : [];
    const next = [payload, ...list].slice(0, 10);
    localStorage.setItem(KEY("orders"), JSON.stringify(next));
  } catch {
    // Ignore localStorage errors
  }
}

export function getRecentOrders(): Array<{ id: string; restaurantId?: string; restaurantName?: string; total: number; eta: number; placedAt: number; items: string[] }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY("orders"));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
