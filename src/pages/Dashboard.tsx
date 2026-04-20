import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBox, FiHeart, FiMapPin, FiCreditCard } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const STATS = [
  { label: "Orders", value: "24", icon: <FiBox /> },
  { label: "Wishlist", value: "12", icon: <FiHeart /> },
  { label: "Addresses", value: "3", icon: <FiMapPin /> },
  { label: "Wallet", value: "₹1,420", icon: <FiCreditCard /> },
];

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  if (typeof window !== "undefined" && !isAuthenticated) /* redirect handled by useEffect below */ if(typeof window!=="undefined") window.location.href="/login";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Dashboard</div>
        <h1 className="mt-1 text-3xl font-bold">Hi, {user?.name ?? "Friend"} 👋</h1>
        <p className="text-sm text-muted-foreground">Here's a quick view of your bazaar.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border bg-card p-5 shadow-card"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-accent">{s.icon}</div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <DashLink to="/orders" title="My Orders" desc="Track current and past orders" />
        <DashLink to="/wishlist" title="Wishlist" desc="Items you've saved" />
        <DashLink to="/addresses" title="Addresses" desc="Manage delivery addresses" />
        <DashLink to="/profile" title="Profile" desc="Edit personal details" />
        <DashLink to="/cart" title="Cart" desc="Review and checkout" />
        <DashLink to="/deals" title="Today's Deals" desc="Live offers" />
      </div>
    </div>
  );
}

function DashLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="rounded-2xl border bg-card p-5 transition-colors hover:bg-secondary">
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </Link>
  );
}

export default Dashboard;
