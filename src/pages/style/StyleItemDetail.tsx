import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX, FiHeart, FiShoppingBag, FiTruck, FiRefreshCw, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { findFashion, fashion } from "@/lib/mock-data";
import { discountPct, inr } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { pushRecent } from "@/lib/recent";
import { toast } from "sonner";

const ACCORDIONS = [
  { title: "Product details", body: "A considered piece in a clean cut. Made from premium fabric, finished by hand. Falls just below the hip with a relaxed silhouette and a subtle taper." },
  { title: "Size & fit", body: "Model is 5'9\" / 175cm and wears size M. True to size — order your usual." },
  { title: "Material & care", body: "55% cotton, 45% linen. Machine wash cold, hang to dry. Iron on low." },
  { title: "Shipping & returns", body: "Free shipping over ₹499. 15-day easy returns on all unworn items with tags." },
];

function ItemPage() {
  const { id } = useParams() as { id: string };
  const item = findFashion(id || "");
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string>(item?.colors[0] ?? "Ink");
  const [showSize, setShowSize] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();
  const navigate = useNavigate();
  useEffect(() => { if (item) pushRecent("style", item.id); }, [item?.id]);
  if (!item) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground">Not found</div>;

  const handleAdd = () => {
    if (!size) { toast.error("Please select a size"); return; }
    add({
      id: `${item.id}-${size}-${color}`,
      source: "StyleHub",
      title: `${item.title} (${size}, ${color})`,
      price: item.price,
      image: item.image,
      meta: { size, color } });
    toast.success("Added to bag");
  };

  const similar = fashion.filter((f) => f.id !== item.id && f.category === item.category).slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-3 text-xs text-muted-foreground">
          <Link to="/style" className="hover:text-foreground">StyleHub</Link>
          <FiChevronRight />
          <span>{item.category}</span>
          <FiChevronRight />
          <span className="line-clamp-1">{item.title}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_420px]">
        {/* Image strip — large hero + thumbnails + tile grid */}
        <div>
          <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
            <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-y-auto">
              {item.gallery.map((g: string, i: number) => (
                <button
                  key={g}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 overflow-hidden border-2 transition ${activeImg === i ? "" : "border-transparent opacity-70 hover:opacity-100"}`}
                  style={activeImg === i ? { borderColor: "var(--style)" } : undefined}
                >
                  <img src={g} alt="" className="h-20 w-16 object-cover sm:h-24 sm:w-full" />
                </button>
              ))}
            </div>
            <div className="order-1 sm:order-2">
              <img
                key={activeImg}
                src={item.gallery[activeImg]}
                alt={item.title}
                className="aspect-[3/4] w-full animate-in fade-in object-cover"
              />
            </div>
          </div>
          {/* Below-the-fold gallery tiles */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {item.gallery.slice(0, 6).map((g: string) => (
              <img key={g + "tile"} src={g} alt="" className="aspect-[3/4] w-full object-cover" />
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="text-xs font-bold uppercase tracking-widest">{item.brand}</div>
          <h1 className="mt-1 text-2xl font-semibold">{item.title}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{inr(item.price)}</span>
            <span className="text-sm text-muted-foreground line-through">MRP {inr(item.mrp)}</span>
            <span className="text-sm font-bold" style={{ color: "var(--style)" }}>
              ({discountPct(item.price, item.mrp)}% OFF)
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Price inclusive of all taxes</div>

          {/* Color */}
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-wider">Color: <span className="font-semibold normal-case">{color}</span></div>
            <div className="mt-2 flex gap-2">
              {item.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase ${color === c ? "border-foreground" : "border-border text-muted-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider">Select size</div>
            <button onClick={() => setShowSize(true)} className="text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: "var(--style)" }}>
              Size guide
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`grid h-12 w-12 place-items-center rounded-full border text-sm font-bold ${size === s ? "border-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-sm border-2 py-3 text-sm font-bold uppercase tracking-wider hover:bg-secondary"
              style={{ borderColor: "var(--style)", color: "var(--style)" }}
            >
              <FiShoppingBag /> Add to Bag
            </button>
            <button
              onClick={() => { handleAdd(); navigate("/checkout"); }}
              className="inline-flex items-center justify-center gap-2 rounded-sm py-3 text-sm font-bold uppercase tracking-wider text-white"
              style={{ background: "var(--style)" }}
            >
              Buy Now
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-sm border py-3 text-sm font-bold uppercase tracking-wider hover:bg-secondary sm:col-span-2">
              <FiHeart /> Save to Wishlist
            </button>
          </div>

          {/* Delivery */}
          <div className="mt-6 grid gap-2 rounded-sm border p-4 text-sm">
            <div className="flex items-center gap-2"><FiTruck style={{ color: "var(--style)" }} /> Free delivery on orders above ₹499</div>
            <div className="flex items-center gap-2"><FiRefreshCw style={{ color: "var(--style)" }} /> 15-day easy returns</div>
          </div>

          {/* Accordions */}
          <div className="mt-6 divide-y rounded-sm border">
            {ACCORDIONS.map((a, i) => (
              <div key={a.title}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-bold uppercase tracking-wider"
                >
                  {a.title}
                  <motion.span animate={{ rotate: open === i ? 180 : 0 }}><FiChevronDown /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-muted-foreground">{a.body}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete the look */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-wider">You may also like</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {similar.map((f) => (
            <Link key={f.id} to={`/style/items/${f.id}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={f.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
      </section>

      {/* Size guide drawer (kept) */}
      <AnimatePresence>
        {showSize && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowSize(false)} />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Size guide</h2>
                <button onClick={() => setShowSize(false)} className="grid h-9 w-9 place-items-center rounded-full border"><FiX /></button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Measurements in inches.</p>
              <table className="mt-4 w-full text-sm">
                <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead>
                <tbody>
                  {[["XS",32,26,34],["S",34,28,36],["M",36,30,38],["L",38,32,40],["XL",40,34,42]].map((r, i) => (
                    <tr key={i} className="border-b"><td className="py-2 font-semibold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
                  ))}
                </tbody>
              </table>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ItemPage;
