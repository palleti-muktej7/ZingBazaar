import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground font-bold">Z</div>
            <span className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
              Zing<span className="text-accent">Bazaar</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            One destination for everything you love — shop, eat, dress.
          </p>
        </div>
        <FooterCol title="Explore" links={[
          { to: "/shop", label: "ShopZone" },
          { to: "/food", label: "FoodRush" },
          { to: "/style", label: "StyleHub" },
          { to: "/deals", label: "Today's Deals" },
        ]} />
        <FooterCol title="Account" links={[
          { to: "/login", label: "Sign in" },
          { to: "/signup", label: "Create account" },
          { to: "/orders", label: "My orders" },
          { to: "/wishlist", label: "Wishlist" },
        ]} />
        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow</h4>
          <div className="flex gap-2">
            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-10 w-10 place-items-center rounded-full border bg-background hover:bg-secondary">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ZingBazaar. Crafted with care.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
