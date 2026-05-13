import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';

type UseProductsArgs = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export function useProducts({ search, category, page = 1, limit = 9 }: UseProductsArgs) {
  return useQuery({
    queryKey: ['products', { search, category, page, limit }],
    queryFn: () => getProducts({ search, category, page, limit })
  });
}
