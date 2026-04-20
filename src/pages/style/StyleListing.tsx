import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui-extras/ProductCard";
import { fashion } from "@/lib/mock-data";

function Listing() {
  const brands = Array.from(new Set(fashion.map((f) => f.brand)));
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(8000);
  const [sort, setSort] = useState<"new" | "low" | "high">("new");

  const filtered = useMemo(() => {
    let r = fashion.filter((f) => f.price <= maxPrice);
    if (size) r = r.filter((f) => f.sizes.includes(size));
    if (color) r = r.filter((f) => f.colors.includes(color));
    if (brand) r = r.filter((f) => f.brand === brand);
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [size, color, brand, maxPrice, sort]);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit space-y-5 rounded-2xl border bg-card p-5 lg:sticky lg:top-20">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["XS","S","M","L","XL"].map((s) => (
              <Chip key={s} active={size === s} onClick={() => setSize(size === s ? null : s)}>{s}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Color</h3>
          <div className="flex flex-wrap gap-2">
            {["Ink","Cream","Olive","Crimson"].map((c) => (
              <Chip key={c} active={color === c} onClick={() => setColor(color === c ? null : c)}>{c}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Brand</h3>
          <div className="flex flex-wrap gap-2">
            <Chip active={brand === null} onClick={() => setBrand(null)}>All</Chip>
            {brands.map((b) => (
              <Chip key={b} active={brand === b} onClick={() => setBrand(b)}>{b}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Price (max)</h3>
          <input type="range" min={500} max={8000} step={250} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[color:var(--style)]" />
          <div className="text-xs text-muted-foreground">Up to ₹{maxPrice}</div>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{filtered.length} items</div>
          <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="rounded-full border bg-card px-3 py-1.5 text-sm">
            <option value="new">Sort: New</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((f) => (
            <ProductCard key={f.id} to={`/style/items/${f.id}`} image={f.image} title={f.title} subtitle={f.brand} price={f.price} mrp={f.mrp} accent="style" aspect="aspect-[3/4]" />
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

export default Listing;
