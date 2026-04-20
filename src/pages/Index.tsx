import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const FEATURES = [
  {
    to: "/shop",
    name: "ShopZone",
    tag: "Everything store",
    color: "var(--shop)",
    image: "https://loremflickr.com/1200/900/shopping,store,products?lock=zb-shop",
    copy: "From electronics to home essentials — fast, fair, delightful." },
  {
    to: "/food",
    name: "FoodRush",
    tag: "Order in",
    color: "var(--food)",
    image: "https://loremflickr.com/1200/900/food,restaurant,delicious?lock=zb-food",
    copy: "Cravings sorted in 30 minutes from kitchens you'll love." },
  {
    to: "/style",
    name: "StyleHub",
    tag: "Fashion",
    color: "var(--style)",
    image: "https://loremflickr.com/1200/900/fashion,model,clothing?lock=zb-style",
    copy: "Curated wardrobes, considered fits, fresh every season." },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-16 lg:grid-cols-2 lg:pb-24 lg:pt-24">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              The all-in-one bazaar
            </div>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Shop. Eat. <span className="italic text-accent">Dress.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Three worlds — one ZingBazaar. Browse essentials, order dinner, refresh your wardrobe.
              All from a single, beautifully unified place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/deals"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Today's Deals <FiArrowRight />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary"
              >
                Start with ShopZone
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><b className="text-foreground">10k+</b> products</div>
              <div><b className="text-foreground">2k+</b> kitchens</div>
              <div><b className="text-foreground">500+</b> brands</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] gradient-hero opacity-20 blur-3xl" />
            <div className="grid grid-cols-2 gap-4">
              <img className="col-span-2 h-64 w-full rounded-3xl object-cover shadow-card" src="https://loremflickr.com/1200/600/shopping,fashion,food?lock=zb-h1" alt="hero" />
              <img className="h-44 w-full rounded-3xl object-cover shadow-card" src="https://loremflickr.com/600/500/restaurant,delicious?lock=zb-h2" alt="" />
              <img className="h-44 w-full rounded-3xl object-cover shadow-card" src="https://loremflickr.com/600/500/fashion,clothing?lock=zb-h3" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Three apps */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                to={f.to}
                className="group relative block overflow-hidden rounded-3xl border bg-card shadow-card"
              >
                <img src={f.image} alt={f.name} className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: f.color }}>
                    {f.tag}
                  </div>
                  <h3 className="text-2xl font-bold">{f.name}</h3>
                  <p className="mt-1 max-w-xs text-sm text-white/85">{f.copy}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
