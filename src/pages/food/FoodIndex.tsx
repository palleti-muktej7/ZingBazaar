import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FiMapPin, FiClock, FiStar, FiSearch, FiChevronDown,
  FiAward, FiPercent, FiTruck, FiZap, FiGift,
} from "react-icons/fi";
import { AppBar } from "@/components/layout/AppBar";
import { SafeImage } from "@/components/ui-extras/SafeImage";
import { restaurants, foodCategories, findRestaurant } from "@/lib/mock-data";
import { getRecent, getRecentOrders } from "@/lib/recent";

const NAV = [
  { label: "Offers", href: "#offers" },
  { label: "Help", href: "#" },
  { label: "Sign in", href: "/login" },
  { label: "Cart", href: "/cart" },
];

const PROMOS = [
  { icon: FiPercent, title: "60% OFF", note: "use ZINGNEW", bg: "linear-gradient(135deg,#ff7a18,#af002d)" },
  { icon: FiTruck, title: "Free delivery", note: "above ₹199", bg: "linear-gradient(135deg,#11998e,#38ef7d)" },
  { icon: FiAward, title: "Top rated", note: "4★+ kitchens", bg: "linear-gradient(135deg,#5b247a,#1bcedf)" },
  { icon: FiZap, title: "10-min meals", note: "instant kitchens", bg: "linear-gradient(135deg,#f7971e,#ffd200)" },
  { icon: FiGift, title: "₹125 OFF", note: "first 3 orders", bg: "linear-gradient(135deg,#ee0979,#ff6a00)" },
];

function FoodHome() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [recentOrders, setRecentOrders] = useState<ReturnType<typeof getRecentOrders>>([]);
  const [, tick] = useState(0);
  useEffect(() => {
    setRecentIds(getRecent("food"));
    setRecentOrders(getRecentOrders());
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const recentRestaurants = useMemo(
    () => recentIds.map((id) => findRestaurant(id)).filter(Boolean) as typeof restaurants,
    [recentIds],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (activeCat) {
        const a = activeCat.toLowerCase();
        const cuisineMatch = r.cuisine.some((c) => c.toLowerCase().includes(a));
        const nameMatch = r.name.toLowerCase().includes(a);
        if (!cuisineMatch && !nameMatch) return false;
      }
      if (q && !`${r.name} ${r.cuisine.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeCat]);

  return (
    <div>
      <AppBar app="food" links={NAV} />

      {/* Location + search */}
      <section className="border-b bg-white dark:bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center">
          <button className="flex items-center gap-2 rounded-lg border bg-secondary px-3 py-2 text-sm">
            <FiMapPin style={{ color: "var(--food)" }} />
            <span className="font-semibold">Home</span>
            <span className="hidden text-muted-foreground sm:inline">— 110001, New Delhi</span>
            <FiChevronDown />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <FiSearch className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              placeholder="Search for restaurants and food"
            />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED OFFERS — vivid backgrounds */}
      <section
        id="offers"
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.96 0.05 25), oklch(0.93 0.08 60))" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">🔥 Hot offers right now</h2>
            <Link to="/deals" className="text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: "var(--food)" }}>
              View all →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PROMOS.map(({ icon: Icon, title, note, bg }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl p-4 text-white shadow-lg transition hover:scale-[1.02]"
                style={{ background: bg }}
              >
                <div className="rounded-full bg-white/25 p-2.5 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold leading-tight">{title}</div>
                  <div className="text-xs opacity-90">{note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Active order tracker — Swiggy style */}
        {recentOrders.filter((o) => o.eta > Date.now()).map((o) => {
          const remainingMin = Math.max(1, Math.ceil((o.eta - Date.now()) / 60000));
          const totalMin = Math.ceil((o.eta - o.placedAt) / 60000);
          const progress = Math.min(100, Math.round(((Date.now() - o.placedAt) / (o.eta - o.placedAt)) * 100));
          return (
            <Link
              to="/orders"
              key={o.id}
              className="mb-8 block overflow-hidden rounded-2xl border-2 shadow-card"
              style={{ borderColor: "var(--food)" }}
            >
              <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="grid h-14 w-14 place-items-center rounded-full text-2xl text-white" style={{ background: "var(--food)" }}>
                  🛵
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--food)" }}>
                    Order on the way
                  </div>
                  <div className="font-bold">{o.restaurantName ?? "Your order"}</div>
                  <div className="text-xs text-muted-foreground">
                    Arriving in <b className="text-foreground">{remainingMin} min</b> · placed {Math.max(1, Math.round((Date.now() - o.placedAt) / 60000))} min ago
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full transition-all" style={{ width: `${progress}%`, background: "var(--food)" }} />
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Total: <b className="text-foreground">₹{o.total}</b><br />
                  ETA: {totalMin} min
                </div>
              </div>
            </Link>
          );
        })}

        {/* Recently ordered restaurants */}
        {recentRestaurants.length > 0 && (
          <section className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">Recently ordered from</h2>
              <span className="text-xs text-muted-foreground">Reorder in one tap</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentRestaurants.map((r) => (
                <Link key={r.id} to={`/food/restaurants/${r.id}`} className="w-56 shrink-0">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <SafeImage src={r.image} alt={r.name} fallbackKeywords={r.cuisine.join(",")} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-2 text-sm font-bold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.cuisine.join(", ")} · {r.eta}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* What's on your mind — clickable filter buttons */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">What's on your mind?</h2>
          {activeCat && (
            <button
              onClick={() => setActiveCat(null)}
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--food)" }}
            >
              Clear: {activeCat} ✕
            </button>
          )}
        </div>
        <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
          {foodCategories.map((c) => {
            const active = activeCat === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  setActiveCat(active ? null : c.name);
                  setTimeout(() => {
                    document.getElementById("food-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 60);
                }}
                className="flex w-24 shrink-0 flex-col items-center gap-2 text-center transition hover:scale-105"
              >
                <div
                  className="h-20 w-20 overflow-hidden rounded-full border-2 transition"
                  style={{
                    borderColor: active ? "var(--food)" : "color-mix(in oklch, var(--food) 30%, transparent)",
                    boxShadow: active ? "0 0 0 3px color-mix(in oklch, var(--food) 25%, transparent)" : undefined,
                  }}
                >
                  <SafeImage src={c.img} alt={c.name} fallbackKeywords={c.name} className="h-full w-full object-cover" />
                </div>
                <span className={`text-xs font-semibold ${active ? "text-foreground" : ""}`} style={active ? { color: "var(--food)" } : undefined}>
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Top offers strip */}
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-bold">Top offers for you</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {restaurants.slice(0, 8).map((r) => (
              <Link key={r.id} to={`/food/restaurants/${r.id}`} className="w-72 shrink-0 overflow-hidden rounded-2xl border bg-card shadow-card">
                <div className="relative aspect-[16/10]">
                  <SafeImage src={r.image} alt={r.name} fallbackKeywords={r.cuisine.join(",")} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase text-white" style={{ background: "var(--food)" }}>
                      {r.offer}
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">{r.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top brands */}
        <h2 className="mb-4 text-xl font-bold">Top brands for you</h2>
        <div className="mb-10 flex gap-4 overflow-x-auto pb-2">
          {restaurants.slice(8, 16).map((r) => (
            <Link key={r.id} to={`/food/restaurants/${r.id}`} className="w-40 shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <SafeImage src={r.image} alt={r.name} fallbackKeywords={r.cuisine.join(",")} className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 text-sm font-bold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.eta}</div>
            </Link>
          ))}
        </div>

        {/* Restaurants grid */}
        <h2 id="food-results" className="mb-4 scroll-mt-24 text-xl font-bold">
          {filtered.length} restaurants {activeCat ? `for ${activeCat}` : "near you"}
        </h2>
        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
            No restaurants match. Try clearing the filter or search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <Link key={r.id} to={`/food/restaurants/${r.id}`} className="group block overflow-hidden rounded-2xl">
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                  <SafeImage
                    src={r.image}
                    alt={r.name}
                    fallbackKeywords={r.cuisine.join(",")}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {r.offer && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-sm font-bold text-white">{r.offer}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 pt-3">
                  <div className="font-bold">{r.name}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-white" style={{ background: r.rating >= 4 ? "oklch(0.55 0.15 145)" : "oklch(0.6 0.15 80)" }}>
                      <FiStar fill="currentColor" /> {r.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><FiClock /> {r.eta}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{r.cuisine.join(", ")}</div>
                  <div className="text-sm text-muted-foreground">₹{r.priceForTwo} for two</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodHome;
