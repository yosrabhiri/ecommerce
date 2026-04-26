import { getAuthToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchAccountSummary() {
  const response = await fetch(`${API_URL}/account/summary`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getAuthToken() || ''}`,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Unable to load account data');
  }

  return payload;
}
