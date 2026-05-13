import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProductReview, getProductReviews } from '../services/product.service';

export function useProductReviews(productId?: string) {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => getProductReviews(productId ?? ''),
    enabled: Boolean(productId)
  });
}

export function useCreateProductReview(productId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; comment?: string }) => createProductReview(productId ?? '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
    }
  });
}
