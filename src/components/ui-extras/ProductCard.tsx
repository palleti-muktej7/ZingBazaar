import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { TiltCard } from "@/components/ui-extras/TiltCard";
import { SafeImage } from "@/components/ui-extras/SafeImage";
import { discountPct, inr } from "@/lib/format";

type Props = {
  to: string;
  params?: Record<string, string>;
  image: string;
  title: string;
  subtitle?: string;
  price: number;
  mrp?: number;
  rating?: number;
  accent?: "shop" | "food" | "style";
  aspect?: string;
};

export function ProductCard({
  to, params, image, title, subtitle, price, mrp, rating, accent = "shop", aspect = "aspect-square" }: Props) {
  const off = mrp ? discountPct(price, mrp) : 0;
  const accentVar = accent === "shop" ? "var(--shop)" : accent === "food" ? "var(--food)" : "var(--style)";

  return (
    <TiltCard className="group block">
      <Link
        to={params?.id ? to.replace(":id", params.id) : to}
        className="block overflow-hidden rounded-2xl border bg-card shadow-card"
      >
        <div className={`relative overflow-hidden ${aspect}`}>
          <SafeImage
            src={image}
            alt={title}
            loading="lazy"
            fallbackKeywords={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {off > 0 && (
            <span
              className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
              style={{ background: accentVar }}
            >
              {off}% OFF
            </span>
          )}
        </div>
        <div className="space-y-1 p-4">
          {subtitle && <div className="text-xs uppercase tracking-wider text-muted-foreground">{subtitle}</div>}
          <div className="line-clamp-2 text-sm font-semibold leading-snug">{title}</div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold">{inr(price)}</span>
              {mrp && mrp > price && (
                <span className="text-xs text-muted-foreground line-through">{inr(mrp)}</span>
              )}
            </div>
            {rating !== undefined && (
              <span className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs">
                <FiStar className="text-accent" /> {rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
