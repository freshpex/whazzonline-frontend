import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../services/product.service';

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId ?? ''),
    enabled: Boolean(productId)
  });
}
