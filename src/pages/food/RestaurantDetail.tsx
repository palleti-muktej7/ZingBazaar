import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiMinus, FiStar, FiClock, FiChevronRight, FiShoppingBag } from "react-icons/fi";
import { findRestaurant } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { pushRecent } from "@/lib/recent";
import { inr } from "@/lib/format";
import { toast } from "sonner";

type MenuItem = { id: string; name: string; price: number; veg: boolean; desc: string };

function RestaurantPage() {
  const { id } = useParams() as { id: string };
  const r = findRestaurant(id || "");
  const { items, add, setQty, count, subtotal } = useCart();
  const [activeSection, setActiveSection] = useState(r?.menu[0]?.section ?? "");
  useEffect(() => { if (r) pushRecent("food", r.id); }, [r?.id]);
  // Cart items belonging to THIS restaurant
  const restoCount = useMemo(
    () => items.filter((i) => r && i.id.startsWith(`${r.id}-`)).reduce((a, b) => a + b.qty, 0),
    [items, r?.id],
  );
  if (!r) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground">Not found</div>;

  const qtyOf = (id: string) => items.find((i) => i.id === id)?.qty ?? 0;

  const addItem = (it: MenuItem) => {
    add({
      id: it.id,
      source: "FoodRush",
      title: `${it.name} — ${r.name}`,
      price: it.price,
      image: r.image });
    toast.success(`Added ${it.name}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {/* Breadcrumb */}
      <div className="border-b bg-card/60">
        <div className="mx-auto flex max-w-5xl items-center gap-1 px-6 py-3 text-xs text-muted-foreground">
          <Link to="/food" className="hover:text-foreground">FoodRush</Link>
          <FiChevronRight />
          <span className="line-clamp-1">{r.name}</span>
        </div>
      </div>

      {/* Restaurant header — Swiggy style */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{r.name}</h1>
              <div className="text-sm text-muted-foreground">{r.cuisine.join(", ")}</div>
              <div className="mt-1 text-sm text-muted-foreground">2.1 km · 15 min away</div>
            </div>
            <div className="rounded-xl border p-3 text-sm">
              <div className="flex items-center gap-1 font-bold">
                <FiStar style={{ color: "var(--food)" }} fill="currentColor" /> {r.rating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">{Math.round(r.priceForTwo * 12)} ratings</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><FiClock /> {r.eta}</span>
            <span>· ₹{r.priceForTwo} for two</span>
          </div>

          {r.offer && (
            <div className="mt-4 rounded-lg border-2 border-dashed p-3 text-sm" style={{ borderColor: "var(--food)" }}>
              🎁 <b>{r.offer}</b> — applied at checkout
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-6 lg:grid-cols-[200px_1fr]">
        {/* Sticky section nav */}
        <nav className="hidden h-fit lg:sticky lg:top-32 lg:block">
          <div className="rounded-xl border bg-card p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Menu</div>
            <ul className="space-y-1">
              {r.menu.map((s: { section: string }) => (
                <li key={s.section}>
                  <a
                    href={`#sec-${s.section}`}
                    onClick={() => setActiveSection(s.section)}
                    className={`block rounded-lg px-3 py-1.5 text-sm ${activeSection === s.section ? "bg-secondary font-semibold" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    {s.section}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-10 pb-32">
          {r.menu.map((section: { section: string; items: MenuItem[] }) => (
            <section key={section.section} id={`sec-${section.section}`}>
              <h2 className="mb-3 text-xl font-bold">{section.section} <span className="text-sm font-normal text-muted-foreground">({section.items.length})</span></h2>
              <div className="divide-y rounded-2xl border bg-card">
                {section.items.map((it) => (
                  <div key={it.id} className="flex items-start gap-4 p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`grid h-4 w-4 place-items-center rounded-sm border ${it.veg ? "border-green-700" : "border-red-700"}`}>
                          <span className={`h-2 w-2 rounded-full ${it.veg ? "bg-green-700" : "bg-red-700"}`} />
                        </span>
                        <span className="text-xs font-semibold uppercase text-muted-foreground">{it.veg ? "Veg" : "Non-veg"}</span>
                      </div>
                      <div className="mt-1 font-bold">{it.name}</div>
                      <div className="text-sm">{inr(it.price)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{it.desc}</div>
                    </div>
                    <div className="relative w-28 shrink-0">
                      <img src={r.image} alt="" className="h-24 w-28 rounded-xl object-cover" />
                      {qtyOf(it.id) === 0 ? (
                        <button
                          onClick={() => addItem(it)}
                          className="absolute inset-x-2 bottom-[-12px] rounded-lg border bg-card py-1 text-xs font-bold uppercase shadow-card hover:bg-secondary"
                          style={{ color: "var(--food)" }}
                        >
                          Add
                        </button>
                      ) : (
                        <div className="absolute inset-x-2 bottom-[-12px] flex items-center justify-between rounded-lg border bg-card text-xs font-bold shadow-card" style={{ color: "var(--food)" }}>
                          <button onClick={() => setQty(it.id, qtyOf(it.id) - 1)} className="px-2 py-1"><FiMinus /></button>
                          <span>{qtyOf(it.id)}</span>
                          <button onClick={() => setQty(it.id, qtyOf(it.id) + 1)} className="px-2 py-1"><FiPlus /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Sticky cart total bar */}
      <AnimatePresence>
        {restoCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl px-5 py-3 text-white shadow-glow" style={{ background: "var(--food)" }}>
              <div className="text-sm font-semibold">
                {count} items · {inr(subtotal)}
              </div>
              <Link to="/cart" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/25">
                <FiShoppingBag /> View cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RestaurantPage;
