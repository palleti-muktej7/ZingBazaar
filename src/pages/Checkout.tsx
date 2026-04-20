import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { inr } from "@/lib/format";
import { pushRecentOrder } from "@/lib/recent";
import { findRestaurant } from "@/lib/mock-data";
import { toast } from "sonner";

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState<"card" | "upi" | "cod">("card");

  if (!items.length) {
    if (typeof window !== "undefined") /* redirect handled by useEffect below */ if(typeof window!=="undefined") window.location.href="/cart";
    return null;
  }

  const total = subtotal + 49;

  const placeOrder = () => {
    // Detect a FoodRush order from cart items (id starts with "rN-")
    const foodItem = items.find((i) => /^r\d+-/.test(i.id));
    const restaurantId = foodItem?.id.split("-")[0];
    const resto = restaurantId ? findRestaurant(restaurantId) : undefined;
    const etaMinutes = resto ? 25 + Math.floor(Math.random() * 20) : 0;
    if (resto) {
      pushRecentOrder({
        id: `ZB-${Date.now().toString().slice(-6)}`,
        restaurantId: resto.id,
        restaurantName: resto.name,
        total,
        placedAt: Date.now(),
        eta: Date.now() + etaMinutes * 60_000,
        items: items.map((i) => i.title),
      });
      toast.success(`Order placed! Arriving in ~${etaMinutes} min 🛵`);
    } else {
      toast.success("Order placed!");
    }
    clear();
    navigate("/orders");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <Steps current={step} />

        {step === 1 && (
          <section className="mt-6 space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Delivery address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Full name" />
              <Input label="Phone" />
              <Input label="Address line" full />
              <Input label="City" />
              <Input label="Pincode" />
            </div>
            <button onClick={() => setStep(2)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Continue
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 space-y-4 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Payment</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["card", "upi", "cod"] as const).map((m) => (
                <button key={m} onClick={() => setPay(m)} className={`rounded-xl border p-4 text-sm ${pay === m ? "ring-2 ring-accent" : ""}`}>
                  {m === "card" ? "Credit / Debit Card" : m === "upi" ? "UPI" : "Cash on delivery"}
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Card number" full />
                <Input label="Expiry" />
                <Input label="CVV" />
              </div>
            )}
            {pay === "upi" && <Input label="UPI ID" />}
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="rounded-full border bg-card px-5 py-2.5 text-sm">Back</button>
              <button onClick={placeOrder} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground">Place order</button>
            </div>
          </section>
        )}
      </div>

      <aside className="h-fit space-y-3 rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-20">
        <h3 className="font-bold">Summary</h3>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-sm">
            <span className="line-clamp-1">{i.title} × {i.qty}</span>
            <span>{inr(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="border-t pt-2 text-sm flex justify-between"><span>Delivery</span><span>{inr(49)}</span></div>
        <div className="text-base font-bold flex justify-between"><span>Total</span><span>{inr(total)}</span></div>
      </aside>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const steps = ["Address", "Payment", "Confirm"];
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${i + 1 <= current ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
          <div className="text-sm">{s}</div>
          {i < steps.length - 1 && <div className="h-px w-10 bg-border" />}
        </div>
      ))}
    </div>
  );
}

function Input({ label, full }: { label: string; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input className="w-full rounded-xl border bg-background px-3 py-2 outline-none" />
    </label>
  );
}

export default Checkout;
