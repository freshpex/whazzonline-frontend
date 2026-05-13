import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { EmptyState } from '../../../components/empty-state/EmptyState';
import { formatCurrency, formatNumber } from '../../../lib/format';
import { checkout, type PaymentMethod } from '../../orders/services/order.service';
import { useCart } from '../hooks/useCart';
import { CartItemRow } from './CartItemRow';

const paymentOptions: Array<{ value: PaymentMethod; label: string; description: string }> = [
  { value: 'card', label: 'Card', description: 'Visa, Mastercard, Verve' },
  { value: 'bank_transfer', label: 'Bank transfer', description: 'Instant transfer verification' },
  { value: 'ussd', label: 'USSD', description: 'Pay from your mobile banking app' },
  { value: 'wallet', label: 'Wallet', description: 'Use your saved Whazz Wallet balance' },
  { value: 'cash_on_delivery', label: 'Cash on delivery', description: 'Pay when package arrives' }
];

export function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const [notice, setNotice] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const selectedPayment = useMemo(
    () => paymentOptions.find((option) => option.value === paymentMethod),
    [paymentMethod]
  );

  if (items.length === 0) return <EmptyState title="Your cart is empty" description="Add a product to see it here." />;

  async function handleCheckout() {
    setNotice(null);
    setSuccess(null);

    try {
      setIsCheckingOut(true);
      const result = await checkout({
        paymentMethod,
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
      });

      clearCart();
      setSuccess(`Payment successful. Reference: ${result.reference}. Order ID: ${result.orderId}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to complete payment simulation.');
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cart</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {formatNumber(totals.itemsCount)} items across {formatNumber(totals.uniqueItems)} products.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Close Cart</Link>
          <button
            onClick={() => {
              clearCart();
              setNotice(null);
              setSuccess(null);
            }}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-rose-600 dark:border-slate-700"
          >
            Clear cart
          </button>
        </div>
      </div>

      {notice ? <InlineAlert title={notice} tone="warning" /> : null}
      {success ? <InlineAlert title={success} tone="success" /> : null}

      <div className="space-y-4">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onDecrease={() => {
              setNotice(null);
              updateQuantity(item.product.id, item.quantity - 1);
            }}
            onIncrease={() => {
              if (item.quantity >= item.product.stock) {
                setNotice(`Only ${formatNumber(item.product.stock)} units of ${item.product.name} are available right now.`);
                return;
              }
              setNotice(null);
              updateQuantity(item.product.id, item.quantity + 1);
            }}
            onRemove={() => {
              setNotice(null);
              removeItem(item.product.id);
            }}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Payment simulation</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Choose how you want to pay, then simulate a secure checkout.</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPaymentMethod(option.value)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  paymentMethod === option.value
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                    : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
                }`}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs opacity-80">{option.description}</p>
              </button>
            ))}
          </div>

          {selectedPayment ? (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Selected: {selectedPayment.label}</p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 text-white dark:bg-slate-100 dark:text-slate-900">
          <p className="text-sm text-slate-300 dark:text-slate-700">Order total</p>
          <p className="mt-2 text-3xl font-bold">{formatCurrency(totals.subtotal)}</p>
          <p className="mt-2 text-xs text-slate-300 dark:text-slate-700">Demo checkout only. No real payment is processed.</p>
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-400"
          >
            {isCheckingOut ? 'Processing payment...' : 'Pay now'}
          </button>
        </div>
      </div>
    </section>
  );
}
