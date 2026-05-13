import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <img src={`${product.imageUrl}?auto=format&fit=crop&w=900&q=80`} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold">
            <Link to={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <p className="text-xs text-slate-500">{formatNumber(product.stock)} in stock</p>
        <div className="flex items-center justify-between">
          <span className="font-bold">{formatCurrency(product.price)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} /> {isOutOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
