import { useEffect, useMemo, useState } from "react";
import { deals } from "@/lib/mock-data";
import { discountPct, inr } from "@/lib/format";

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  return now;
}

function fmtCountdown(ms: number) {
  if (ms <= 0) return "Ended";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
}

const FILTERS = ["All", "ShopZone", "FoodRush", "StyleHub"] as const;

function Deals() {
  const now = useNow();
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [sort, setSort] = useState<"discount" | "low" | "high">("discount");

  const list = useMemo(() => {
    let r = filter === "All" ? deals : deals.filter((d) => d.source === filter);
    if (sort === "discount") r = [...r].sort((a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [filter, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Live now</div>
        <h1 className="mt-1 text-4xl font-bold sm:text-5xl">Today's Deals</h1>
        <p className="mt-2 text-muted-foreground">Hand-picked offers from across the bazaar — refreshed every hour.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${filter === f ? "bg-primary text-primary-foreground border-transparent" : "bg-card hover:bg-secondary"}`}>
              {f}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-full border bg-card px-3 py-1.5 text-sm">
          <option value="discount">Sort: Highest discount</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => {
          const off = discountPct(d.price, d.mrp);
          const accent = d.source === "ShopZone" ? "var(--shop)" : d.source === "FoodRush" ? "var(--food)" : "var(--style)";
          return (
            <div key={d.id} className="overflow-hidden rounded-2xl border bg-card shadow-card">
              <div className="relative aspect-[5/3]">
                <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: accent }}>{d.source}</span>
                <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">{off}% OFF</span>
              </div>
              <div className="p-4">
                <div className="line-clamp-1 font-semibold">{d.title}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold">{inr(d.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{inr(d.mrp)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Ends in</span>
                  <span className="font-mono font-bold">{fmtCountdown(d.endsAt - now)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Deals;
