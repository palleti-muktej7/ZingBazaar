import { Link } from "react-router-dom";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { inr } from "@/lib/format";
import { toast } from "sonner";

function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const apply = () => {
    if (coupon.trim().toUpperCase() === "ZING10") {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success("Coupon applied — 10% off");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  const total = Math.max(0, subtotal - discount) + (subtotal > 0 ? 49 : 0);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Cart ({items.length})</h1>
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">Clear all</button>
        </div>
        {items.map((it) => (
          <div key={it.id} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card">
            <img src={it.image} alt={it.title} className="h-24 w-24 rounded-xl object-cover" />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">{it.source}</div>
                  <div className="font-semibold">{it.title}</div>
                </div>
                <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive"><FiTrash2 /></button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center rounded-full border">
                  <button onClick={() => setQty(it.id, it.qty - 1)} className="px-3 py-1">−</button>
                  <span className="px-3 text-sm">{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)} className="px-3 py-1">+</button>
                </div>
                <div className="font-semibold">{inr(it.price * it.qty)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-20">
        <h3 className="font-bold">Order Summary</h3>
        <Row label="Subtotal" value={inr(subtotal)} />
        <Row label="Delivery" value={inr(49)} />
        {discount > 0 && <Row label="Coupon" value={`− ${inr(discount)}`} />}
        <div className="border-t pt-3">
          <Row label="Total" value={inr(total)} bold />
        </div>
        <div className="flex gap-2">
          <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (try ZING10)" className="flex-1 rounded-full border bg-background px-3 py-2 text-sm outline-none" />
          <button onClick={apply} className="rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">Apply</button>
        </div>
        <Link to="/checkout" className="block w-full rounded-full bg-accent py-3 text-center text-sm font-bold text-accent-foreground">
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-bold text-base" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span><span>{value}</span>
    </div>
  );
}

export default CartPage;
