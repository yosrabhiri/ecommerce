import { getCartToken } from './cartApi';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_TOKEN_KEY = 'maison_glow_auth_token';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function parseAuthResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.message || Object.values(payload.errors || {})[0]?.[0];
    throw new Error(validationMessage || 'Unable to authenticate');
  }

  if (payload.token) {
    saveAuthToken(payload.token);
  }

  return payload;
}

export async function registerAccount({ name, email, password }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      cart_token: getCartToken(),
    }),
  });

  return parseAuthResponse(response);
}

export async function loginAccount({ email, password }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      cart_token: getCartToken(),
    }),
  });

  return parseAuthResponse(response);
}

export async function fetchCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearAuthToken();
    return null;
  }

  return parseAuthResponse(response);
}

export async function logoutAccount() {
  const token = getAuthToken();

  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }

  clearAuthToken();
}
