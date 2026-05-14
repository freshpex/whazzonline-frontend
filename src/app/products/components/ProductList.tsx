import { useEffect, useMemo, useState } from 'react';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { Toast } from '../../../components/feedback/Toast';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { formatNumber } from '../../../lib/format';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import type { Product, ProductFilters } from '../types/product';
import { useProductCategories } from '../hooks/useProductCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters as ProductFiltersPanel } from './ProductFilters';
import { ProductListSkeleton } from './ProductListSkeleton';

const ALL_CATEGORIES = 'All categories';
const PAGE_SIZE = 9;

const defaultFilters: ProductFilters = {
  search: '',
  category: ALL_CATEGORIES,
  inStockOnly: false,
  sort: 'featured'
};

export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ title: string; tone: 'success' | 'warning' | 'error' } | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(filters.search);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { data: categoryData } = useProductCategories();

  const trimmedSearch = debouncedSearch.trim();

  const { data, isLoading, isError } = useProducts({
    search: trimmedSearch.length ? trimmedSearch : undefined,
    category: filters.category === ALL_CATEGORIES ? undefined : filters.category,
    page,
    limit: PAGE_SIZE
  });

  const categories = useMemo(() => [ALL_CATEGORIES, ...(categoryData ?? [])], [categoryData]);

  const products = useMemo(() => {
    let filtered = [...(data?.items ?? [])];
    if (filters.inStockOnly) filtered = filtered.filter((product) => product.stock > 0);
    if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [data?.items, filters]);

  useEffect(() => {
    setPage(1);
  }, [trimmedSearch, filters.category]);

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(handle);
  }, [toast]);

  async function handleAddToCart(product: Product) {
    if (!user) {
      setToast({ title: 'Please log in to add items to your cart.', tone: 'warning' });
      return;
    }

    setAddingProductId(product.id);
    await new Promise((resolve) => window.setTimeout(resolve, 250));

    try {
      const result = addItem(product, 1);
      if (result.addedQuantity === 0) {
        setToast({ title: `${product.name} is currently out of stock.`, tone: 'error' });
        return;
      }

      if (result.exceededStock) {
        setToast({
          title: `We added ${formatNumber(result.addedQuantity)} item${result.addedQuantity > 1 ? 's' : ''} of ${product.name}.`,
          tone: 'warning'
        });
        return;
      }

      setToast({ title: `${product.name} added to cart.`, tone: 'success' });
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop reliable products</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">A curated Whazzonline selection for buyers and vendors.</p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">{formatNumber(data?.total ?? products.length)} products</div>
      </div>

      <ProductFiltersPanel
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={() => setFilters({ ...defaultFilters })}
      />

      {toast ? <Toast title={toast.title} tone={toast.tone} onClose={() => setToast(null)} /> : null}
      {isError ? <InlineAlert title="Unable to load products." description="Please refresh or try again shortly." tone="error" /> : null}

      {isLoading ? <ProductListSkeleton /> : null}
      {!isLoading && products.length === 0 ? (
        <EmptyState title="No products found" description="Try a different search term or clear your filters." />
      ) : null}

      {!isLoading ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isAdding={addingProductId === product.id} />
            ))}
          </div>

          <div className="animate-fade-up flex items-center justify-between rounded-2xl border bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Page {formatNumber(data?.page ?? 1)} of {formatNumber(data?.totalPages ?? 1)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={(data?.page ?? 1) <= 1}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
              >
                Previous
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {formatNumber(page)}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(data?.totalPages ?? prev, prev + 1))}
                disabled={(data?.page ?? 1) >= (data?.totalPages ?? 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
