import { getCartToken } from './cartApi';
import { getAuthToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createCheckout(cart) {
  const response = await fetch(`${API_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken() || ''}`,
    },
    body: JSON.stringify({
      cart_token: getCartToken(),
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.message || Object.values(payload.errors || {})[0]?.[0];
    throw new Error(validationMessage || 'Unable to create order');
  }

  return payload;
}
