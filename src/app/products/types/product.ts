export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  category: string;
  stock: number;
};

export type ProductCreateInput = {
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

export type PaginatedProducts = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductReview = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: string;
};
