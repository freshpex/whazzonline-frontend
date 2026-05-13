import { apiGet, apiPost } from '../../../lib/api';
import type { Product, ProductCreateInput } from '../types/product';

type ApiResponse<T> = { success: boolean; data: T };

type ProductQuery = {
  search?: string;
  category?: string;
};

export async function getProducts({ search, category }: ProductQuery) {
  const response = await apiGet<ApiResponse<Product[]>>('/products', {
    q: search,
    category
  });
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
