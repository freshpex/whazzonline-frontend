import { Minus, Plus, Trash2 } from 'lucide-react';
import { LazyImage } from '../../../components/media/LazyImage';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { CartItem } from '../types/cart';

type CartItemRowProps = {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onDecrease, onIncrease, onRemove }: CartItemRowProps) {
  const isAtStockLimit = item.quantity >= item.product.stock;

  return (
    <div className="animate-fade-up flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
      <LazyImage src={item.product.imageUrl} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover" />
      <div className="flex-1 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.product.category}</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.product.description}</p>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.product.price)}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrease}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
            aria-label={`Decrease quantity of ${item.product.name}`}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-10 text-center text-sm font-semibold">{formatNumber(item.quantity)}</span>
          <button
            onClick={onIncrease}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
            aria-label={`Increase quantity of ${item.product.name}`}
            disabled={isAtStockLimit}
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Subtotal: {formatCurrency(item.product.price * item.quantity)}</p>
        <button onClick={onRemove} className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600">
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
