import { apiPost } from '../../../lib/api';

type ApiResponse<T> = { success: boolean; data: T };

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'wallet' | 'cash_on_delivery';

export type CheckoutPayload = {
  paymentMethod: PaymentMethod;
  items: Array<{ productId: string; quantity: number }>;
};

export type CheckoutResult = {
  orderId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'paid';
  reference: string;
};

export async function checkout(payload: CheckoutPayload) {
  const response = await apiPost<ApiResponse<CheckoutResult>, CheckoutPayload>('/orders/checkout', payload);
  return response.data;
}
