import { getAuthToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function parsePaymentResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.message || Object.values(payload.errors || {})[0]?.[0];
    throw new Error(validationMessage || 'Unable to process payment');
  }

  return payload;
}

export async function fetchOrder(orderId) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken() || ''}`,
    },
  });

  return parsePaymentResponse(response);
}

export async function payOrder(orderId, paymentDetails) {
  const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken() || ''}`,
    },
    body: JSON.stringify(paymentDetails),
  });

  return parsePaymentResponse(response);
}
