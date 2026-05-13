import { ShoppingCart } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../../app/cart/hooks/useCart';
import { formatNumber } from '../../lib/format';

export function AppLayout() {
  const { totals } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">Whazzonline</Link>
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white" aria-label={`Cart with ${formatNumber(totals.itemsCount)} items`}>
            <ShoppingCart size={18} /> Cart
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{formatNumber(totals.itemsCount)}</span>
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
