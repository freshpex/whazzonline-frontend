import { apiGet, apiPost } from '../../../lib/api';
import type { PaginatedProducts, Product, ProductCreateInput, ProductReview } from '../types/product';

type ApiResponse<T> = { success: boolean; data: T };

type ProductQuery = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export async function getProducts({ search, category, page = 1, limit = 9 }: ProductQuery) {
  const response = await apiGet<ApiResponse<PaginatedProducts>>('/products', {
    q: search,
    category,
    page,
    limit
  });
  return response.data;
}

export async function getProductCategories() {
  const response = await apiGet<ApiResponse<string[]>>('/products/categories');
  return response.data;
}

export async function getProduct(productId: string) {
  const response = await apiGet<ApiResponse<Product>>(`/products/${productId}`);
  return response.data;
}

export async function createProduct(payload: ProductCreateInput) {
  const response = await apiPost<ApiResponse<Product>, ProductCreateInput>('/products', payload);
  return response.data;
}

export async function getProductReviews(productId: string) {
  const response = await apiGet<ApiResponse<ProductReview[]>>(`/products/${productId}/reviews`);
  return response.data;
}

export async function createProductReview(
  productId: string,
  payload: { rating: number; comment?: string }
) {
  const response = await apiPost<ApiResponse<ProductReview>, { rating: number; comment?: string }>(
    `/products/${productId}/reviews`,
    payload
  );
  return response.data;
}
