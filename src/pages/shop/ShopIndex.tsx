import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getRecent } from "@/lib/recent";
import {
  FiChevronRight,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiCreditCard,
  FiSearch,
  FiX,
  FiStar,
} from "react-icons/fi";
import { AppBar } from "@/components/layout/AppBar";
import { ProductCard } from "@/components/ui-extras/ProductCard";
import { SafeImage } from "@/components/ui-extras/SafeImage";
import { products, shopCategories, shopBrands } from "@/lib/mock-data";
import { inr } from "@/lib/format";

const NAV = [
  { label: "Today's Deals", href: "/deals" },
  { label: "Electronics", href: "/shop/products" },
  { label: "Home", href: "/shop/products" },
  { label: "Beauty", href: "/shop/products" },
  { label: "Books", href: "/shop/products" },
  { label: "Sports", href: "/shop/products" },
];

const TRUST = [
  { icon: FiTruck, label: "Free delivery", note: "On orders over ₹499" },
  { icon: FiRefreshCw, label: "7-day returns", note: "Easy & free pickup" },
  { icon: FiShield, label: "Secure payments", note: "100% protected" },
  { icon: FiCreditCard, label: "EMI available", note: "No-cost EMI on cards" },
];

const COLORS = ["Black", "White", "Blue", "Red", "Beige", "Green"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

function ShopHome() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selCats, setSelCats] = useState<string[]>([]);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selSizes, setSelSizes] = useState<string[]>([]);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  useEffect(() => { setRecentIds(getRecent("shop")); }, []);
  const recentProducts = useMemo(
    () => recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [recentIds],
  );

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !`${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(q)) return false;
      if (selCats.length && !selCats.includes(p.category)) return false;
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (p.rating < minRating) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [query, selCats, selBrands, minRating, maxPrice]);

  const isSearching = query.trim().length > 0 || selCats.length || selBrands.length || selSizes.length || selColors.length || minRating > 0 || maxPrice < 15000;

  const clearAll = () => {
    setSelCats([]); setSelBrands([]); setSelSizes([]); setSelColors([]); setMinRating(0); setMaxPrice(15000); setQuery("");
  };

  return (
    <div>
      <AppBar app="shop" links={NAV} />

      {/* Amazon-style search bar */}
      <section className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border bg-background px-4 py-2.5 shadow-sm">
            <FiSearch className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <FiX />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: "var(--shop)" }}
          >
            {showFilters ? "Hide filters" : "Filters"}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t bg-background">
            <div className="mx-auto grid max-w-7xl gap-5 px-6 py-5 md:grid-cols-2 lg:grid-cols-4">
              <FilterGroup title="Category">
                <div className="flex flex-wrap gap-2">
                  {shopCategories.map((c) => (
                    <Chip key={c.id} active={selCats.includes(c.label)} onClick={() => toggle(selCats, setSelCats, c.label)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="Brand">
                <div className="flex flex-wrap gap-2">
                  {shopBrands.map((b) => (
                    <Chip key={b.name} active={selBrands.includes(b.name)} onClick={() => toggle(selBrands, setSelBrands, b.name)}>
                      {b.name}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="Size">
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <Chip key={s} active={selSizes.includes(s)} onClick={() => toggle(selSizes, setSelSizes, s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title="Colour">
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggle(selColors, setSelColors, c)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${selColors.includes(c) ? "border-primary bg-primary/10" : "bg-background hover:bg-secondary"}`}
                    >
                      <span
                        className="h-3 w-3 rounded-full border"
                        style={{ background: c.toLowerCase() === "beige" ? "#e8d8b7" : c.toLowerCase() }}
                      />
                      {c}
                    </button>
                  ))}
                </div>
              </FilterGroup>
              <FilterGroup title={`Price: up to ${inr(maxPrice)}`}>
                <input
                  type="range"
                  min={500}
                  max={15000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full accent-[color:var(--shop)]"
                />
              </FilterGroup>
              <FilterGroup title="Customer rating">
                <div className="flex flex-wrap gap-2">
                  {[4, 3, 2, 0].map((r) => (
                    <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>
                      {r === 0 ? "All" : (
                        <span className="flex items-center gap-1">
                          {r}<FiStar className="inline" />+
                        </span>
                      )}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>
              <div className="flex items-end justify-end md:col-span-2 lg:col-span-2">
                <button onClick={clearAll} className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-secondary">
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Search results */}
      {isSearching && (
        <section className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
                {query && <span className="text-muted-foreground"> for "{query}"</span>}
              </h2>
              <button onClick={clearAll} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                Reset
              </button>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                No products match your filters. Try clearing some.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {filteredProducts.slice(0, 20).map((p) => (
                  <ProductCard
                    key={p.id}
                    to={`/shop/products/${p.id}`}
                    image={p.image}
                    title={p.title}
                    subtitle={p.brand}
                    price={p.price}
                    mrp={p.mrp}
                    rating={p.rating}
                    accent="shop"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Wide editorial hero */}
      {!isSearching && (
        <>
          <section
            className="relative overflow-hidden border-b"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.95 0.04 80), oklch(0.99 0.01 80))",
            }}
          >
            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:py-16">
              <div className="flex flex-col justify-center">
                <div className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--shop)" }}>
                  Featured · Today only
                </div>
                <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
                  Big savings on tech, home & more.
                </h1>
                <p className="mt-3 max-w-md text-muted-foreground">
                  Up to 60% off across categories. Fast delivery, easy returns.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    to="/shop/products"
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ background: "var(--shop)" }}
                  >
                    Shop the sale
                  </Link>
                  <Link to="/deals" className="rounded-full border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
                    See all deals
                  </Link>
                </div>
              </div>
              <SafeImage
                src="https://loremflickr.com/1100/700/shopping,sale,bag?lock=shop-billboard"
                fallbackKeywords="shopping,sale"
                alt="Shop billboard"
                className="h-72 w-full rounded-2xl object-cover lg:h-full"
              />
            </div>
          </section>

          {/* Trust strip */}
          <section className="border-b bg-card">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 py-5 sm:grid-cols-4">
              {TRUST.map(({ icon: Icon, label, note }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="rounded-full p-2" style={{ background: "color-mix(in oklch, var(--shop) 15%, transparent)" }}>
                    <Icon style={{ color: "var(--shop)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6 py-10">
            <h2 className="mb-4 text-2xl font-bold">Shop by category</h2>
            <div className="mb-12 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
              {shopCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelCats([c.label]); setShowFilters(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex w-28 shrink-0 flex-col items-center gap-2 sm:w-auto"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2" style={{ borderColor: "color-mix(in oklch, var(--shop) 30%, transparent)" }}>
                    <SafeImage src={c.image} alt={c.label} fallbackKeywords={c.label} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold">{c.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shopCategories.slice(0, 4).map((c, i) => (
                <div key={c.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="text-base font-bold">{["Best of Electronics", "Refresh your home", "Beauty must-haves", "Top reads"][i]}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {products.slice(i * 4, i * 4 + 4).map((p) => (
                      <Link key={p.id} to={`/shop/products/${p.id}`} className="block overflow-hidden rounded-lg bg-secondary">
                        <SafeImage src={p.image} alt={p.title} fallbackKeywords={p.title} className="aspect-square w-full object-cover" />
                        <div className="px-1 py-1 text-[11px] font-medium line-clamp-1">{p.title}</div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/shop/products" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--shop)" }}>
                    See all <FiChevronRight />
                  </Link>
                </div>
              ))}
            </div>

            {recentProducts.length > 0 && (
              <>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-2xl font-bold">Recently viewed</h2>
                  <span className="text-xs text-muted-foreground">Picks from your last visits</span>
                </div>
                <div className="mb-12 flex gap-4 overflow-x-auto pb-4">
                  {recentProducts.map((p) => (
                    <div key={p.id} className="w-48 shrink-0">
                      <ProductCard
                        to={`/shop/products/${p.id}`}
                        image={p.image}
                        title={p.title}
                        subtitle={p.brand}
                        price={p.price}
                        mrp={p.mrp}
                        rating={p.rating}
                        accent="shop"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold">Recommended for you</h2>
              <Link to="/shop/products" className="text-sm font-semibold" style={{ color: "var(--shop)" }}>
                View all →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {products.slice(0, 12).map((p) => (
                <div key={p.id} className="w-56 shrink-0">
                  <ProductCard
                    to={`/shop/products/${p.id}`}
                    image={p.image}
                    title={p.title}
                    subtitle={p.brand}
                    price={p.price}
                    mrp={p.mrp}
                    rating={p.rating}
                    accent="shop"
                  />
                </div>
              ))}
            </div>

            <h2 className="mb-4 mt-12 text-2xl font-bold">Top brands</h2>
            <div className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {shopBrands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => { setSelBrands([b.name]); setShowFilters(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-secondary"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-full">
                    <SafeImage src={b.logo} alt={b.name} fallbackKeywords="logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold">{b.name}</span>
                </button>
              ))}
            </div>

            <h2 className="mb-4 mt-12 text-2xl font-bold">Inspired by your browsing</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(8, 16).map((p) => (
                <ProductCard
                  key={p.id}
                  to={`/shop/products/${p.id}`}
                  image={p.image}
                  title={p.title}
                  subtitle={p.brand}
                  price={p.price}
                  mrp={p.mrp}
                  rating={p.rating}
                  accent="shop"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${active ? "border-transparent bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}
    >
      {children}
    </button>
  );
}

export default ShopHome;
