import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui-extras/ProductCard";
import { products } from "@/lib/mock-data";

const PAGE = 8;

function Products() {
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const [brand, setBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"popular" | "low" | "high" | "rating">("popular");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = products.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (brand) r = r.filter((p) => p.brand === brand);
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [brand, maxPrice, minRating, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const visible = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6 rounded-2xl border bg-card p-5 h-fit lg:sticky lg:top-20">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Price (max)</h3>
          <input type="range" min={1000} max={15000} step={500} value={maxPrice} onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }} className="w-full accent-[color:var(--shop)]" />
          <div className="text-xs text-muted-foreground">Up to ₹{maxPrice.toLocaleString()}</div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Brand</h3>
          <div className="flex flex-wrap gap-2">
            <Chip active={brand === null} onClick={() => { setBrand(null); setPage(1); }}>All</Chip>
            {brands.map((b) => (
              <Chip key={b} active={brand === b} onClick={() => { setBrand(b); setPage(1); }}>{b}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Rating</h3>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map((r) => (
              <Chip key={r} active={minRating === r} onClick={() => { setMinRating(r); setPage(1); }}>
                {r === 0 ? "Any" : `${r}+`}
              </Chip>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{filtered.length} results</div>
          <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-full border bg-card px-3 py-1.5 text-sm">
            <option value="popular">Sort: Popular</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} to={`/shop/products/${p.id}`} image={p.image} title={p.title} subtitle={p.brand} price={p.price} mrp={p.mrp} rating={p.rating} accent="shop" />
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`h-9 min-w-9 rounded-full px-3 text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "border bg-card hover:bg-secondary"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-primary text-primary-foreground border-transparent" : "bg-background hover:bg-secondary"}`}>
      {children}
    </button>
  );
}

export default Products;
