import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { formatCurrency, formatNumber } from '../../../lib/format';
import { useCart } from '../hooks/useCart';
import { CartItemRow } from './CartItemRow';

export function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const [notice, setNotice] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (items.length === 0) return <EmptyState title="Your cart is empty" description="Add a product to see it here." />;

  async function handleCheckout() {
    setNotice(null);
    setIsCheckingOut(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setIsCheckingOut(false);
    setNotice('Checkout is not available yet. This is coming soon.');
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cart</h1>
          <p className="mt-1 text-sm text-slate-600">{formatNumber(totals.itemsCount)} items across {formatNumber(totals.uniqueItems)} products.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Close Cart</Link>
          <button
            onClick={() => {
              clearCart();
              setNotice(null);
            }}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-rose-600"
          >
            Clear cart
          </button>
        </div>
      </div>

      {notice ? <InlineAlert title={notice} tone="warning" /> : null}

      <div className="space-y-4">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onDecrease={() => {
              setNotice(null);
              updateQuantity(item.product.id, item.quantity - 1);
            }}
            onIncrease={() => {
              if (item.quantity >= item.product.stock) {
                setNotice(`Only ${formatNumber(item.product.stock)} units of ${item.product.name} are available right now.`);
                return;
              }
              setNotice(null);
              updateQuantity(item.product.id, item.quantity + 1);
            }}
            onRemove={() => {
              setNotice(null);
              removeItem(item.product.id);
            }}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-slate-600">Reach out to our concierge team for bulk pricing, shipping updates, or special requests.</p>
          <button className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Contact support</button>
        </div>
        <div className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-sm text-slate-300">Order total</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(totals.subtotal)}</p>
          <p className="mt-2 text-xs text-slate-300">Taxes and delivery calculated at checkout.</p>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            {isCheckingOut ? 'Proceeding...' : 'Proceed to checkout'}
          </button>
        </div>
      </div>
    </section>
  );
}
