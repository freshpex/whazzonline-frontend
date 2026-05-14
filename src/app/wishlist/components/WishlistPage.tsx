import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { LazyImage } from '../../../components/media/LazyImage';
import { formatCurrency } from '../../../lib/format';
import { useCart } from '../../cart/hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export function WishlistPage() {
  const { items, removeItem, clear } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return <EmptyState title="Your wishlist is empty" description="Save products you love and find them here anytime." />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wishlist</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your saved products in one place.</p>
        </div>
        <button
          onClick={clear}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-rose-600 dark:border-slate-700"
        >
          Clear wishlist
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="animate-fade-up overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Link to={`/products/${item.id}`} className="block">
              <LazyImage src={item.imageUrl} alt={item.name} className="h-44 w-full object-cover" />
            </Link>
            <div className="space-y-3 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.category}</p>
                <h3 className="mt-1 text-lg font-semibold">
                  <Link to={`/products/${item.id}`} className="hover:underline">{item.name}</Link>
                </h3>
              </div>
              <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              <p className="font-bold">{formatCurrency(item.price)}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addItem(item, 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  <ShoppingCart size={16} /> Add
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-rose-600 dark:border-slate-700"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Heart size={14} className="fill-rose-500 text-rose-500" /> Saved
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
