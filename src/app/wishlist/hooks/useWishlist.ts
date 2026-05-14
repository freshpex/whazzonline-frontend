import { useWishlistStore } from '../../../store/wishlist.store';

export function useWishlist() {
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clear = useWishlistStore((state) => state.clear);
  const hasItem = useWishlistStore((state) => state.hasItem);
  return { items, toggleItem, removeItem, clear, hasItem };
}
