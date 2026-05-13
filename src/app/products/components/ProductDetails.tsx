import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { Toast } from '../../../components/feedback/Toast';
import { LazyImage } from '../../../components/media/LazyImage';
import { formatCurrency, formatNumber } from '../../../lib/format';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCart } from '../../cart/hooks/useCart';
import { useWishlist } from '../../wishlist/hooks/useWishlist';
import { useCreateProductReview, useProductReviews } from '../hooks/useProductReviews';
import { useProduct } from '../hooks/useProduct';

const MAX_QUANTITY = 10;

export function ProductDetails() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: reviews = [], isLoading: isLoadingReviews } = useProductReviews(productId);
  const createReview = useCreateProductReview(productId);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState<{ title: string; tone: 'success' | 'warning' | 'error' } | null>(null);

  const images = useMemo(() => {
    if (!product) return [];
    return product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
  }, [product]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </section>
    );
  }

  if (isError || !product) {
    return <EmptyState title="Product unavailable" description="This item may have moved or no longer exists." />;
  }

  const currentProduct = product;
  const isWishlisted = hasItem(currentProduct.id);
  const isOutOfStock = currentProduct.stock <= 0;

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setToast({ title: 'Log in to share a review.', tone: 'warning' });
      return;
    }

    try {
      await createReview.mutateAsync({ rating, comment: comment.trim() || undefined });
      setComment('');
      setRating(5);
      setToast({ title: 'Review saved. Thanks for your feedback.', tone: 'success' });
    } catch (error) {
      setToast({ title: error instanceof Error ? error.message : 'Unable to save review.', tone: 'error' });
    }
  }

  function handleAddToCart() {
    const result = addItem(currentProduct, quantity);
    if (result.addedQuantity === 0) {
      setToast({ title: `${currentProduct.name} is currently out of stock.`, tone: 'error' });
      return;
    }

    if (result.exceededStock) {
      setToast({
        title: `Only ${formatNumber(result.addedQuantity)} item${result.addedQuantity > 1 ? 's were' : ' was'} added due to stock limits.`,
        tone: 'warning'
      });
      return;
    }

    setToast({ title: `${currentProduct.name} added to cart.`, tone: 'success' });
  }

  return (
    <section className="space-y-8">
      {toast ? <Toast title={toast.title} tone={toast.tone} onClose={() => setToast(null)} /> : null}

      <Link to="/" className="inline-flex text-sm font-semibold text-slate-700 dark:text-slate-300">
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border dark:border-slate-800">
            <LazyImage src={images[selectedImage] ?? currentProduct.imageUrl} alt={currentProduct.name} className="h-[420px] w-full object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border ${selectedImage === index ? 'border-slate-900 dark:border-slate-100' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <LazyImage src={image} alt={`${currentProduct.name} preview ${index + 1}`} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{currentProduct.category}</p>
          <h1 className="text-3xl font-bold tracking-tight">{currentProduct.name}</h1>
          <p className="text-slate-600 dark:text-slate-300">{currentProduct.description}</p>
          <p className="text-3xl font-extrabold">{formatCurrency(currentProduct.price)}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatNumber(currentProduct.stock)} units available</p>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{formatNumber(quantity)}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(Math.min(currentProduct.stock, MAX_QUANTITY), prev + 1))}
                className="px-3 py-2"
                aria-label="Increase quantity"
                disabled={quantity >= Math.min(currentProduct.stock, MAX_QUANTITY)}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleItem(currentProduct)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700"
            >
              <Heart size={16} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>

          {!user ? <InlineAlert title="Log in to add this item to cart or post a review." tone="info" /> : null}

          <button
            onClick={handleAddToCart}
            disabled={!user || isOutOfStock}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-slate-100 dark:text-slate-900 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            <ShoppingBag size={16} /> {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold">Product reviews</h2>

        <form onSubmit={handleReviewSubmit} className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="text-slate-400 transition hover:scale-110"
                aria-label={`Rate ${value} stars`}
              >
                <Star size={20} className={value <= rating ? 'fill-amber-400 text-amber-400' : ''} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with this product"
            className="min-h-[96px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={createReview.isPending}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          >
            {createReview.isPending ? 'Saving review...' : 'Submit review'}
          </button>
        </form>

        {isLoadingReviews ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No reviews yet. Be the first to share feedback.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{review.reviewer}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="mt-1 text-sm text-amber-500">{'\u2605'.repeat(review.rating)}{'\u2606'.repeat(5 - review.rating)}</p>
                {review.comment ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
