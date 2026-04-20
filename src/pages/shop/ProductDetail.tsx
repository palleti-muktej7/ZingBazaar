import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiStar, FiShoppingBag, FiZap, FiCheck, FiChevronRight, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { findProduct, products } from "@/lib/mock-data";
import { discountPct, inr } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { pushRecent } from "@/lib/recent";
import { SafeImage } from "@/components/ui-extras/SafeImage";
import { toast } from "sonner";

const BULLETS = [
  "Premium materials with a refined matte finish",
  "Designed for daily use — built to last",
  "Compatible with most setups out of the box",
  "Includes 1-year manufacturer warranty",
  "Easy to clean, easy to love",
];
const SPECS = [
  ["Brand", null],
  ["Material", "Aluminum + recycled plastics"],
  ["Weight", "1.2 kg"],
  ["Dimensions", "30 × 20 × 8 cm"],
  ["In the box", "Main unit, USB-C cable, manual"],
  ["Warranty", "1 year limited"],
];
const QNA = [
  { q: "Does it work without an app?", a: "Yes — full functionality without any app or account." },
  { q: "Is it good for beginners?", a: "Absolutely, it ships ready to use." },
  { q: "How loud is it?", a: "Very quiet — about 35 dB on the normal setting." },
];

function ProductDetail() {
  const { id } = useParams() as { id: string };
  const product = findProduct(id || "");
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();
  useEffect(() => { if (product) pushRecent("shop", product.id); }, [product?.id]);
  // Build a guaranteed-unique gallery: dedupe URLs, then top-up with picsum-seeded uniques.
  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const g of product.gallery) {
      if (!seen.has(g)) { seen.add(g); unique.push(g); }
    }
    while (unique.length < 4) {
      unique.push(`https://picsum.photos/seed/${encodeURIComponent(product.id + "-g" + unique.length)}/800/800`);
    }
    return unique;
  }, [product?.id]);
  if (!product) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground">Not found</div>;

  const handleAdd = () => {
    add(
      { id: product.id, source: "ShopZone", title: product.title, price: product.price, image: product.image },
      qty,
    );
    toast.success("Added to cart");
  };
  const handleBuy = () => { handleAdd(); navigate("/checkout"); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-7xl px-6 py-6"
    >
      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">ShopZone</Link>
        <FiChevronRight />
        <Link to="/shop/products" className="hover:text-foreground">{product.category}</Link>
        <FiChevronRight />
        <span className="line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[80px_1fr_360px]">
        {/* thumbnail rail */}
        <div className="hidden flex-col gap-2 lg:flex">
          {gallery.map((g: string, i: number) => (
            <button
              key={g + i}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-lg border ${active === i ? "ring-2" : ""}`}
              style={active === i ? { boxShadow: "0 0 0 2px var(--shop)" } : undefined}
            >
              <SafeImage src={g} alt="" fallbackKeywords={`${product.title} ${i}`} className="h-16 w-16 object-cover" />
            </button>
          ))}
        </div>

        {/* main image */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <SafeImage
                src={gallery[active]}
                alt={product.title}
                fallbackKeywords={`${product.title} ${active}`}
                className="aspect-square w-full rounded-2xl border bg-card object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex gap-2 lg:hidden">
            {gallery.map((g: string, i: number) => (
              <button key={g + i} onClick={() => setActive(i)} className={`overflow-hidden rounded-md border ${active === i ? "ring-2 ring-accent" : ""}`}>
                <SafeImage src={g} alt="" fallbackKeywords={`${product.title} ${i}`} className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>

          {/* product details further down */}
          <div className="mt-10 space-y-8">
            <section>
              <h2 className="mb-3 text-lg font-bold">About this item</h2>
              <ul className="space-y-2 text-sm">
                {BULLETS.map((b) => (
                  <li key={b} className="flex gap-2">
                    <FiCheck className="mt-0.5 shrink-0" style={{ color: "var(--shop)" }} /> {b}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">Product details</h2>
              <table className="w-full overflow-hidden rounded-xl border text-sm">
                <tbody>
                  {SPECS.map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-secondary/40" : ""}>
                      <td className="w-40 border-r px-3 py-2 font-semibold">{k}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v ?? product.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">Customer reviews</h2>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold">{product.rating.toFixed(1)}</div>
                <div>
                  <div className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <div className="text-xs text-muted-foreground">{product.reviews.toLocaleString()} ratings</div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Anika", text: "Beautifully made and the packaging was thoughtful." },
                  { name: "Rohan", text: "Worth every rupee. Already ordered a second." },
                  { name: "Priya", text: "Better than I expected — solid build, quick delivery." },
                  { name: "Kabir", text: "Looks premium and works flawlessly." },
                ].map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border bg-card p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <div className="grid h-7 w-7 place-items-center rounded-full gradient-hero text-primary-foreground text-xs">{r.name[0]}</div>
                      {r.name}
                    </div>
                    <div className="mt-1 flex text-accent text-sm">{Array.from({ length: 5 }).map((_, i) => <FiStar key={i} />)}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">Questions & answers</h2>
              <div className="divide-y rounded-xl border bg-card">
                {QNA.map((q) => (
                  <div key={q.q} className="p-4">
                    <div className="text-sm font-semibold">Q: {q.q}</div>
                    <div className="mt-1 text-sm text-muted-foreground">A: {q.a}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sticky buy box — Amazon style */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</div>
            <h1 className="mt-1 text-xl font-bold leading-snug">{product.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5">
                <FiStar className="text-accent" /> {product.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{inr(product.price)}</span>
                <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
              </div>
              <div className="text-xs font-bold" style={{ color: "var(--shop)" }}>
                You save {inr(product.mrp - product.price)} ({discountPct(product.price, product.mrp)}% off)
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</div>
            </div>

            <div className="mt-4 rounded-lg bg-secondary p-3 text-xs">
              <div className="font-semibold">FREE delivery by tomorrow</div>
              <div className="text-muted-foreground">Order in the next 4 hrs</div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Qty</span>
              <div className="flex items-center rounded-full border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1">−</button>
                <span className="px-3 text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1">+</button>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-shop-foreground"
                style={{ background: "var(--shop)" }}
              >
                <FiShoppingBag /> Add to Cart
              </button>
              <button
                onClick={handleBuy}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                <FiZap /> Buy Now
              </button>
            </div>

            <div className="mt-5 grid gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><FiTruck /> Free shipping over ₹499</div>
              <div className="flex items-center gap-2"><FiRefreshCw /> 7-day easy returns</div>
              <div className="flex items-center gap-2"><FiShield /> 1-year warranty</div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="mb-4 text-2xl font-bold">Customers also bought</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {products.filter((p) => p.id !== product.id).slice(0, 8).map((p) => (
            <Link
              key={p.id}
              to={`/shop/products/${p.id}`}
              className="w-44 shrink-0 overflow-hidden rounded-xl border bg-card hover:bg-secondary"
            >
              <img src={p.image} alt="" className="aspect-square w-full object-cover" />
              <div className="p-2">
                <div className="line-clamp-2 text-xs font-semibold">{p.title}</div>
                <div className="mt-1 text-sm font-bold">{inr(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default ProductDetail;
