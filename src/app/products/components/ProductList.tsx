import { useEffect, useMemo, useState } from 'react';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { Toast } from '../../../components/feedback/Toast';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { formatNumber } from '../../../lib/format';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import type { Product, ProductFilters } from '../types/product';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductFilters as ProductFiltersPanel } from './ProductFilters';
import { ProductListSkeleton } from './ProductListSkeleton';

const ALL_CATEGORIES = 'All categories';

const defaultFilters: ProductFilters = {
  search: '',
  category: ALL_CATEGORIES,
  inStockOnly: false,
  sort: 'featured'
};

export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [toast, setToast] = useState<{ title: string; tone: 'success' | 'warning' | 'error' } | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(filters.search);
  const { addItem } = useCart();
  const { user } = useAuth();

  const trimmedSearch = debouncedSearch.trim();

  const { data, isLoading, isError } = useProducts({
    search: trimmedSearch.length ? trimmedSearch : undefined,
    category: filters.category === ALL_CATEGORIES ? undefined : filters.category
  });

  const categories = useMemo(() => {
    const unique = new Set((data ?? []).map((product) => product.category));
    return [ALL_CATEGORIES, ...Array.from(unique)];
  }, [data]);

  const products = useMemo(() => {
    let filtered = [...(data ?? [])];
    if (filters.inStockOnly) filtered = filtered.filter((product) => product.stock > 0);
    if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [data, filters]);

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
          <p className="mt-2 text-slate-600">A curated Whazzonline selection for buyers and vendors.</p>
        </div>
        <div className="text-sm text-slate-600">{formatNumber(products.length)} products</div>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isAdding={addingProductId === product.id} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
