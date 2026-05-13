import { ShoppingCart } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/auth/hooks/useAuth';
import { useCart } from '../../app/cart/hooks/useCart';
import { formatNumber } from '../../lib/format';

export function AppLayout() {
  const location = useLocation();
  const { totals } = useCart();
  const { user, clearAuth } = useAuth();
  const isCartRoute = location.pathname === '/cart';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">Whazzonline</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm font-medium text-slate-600 sm:inline">Hi, {user.email ?? user.phone ?? 'User'}</span>
                {user.role === 'admin' || user.role === 'vendor' ? (
                  <Link
                    to="/admin/products/new"
                    className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 sm:inline"
                  >
                    Add product
                  </Link>
                ) : null}
                <button
                  onClick={clearAuth}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              to={isCartRoute ? '/' : '/cart'}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              aria-label={`Cart with ${formatNumber(totals.itemsCount)} items`}
            >
              <ShoppingCart size={18} /> {isCartRoute ? 'Close' : 'Cart'}
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{formatNumber(totals.itemsCount)}</span>
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
