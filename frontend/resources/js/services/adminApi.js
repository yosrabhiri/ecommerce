import { getAuthToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function adminRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken() || ''}`,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to load admin data');
  }

  return payload;
}

export function fetchAdminDashboard() {
  return adminRequest('/admin/dashboard');
}

export function fetchAdminProducts() {
  return adminRequest('/admin/products');
}

export function fetchAdminOrders() {
  return adminRequest('/admin/orders');
}

export function fetchAdminUsers() {
  return adminRequest('/admin/users');
}

export function fetchAdminPayments() {
  return adminRequest('/admin/payments');
}

export function updateAdminProduct(productId, data) {
  return adminRequest(`/admin/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function updateAdminOrder(orderId, status) {
  return adminRequest(`/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
