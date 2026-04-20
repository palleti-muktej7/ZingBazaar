import { Link } from "react-router-dom";
import { products, fashion } from "@/lib/mock-data";
import { inr } from "@/lib/format";

function Wishlist() {
  const items = [...products.slice(0, 3), ...fashion.slice(0, 3).map((f) => ({ ...f, rating: 4.5, reviews: 0, category: f.category, description: "" }))];
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Your Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <Link key={p.id} to={`/shop/products/${p.id}`} className="overflow-hidden rounded-2xl border bg-card shadow-card hover:bg-secondary">
            <img src={p.image} alt="" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <div className="line-clamp-1 text-sm font-semibold">{p.title}</div>
              <div className="text-sm">{inr(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
