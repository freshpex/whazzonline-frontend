import { useEffect, useState } from 'react';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { getProducts } from '../services/product.service';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProducts(search).then(setProducts).catch(() => setMessage('Unable to load products. Please try again.'));
  }, [search]);

  function addToCart(product: Product) {
    const existing = JSON.parse(localStorage.getItem('whazzonline-cart') ?? '[]') as Product[];
    localStorage.setItem('whazzonline-cart', JSON.stringify([...existing, product]));
    setMessage(`${product.name} added to cart.`);
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_320px] md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop reliable products</h1>
          <p className="mt-2 text-slate-600">A clean mini-commerce foundation for buyers and vendors.</p>
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900" />
      </div>
      {message ? <p className="rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm">{message}</p> : null}
      {products.length === 0 ? <EmptyState title="No products found" description="Try a different search term or clear your filters." /> : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} onAddToCart={addToCart} />)}
      </div>
    </section>
  );
}
