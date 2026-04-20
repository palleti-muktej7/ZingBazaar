import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

const ORDERS = [
  { id: "ZB-10293", date: "2 days ago", total: 2499, items: "Wireless Headphones + 1 more", status: 3 },
  { id: "ZB-10288", date: "Last week", total: 899, items: "FoodRush — Saffron Lane", status: 4 },
  { id: "ZB-10254", date: "2 weeks ago", total: 3490, items: "Linen Shirt + Trousers", status: 4 },
];
const STEPS = ["Placed", "Accepted", "Preparing", "Out for delivery", "Delivered"];

function Orders() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {ORDERS.map((o) => (
          <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">Order #{o.id} · {o.date}</div>
                <div className="font-semibold">{o.items}</div>
              </div>
              <div className="font-bold">₹{o.total.toLocaleString()}</div>
            </div>
            <div className="mt-5 flex items-center gap-2 overflow-x-auto">
              {STEPS.map((s, i) => {
                const done = i <= o.status;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${done ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                      {done ? <FiCheck /> : i + 1}
                    </div>
                    <span className={`text-xs ${done ? "" : "text-muted-foreground"}`}>{s}</span>
                    {i < STEPS.length - 1 && <div className={`h-px w-8 ${done ? "bg-accent" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Link to="/shop" className="mt-8 inline-flex rounded-full border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
        Continue shopping
      </Link>
    </div>
  );
}

export default Orders;
