import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../app/products/types/product';

type WishlistState = {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return { items: state.items.filter((item) => item.id !== product.id) };
          return { items: [product, ...state.items] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),
      hasItem: (productId) => get().items.some((item) => item.id === productId),
      clear: () => set({ items: [] })
    }),
    { name: 'whazzonline-wishlist' }
  )
);
