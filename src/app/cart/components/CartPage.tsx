import { useMemo, useState } from 'react';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import type { Product } from '../../products/types/product';

export function CartPage() {
  const [items, setItems] = useState<Product[]>(() => JSON.parse(localStorage.getItem('whazzonline-cart') ?? '[]'));
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  function removeItem(id: string) {
    const updated = items.filter((item, index) => `${item.id}-${index}` !== id);
    setItems(updated);
    localStorage.setItem('whazzonline-cart', JSON.stringify(updated));
  }

  if (items.length === 0) return <EmptyState title="Your cart is empty" description="Add a product to see it here." />;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Cart</h1>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-slate-600">₦{item.price.toLocaleString()}</p>
            </div>
            <button onClick={() => removeItem(`${item.id}-${index}`)} className="rounded-xl border px-3 py-2 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-slate-900 p-5 text-white">
        <p className="text-sm text-slate-300">Total</p>
        <p className="text-2xl font-bold">₦{total.toLocaleString()}</p>
      </div>
    </section>
  );
}
