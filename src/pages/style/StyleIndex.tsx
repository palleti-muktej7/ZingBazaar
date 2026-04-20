import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { SafeImage } from "@/components/ui-extras/SafeImage";
import { fashion, styleBrands, styleCategories, findFashion } from "@/lib/mock-data";
import { getRecent } from "@/lib/recent";
import { discountPct, inr } from "@/lib/format";

const TABS = ["Men", "Women", "Kids", "Sports", "Beauty"] as const;
type Tab = typeof TABS[number];

const NAV = [
  { label: "New In", href: "/style/listing" },
  { label: "Brands", href: "/style/listing" },
  { label: "Sale", href: "/deals" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Bag", href: "/cart" },
];

const TRENDING_TAGS = ["Linen", "Y2K", "Oversized", "Athleisure", "Co-ords", "Denim on Denim", "Pastel", "Streetwear", "Workwear", "Resort"];

const STYLE_OFFERS = [
  { title: "MIN. 50% OFF", note: "On 1000+ brands", bg: "linear-gradient(135deg,#ff006e,#8338ec)" },
  { title: "BUY 2 GET 1", note: "On select tees", bg: "linear-gradient(135deg,#fb5607,#ffbe0b)" },
  { title: "EXTRA 15%", note: "On ₹2999+", bg: "linear-gradient(135deg,#3a86ff,#06b6d4)" },
  { title: "FREE SHIP", note: "First order", bg: "linear-gradient(135deg,#10b981,#84cc16)" },
];



function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

function StyleHome() {
  const [tab, setTab] = useState<Tab>("Women");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  useEffect(() => { setRecentIds(getRecent("style")); }, []);
  const recentItems = useMemo(
    () => recentIds.map((id) => findFashion(id)).filter(Boolean) as typeof fashion,
    [recentIds],
  );
  const items = useMemo(() => {
    let r = fashion.filter((f) => f.category === tab);
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((f) => `${f.title} ${f.brand}`.toLowerCase().includes(q));
    if (activeTag) r = r.filter((f) => f.title.toLowerCase().includes(activeTag.toLowerCase()) || activeTag === "Oversized" || activeTag === "Streetwear");
    return r;
  }, [tab, query, activeTag]);
  // Search results across ALL categories with image-rich grid
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return fashion.filter((f) => `${f.title} ${f.brand} ${f.category}`.toLowerCase().includes(q));
  }, [query]);
  const sale = useCountdown(Date.now() + 1000 * 60 * 60 * 5);

  return (
    <div className="bg-white dark:bg-background">
      <AppBar app="style" links={NAV} />

      {/* Sub-tabs Ajio-style */}
      <div className="border-b bg-white dark:bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-3 text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap font-semibold tracking-wide ${tab === t ? "text-foreground underline underline-offset-[10px]" : "text-muted-foreground"}`}
              style={tab === t ? { textDecorationColor: "var(--style)", textDecorationThickness: "2px" } : undefined}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b bg-white dark:bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm">
            <span className="text-muted-foreground">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tab.toLowerCase()} — brands, products, styles`}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <Link to="/style/listing" className="hidden rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-secondary sm:inline-block">
            Filters
          </Link>
        </div>
      </div>

      {/* IMAGE-RICH SEARCH RESULTS */}
      {query.trim() && (
        <section id="style-search-results" className="scroll-mt-24 border-b bg-white dark:bg-card">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {searchResults.length} result{searchResults.length === 1 ? "" : "s"}
                <span className="text-muted-foreground"> for "{query}"</span>
              </h2>
              <button onClick={() => setQuery("")} className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                Clear ✕
              </button>
            </div>
            {searchResults.length === 0 ? (
              <div className="rounded border bg-card p-10 text-center text-muted-foreground">
                No matches. Try a different keyword.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {searchResults.slice(0, 30).map((f) => (
                  <Link key={f.id} to={`/style/items/${f.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <SafeImage src={f.image} alt={f.title} fallbackKeywords={f.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span
                        className="absolute left-2 top-2 rounded-sm px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ background: "var(--style)" }}
                      >
                        {discountPct(f.price, f.mrp)}% OFF
                      </span>
                      <span className="absolute right-2 top-2 rounded-sm bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {f.category}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="text-xs font-bold uppercase">{f.brand}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">{f.title}</div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold">{inr(f.price)}</span>
                        <span className="text-xs text-muted-foreground line-through">{inr(f.mrp)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Editorial banner */}
      <section className="relative overflow-hidden">
        <SafeImage
          src={`https://loremflickr.com/1800/700/${encodeURIComponent(tab.toLowerCase() + ",fashion,model")}?lock=style-banner-${tab}`}
          alt=""
          fallbackKeywords={`${tab.toLowerCase()},fashion`}
          className="h-[360px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col justify-center p-8 text-white sm:p-12">
          <div className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--style)" }}>
            New Season
          </div>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">The {tab} Edit.</h1>
          <p className="mt-3 max-w-sm text-sm text-white/80">A curation of fits, fabrics and finishes — handpicked for the season ahead.</p>
          <Link
            to="/style/listing"
            className="mt-6 w-fit rounded-none px-6 py-3 text-xs font-bold uppercase tracking-widest text-white"
            style={{ background: "var(--style)" }}
          >
            Shop {tab}
          </Link>
        </div>
      </section>

      {/* Sale countdown — Ajio-style */}
      <section
        className="border-b text-white"
        style={{ background: "var(--style)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-3 text-center sm:flex-row sm:text-left">
          <div className="text-sm font-bold uppercase tracking-widest">⚡ Flash Sale — Up to 70% OFF</div>
          <div className="flex items-center gap-2 font-mono text-sm">
            Ends in
            <span className="rounded bg-white/20 px-2 py-0.5 font-bold">{String(sale.h).padStart(2, "0")}</span>:
            <span className="rounded bg-white/20 px-2 py-0.5 font-bold">{String(sale.m).padStart(2, "0")}</span>:
            <span className="rounded bg-white/20 px-2 py-0.5 font-bold">{String(sale.s).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED OFFERS — vivid */}
      <section className="border-b" style={{ background: "linear-gradient(135deg, oklch(0.97 0.04 320), oklch(0.96 0.05 30))" }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h2 className="mb-3 text-lg font-extrabold uppercase tracking-wider">✨ Today's hottest deals</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STYLE_OFFERS.map((o) => (
              <Link
                key={o.title}
                to="/deals"
                className="rounded-2xl p-4 text-white shadow-lg transition hover:scale-[1.02]"
                style={{ background: o.bg }}
              >
                <div className="text-xl font-extrabold tracking-tight">{o.title}</div>
                <div className="text-xs opacity-90">{o.note}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending tags */}
      <section className="border-b bg-white dark:bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">Trending</span>
            {TRENDING_TAGS.map((t) => {
              const active = activeTag === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(active ? null : t)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${active ? "border-transparent text-white" : "bg-background hover:bg-secondary"}`}
                  style={active ? { background: "var(--style)" } : undefined}
                >
                  #{t}
                </button>
              );
            })}
            {activeTag && (
              <button onClick={() => setActiveTag(null)} className="shrink-0 text-xs font-bold text-muted-foreground hover:text-foreground">
                Clear ✕
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Brand strip */}
        <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">Shop by brand</h2>
        <div className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {styleBrands.map((b) => (
            <Link
              key={b}
              to="/style/listing"
              className="flex items-center justify-center rounded-md border bg-card p-4 text-xs font-bold uppercase tracking-wider hover:bg-secondary"
            >
              {b}
            </Link>
          ))}
        </div>

        {/* Shop by category — Ajio style 16 categories */}
        <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">Shop by category</h2>
        <div className="mb-12 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {styleCategories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setQuery(c.name);
                setTimeout(() => {
                  document.getElementById("style-search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 60);
              }}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 transition group-hover:scale-105" style={{ borderColor: "color-mix(in oklch, var(--style) 30%, transparent)" }}>
                <SafeImage src={`https://loremflickr.com/240/240/${encodeURIComponent(c.k)}?lock=stylecat-${c.name}`} fallbackKeywords={c.k} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Recently viewed */}
        {recentItems.length > 0 && (
          <>
            <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">Recently viewed</h2>
            <div className="mb-12 flex gap-3 overflow-x-auto pb-2">
              {recentItems.map((f) => (
                <Link key={f.id} to={`/style/items/${f.id}`} className="w-40 shrink-0">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <SafeImage src={f.image} alt={f.title} fallbackKeywords={f.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="pt-2 text-xs">
                    <div className="font-bold uppercase">{f.brand}</div>
                    <div className="line-clamp-1 text-muted-foreground">{f.title}</div>
                    <div className="font-bold">{inr(f.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">The {tab} Lookbook</h2>
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {[
            { t: "Workwear", k: "workwear,office,fashion" },
            { t: "Weekend", k: "casual,weekend,fashion" },
            { t: "Evening", k: "evening,party,fashion" },
          ].map((l) => (
            <Link key={l.t} to="/style/listing" className="group relative block aspect-[4/5] overflow-hidden">
              <SafeImage
                src={`https://loremflickr.com/700/900/${encodeURIComponent(l.k + "," + tab.toLowerCase())}?lock=look-${tab}-${l.t}`}
                alt={l.t}
                fallbackKeywords={l.k}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">{tab}</div>
                <div className="text-2xl font-extrabold">{l.t}</div>
                <div className="mt-1 text-xs underline underline-offset-4">Shop the look →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Trending strip */}
        <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">Trending Now</h2>
        <div className="mb-12 flex gap-3 overflow-x-auto pb-2">
          {items.slice(0, 8).map((f) => (
            <Link
              key={f.id}
              to={`/style/items/${f.id}`}
              className="w-44 shrink-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <SafeImage src={f.image} alt={f.title} fallbackKeywords={f.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                <span
                  className="absolute left-2 top-2 rounded-sm px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "var(--style)" }}
                >
                  {discountPct(f.price, f.mrp)}% OFF
                </span>
              </div>
              <div className="pt-2">
                <div className="text-xs font-bold uppercase">{f.brand}</div>
                <div className="line-clamp-1 text-xs text-muted-foreground">{f.title}</div>
                <div className="mt-1 flex items-baseline gap-2 text-sm">
                  <span className="font-bold">{inr(f.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{inr(f.mrp)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Big grid Ajio-style — square edges, brand-led copy */}
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-bold uppercase tracking-wider">{tab} — New Arrivals</h2>
          <Link to="/style/listing" className="text-xs font-bold uppercase tracking-wider hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((f) => (
            <Link
              key={f.id}
              to={`/style/items/${f.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <SafeImage
                  src={f.image}
                  alt={f.title}
                  fallbackKeywords={f.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute left-2 top-2 rounded-sm px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "var(--style)" }}
                >
                  {discountPct(f.price, f.mrp)}% OFF
                </span>
              </div>
              <div className="pt-2">
                <div className="text-sm font-bold uppercase">{f.brand}</div>
                <div className="line-clamp-1 text-xs text-muted-foreground">{f.title}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-bold">{inr(f.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{inr(f.mrp)}</span>
                  <span className="text-xs font-bold" style={{ color: "var(--style)" }}>
                    ({discountPct(f.price, f.mrp)}% off)
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StyleHome;
