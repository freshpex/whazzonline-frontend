import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';

type UseProductsArgs = {
  search?: string;
  category?: string;
};

export function useProducts({ search, category }: UseProductsArgs) {
  return useQuery({
    queryKey: ['products', { search, category }],
    queryFn: () => getProducts({ search, category })
  });
}
