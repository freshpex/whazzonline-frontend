import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../../components/media/LazyImage';
import { useWishlist } from '../../wishlist/hooks/useWishlist';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding?: boolean;
};

export function ProductCard({ product, onAddToCart, isAdding = false }: ProductCardProps) {
  const { toggleItem, hasItem } = useWishlist();
  const isOutOfStock = product.stock <= 0;
  const isWishlisted = hasItem(product.id);

  return (
    <article className="animate-fade-up overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/products/${product.id}`} className="block">
        <LazyImage src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold">
            <Link to={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(product.stock)} in stock</p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold">{formatCurrency(product.price)}</span>
          <button
            onClick={() => toggleItem(product)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isOutOfStock || isAdding}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} /> {isOutOfStock ? 'Sold out' : isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
