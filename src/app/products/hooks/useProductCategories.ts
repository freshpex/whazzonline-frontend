import { useQuery } from '@tanstack/react-query';
import { getProductCategories } from '../services/product.service';

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: getProductCategories
  });
}
