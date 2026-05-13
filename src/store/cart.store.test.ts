import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cart.store';
import type { Product } from '../app/products/types/product';

const product: Product = {
  id: 'p-001',
  name: 'Wireless Headphones',
  price: 25000,
  description: 'Comfortable headphones with clear sound.',
  imageUrl: 'https://example.com/product.jpg',
  category: 'Electronics',
  stock: 3
};

describe('cart.store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCartStore.setState({ items: [] });
  });

  it('adds items and respects stock limits', () => {
    const addResult = useCartStore.getState().addItem(product, 2);
    expect(addResult.addedQuantity).toBe(2);
    expect(useCartStore.getState().items[0]?.quantity).toBe(2);

    const secondAdd = useCartStore.getState().addItem(product, 3);
    expect(secondAdd.exceededStock).toBe(true);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
  });

  it('updates quantity and removes items', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().updateQuantity(product.id, 2);
    expect(useCartStore.getState().items[0]?.quantity).toBe(2);

    useCartStore.getState().updateQuantity(product.id, 0);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(product, 1);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
