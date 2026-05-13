import { useMemo } from 'react';
import { useCartStore } from '../../../store/cart.store';
import type { CartTotals } from '../types/cart';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const totals = useMemo<CartTotals>(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { itemsCount, uniqueItems: items.length, subtotal };
  }, [items]);

  return { items, totals, addItem, updateQuantity, removeItem, clearCart };
}
