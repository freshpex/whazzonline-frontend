import { ShoppingBag } from 'lucide-react';
import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img src={`${product.imageUrl}?auto=format&fit=crop&w=900&q=80`} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold">₦{product.price.toLocaleString()}</span>
          <button onClick={() => onAddToCart(product)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">
            <ShoppingBag size={16} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
