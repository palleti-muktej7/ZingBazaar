import type { ReactNode } from "react";

type App = "shop" | "food" | "style";

const themes = {
  shop: {
    bar: "bg-[oklch(0.22_0.05_260)] text-white", // Amazon-flavored: deep navy
    accent: "var(--shop)",
    label: "ShopZone",
    tagline: "The everything store" },
  food: {
    bar: "bg-white text-foreground border-b",
    accent: "var(--food)",
    label: "FoodRush",
    tagline: "Order in, eat well" },
  style: {
    bar: "bg-black text-white",
    accent: "var(--style)",
    label: "StyleHub",
    tagline: "Wear what you love" } } as const;

export function AppBar({ app, links }: { app: App; links: { label: string; href: string }[] }) {
  const t = themes[app];
  return (
    <div className={`${t.bar} sticky top-16 z-30 backdrop-blur`}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-6 py-2 text-sm">
        <span className="flex shrink-0 items-center gap-2 font-semibold">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: t.accent }}
          />
          {t.label}
          <span className="hidden text-xs opacity-60 sm:inline">— {t.tagline}</span>
        </span>
        <div className="flex shrink-0 gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppSection({
  app,
  children }: {
  app: App;
  children: ReactNode;
}) {
  return <div data-app={app}>{children}</div>;
}
