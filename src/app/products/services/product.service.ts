import { apiGet } from '../../../lib/api';
import type { Product } from '../types/product';

type ApiResponse<T> = { success: boolean; data: T };

export async function getProducts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (category) params.set('category', category);
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await apiGet<ApiResponse<Product[]>>(`/products${query}`);
  return response.data;
}
