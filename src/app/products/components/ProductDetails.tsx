import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { formatCurrency, formatNumber } from '../../../lib/format';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import { useProduct } from '../hooks/useProduct';

export function ProductDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [feedback, setFeedback] = useState<{ title: string; tone: 'success' | 'warning' | 'error' } | null>(null);

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (!feedback) return;
    const handle = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(handle);
  }, [feedback]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <ArrowLeft size={16} /> Back to products
        </Link>
        <InlineAlert title="Unable to load this product." description="Please try again later." tone="error" />
      </section>
    );
  }

  const currentProduct = product;
  const isOutOfStock = currentProduct.stock <= 0;
  const canIncrease = quantity < currentProduct.stock;

  async function handleAdd() {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    await new Promise((resolve) => window.setTimeout(resolve, 250));

    try {
      const result = addItem(currentProduct, quantity);
      if (result.addedQuantity === 0) {
        setFeedback({ title: `${currentProduct.name} is currently out of stock.`, tone: 'error' });
        return;
      }
      if (result.exceededStock) {
        setFeedback({ title: `Only ${formatNumber(result.addedQuantity)} item${result.addedQuantity > 1 ? 's' : ''} were added.`, tone: 'warning' });
        return;
      }
      setFeedback({ title: `${formatNumber(quantity)} ${currentProduct.name} added to cart.`, tone: 'success' });
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <section className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <img src={currentProduct.imageUrl} alt={currentProduct.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{currentProduct.category}</p>
          <h1 className="text-3xl font-bold text-slate-900">{currentProduct.name}</h1>
          <p className="text-sm text-slate-600">{currentProduct.description}</p>
          <p className="text-sm text-slate-500">{formatNumber(currentProduct.stock)} in stock</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(currentProduct.price)}</p>

          {feedback ? <InlineAlert title={feedback.title} tone={feedback.tone} /> : null}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-10 text-center text-sm font-semibold">{formatNumber(quantity)}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(Math.max(1, currentProduct.stock), prev + 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
                disabled={!canIncrease}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isOutOfStock || isAdding}
            >
              <ShoppingBag size={16} /> {isOutOfStock ? 'Sold out' : isAdding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Delivery notes</p>
            <p className="mt-1">Standard delivery within 2-4 business days. Track every shipment inside your account dashboard.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
