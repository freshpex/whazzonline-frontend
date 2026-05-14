import { Heart, Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/auth/hooks/useAuth';
import { useCart } from '../../app/cart/hooks/useCart';
import { useWishlist } from '../../app/wishlist/hooks/useWishlist';
import { useTheme } from '../../hooks/useTheme';
import { formatNumber } from '../../lib/format';

export function AppLayout() {
  const location = useLocation();
  const { totals } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, clearAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCartRoute = location.pathname === '/cart';

  const panelLabel = user?.role === 'admin' ? 'Admin panel' : user?.role === 'vendor' ? 'Vendor panel' : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <nav className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">Whazzonline</Link>

            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={toggleTheme}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {user ? (
                <>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Hi, {user.email ?? user.phone ?? 'User'}</span>
                  {panelLabel ? (
                    <Link
                      to="/panel"
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      {panelLabel}
                    </Link>
                  ) : null}
                  <button
                    onClick={clearAuth}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
                    Log in
                  </Link>
                  <Link to="/signup" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900">
                    Sign up
                  </Link>
                </>
              )}

              <Link
                to="/wishlist"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                <Heart size={16} />
                Wishlist
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">{formatNumber(wishlistItems.length)}</span>
              </Link>

              <Link
                to={isCartRoute ? '/' : '/cart'}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
                aria-label={`Cart with ${formatNumber(totals.itemsCount)} items`}
              >
                <ShoppingCart size={18} /> {isCartRoute ? 'Close' : 'Cart'}
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs dark:bg-slate-200/60">{formatNumber(totals.itemsCount)}</span>
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 md:hidden dark:border-slate-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {isMenuOpen ? (
            <div className="mt-4 grid gap-2 border-t pt-4 md:hidden dark:border-slate-800">
              <button
                onClick={toggleTheme}
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              </button>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700">
                Wishlist ({formatNumber(wishlistItems.length)})
              </Link>
              <Link to={isCartRoute ? '/' : '/cart'} onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700">
                {isCartRoute ? 'Close cart' : `Cart (${formatNumber(totals.itemsCount)})`}
              </Link>
              {panelLabel ? (
                <Link to="/panel" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700">
                  {panelLabel}
                </Link>
              ) : null}
              {user ? (
                <button
                  onClick={() => {
                    clearAuth();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium dark:border-slate-700"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700">
                    Log in
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
