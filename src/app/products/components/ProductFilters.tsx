import type { ChangeEvent } from 'react';
import type { ProductFilters, ProductSort } from '../types/product';

const sortOptions: { label: string; value: ProductSort }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];

type ProductFiltersProps = {
  filters: ProductFilters;
  categories: string[];
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
};

export function ProductFilters({ filters, categories, onChange, onReset }: ProductFiltersProps) {
  const updateText = (event: ChangeEvent<HTMLInputElement>) => onChange({ ...filters, search: event.target.value });
  const updateCategory = (event: ChangeEvent<HTMLSelectElement>) => onChange({ ...filters, category: event.target.value });
  const updateSort = (event: ChangeEvent<HTMLSelectElement>) => onChange({ ...filters, sort: event.target.value as ProductSort });

  return (
    <div className="grid gap-4 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-end">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="product-search">Search</label>
        <input
          id="product-search"
          value={filters.search}
          onChange={updateText}
          placeholder="Search products, brands, categories"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="product-category">Category</label>
        <select
          id="product-category"
          value={filters.category}
          onChange={updateCategory}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="product-sort">Sort</label>
        <select
          id="product-sort"
          value={filters.sort}
          onChange={updateSort}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          In stock only
        </label>
        <button onClick={onReset} className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Clear filters
        </button>
      </div>
    </div>
  );
}
