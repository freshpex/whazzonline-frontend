import type { Product } from '../../products/types/product';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartTotals = {
  itemsCount: number;
  uniqueItems: number;
  subtotal: number;
};

export type CartActionResult = {
  addedQuantity: number;
  newQuantity: number;
  exceededStock: boolean;
};
