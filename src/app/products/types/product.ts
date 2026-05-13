export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
};

export type ProductSort = 'featured' | 'price-asc' | 'price-desc';

export type ProductFilters = {
  search: string;
  category: string;
  inStockOnly: boolean;
  sort: ProductSort;
};
