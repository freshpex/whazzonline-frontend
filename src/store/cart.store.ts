import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartActionResult, CartItem } from '../app/cart/types/cart';
import type { Product } from '../app/products/types/product';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => CartActionResult;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        let addedQuantity = 0;
        let newQuantity = 0;
        const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
          const stock = Math.max(0, product.stock);

          if (existingIndex === -1) {
            const allowed = clamp(safeQuantity, 0, stock);
            addedQuantity = allowed;
            newQuantity = allowed;
            if (allowed === 0) return state;
            return { items: [...state.items, { product, quantity: allowed }] };
          }

          const existing = state.items[existingIndex];
          if (!existing) return state;
          const upperBound = stock === 0 ? existing.quantity : stock;
          const updatedQuantity = clamp(existing.quantity + safeQuantity, 1, upperBound);
          addedQuantity = Math.max(0, updatedQuantity - existing.quantity);
          newQuantity = updatedQuantity;
          if (addedQuantity === 0) return state;

          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            product: existing.product,
            quantity: updatedQuantity
          };
          return { items: updatedItems };
        });

        return {
          addedQuantity,
          newQuantity,
          exceededStock: addedQuantity < safeQuantity
        };
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const index = state.items.findIndex((item) => item.product.id === productId);
          if (index === -1) return state;
          const item = state.items[index];
          if (!item) return state;
          const stock = Math.max(0, item.product.stock);
          const upperBound = stock === 0 ? item.quantity : stock;
          const normalized = Math.floor(quantity);

          if (normalized <= 0) {
            return { items: state.items.filter((cartItem) => cartItem.product.id !== productId) };
          }

          const nextQuantity = clamp(normalized, 1, upperBound);
          if (nextQuantity === item.quantity) return state;

          const updatedItems = [...state.items];
          updatedItems[index] = {
            product: item.product,
            quantity: nextQuantity
          };
          return { items: updatedItems };
        });
      },
      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'whazzonline-cart'
    }
  )
);
