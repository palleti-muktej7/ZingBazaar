import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiShoppingBag, FiUser, FiMoon, FiSun, FiGrid, FiLogOut, FiBox, FiHeart, FiMapPin } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/zingbazaar-logo.png";

const APPS = [
  { to: "/shop", label: "ShopZone", color: "var(--shop)", desc: "Everything store" },
  { to: "/food", label: "FoodRush", color: "var(--food)", desc: "Order in" },
  { to: "/style", label: "StyleHub", color: "var(--style)", desc: "Fashion" },
  { to: "/deals", label: "Today's Deals", color: "var(--accent)", desc: "Live offers" },
] as const;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate("/shop" + (q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""));
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <motion.img
            src={logo}
            alt="ZingBazaar logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl shadow-sm"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
          />
          <span className="hidden text-xl font-bold sm:block" style={{ fontFamily: "Fraunces, serif" }}>
            Zing<span className="text-accent">Bazaar</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {APPS.slice(0, 3).map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {a.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Animated search */}
          <motion.form
            onSubmit={submitSearch}
            initial={false}
            animate={{ width: searchOpen ? 320 : 40 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative flex h-10 items-center overflow-hidden rounded-full border bg-card"
          >
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              className="grid h-10 w-10 shrink-0 place-items-center text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, food, fashion…"
              className="h-full w-full bg-transparent pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </motion.form>

          {/* Dot-grid app switcher */}
          <div className="relative">
            <button
              onClick={() => { setGridOpen((s) => !s); setAcctOpen(false); }}
              className="grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-secondary"
              aria-label="Apps"
            >
              <FiGrid />
            </button>
            <AnimatePresence>
              {gridOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl border bg-popover p-3 shadow-card"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {APPS.map((a) => (
                      <Link
                        key={a.to}
                        to={a.to}
                        onClick={() => setGridOpen(false)}
                        className="group rounded-xl border bg-card p-3 transition-colors hover:bg-secondary"
                      >
                        <div
                          className="mb-2 h-2 w-8 rounded-full"
                          style={{ background: a.color }}
                        />
                        <div className="text-sm font-semibold">{a.label}</div>
                        <div className="text-xs text-muted-foreground">{a.desc}</div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggle}
            className="grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-secondary"
            aria-label="Cart"
          >
            <FiShoppingBag />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => { setAcctOpen((s) => !s); setGridOpen(false); }}
              className="grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-secondary"
              aria-label="Account"
            >
              <FiUser />
            </button>
            <AnimatePresence>
              {acctOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl border bg-popover p-2 shadow-card"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold">{user?.name}</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                      <DropLink to="/dashboard" icon={<FiBox />} label="Dashboard" onClick={() => setAcctOpen(false)} />
                      <DropLink to="/profile" icon={<FiUser />} label="Profile" onClick={() => setAcctOpen(false)} />
                      <DropLink to="/orders" icon={<FiBox />} label="My Orders" onClick={() => setAcctOpen(false)} />
                      <DropLink to="/wishlist" icon={<FiHeart />} label="Wishlist" onClick={() => setAcctOpen(false)} />
                      <DropLink to="/addresses" icon={<FiMapPin />} label="Addresses" onClick={() => setAcctOpen(false)} />
                      <button
                        onClick={() => { logout(); setAcctOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-secondary"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <DropLink to="/login" icon={<FiUser />} label="Sign in" onClick={() => setAcctOpen(false)} />
                      <DropLink to="/signup" icon={<FiUser />} label="Create account" onClick={() => setAcctOpen(false)} />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropLink({
  to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
    >
      <span className="text-muted-foreground">{icon}</span> {label}
    </Link>
  );
}
