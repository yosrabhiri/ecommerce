const API_URL = import.meta.env.VITE_API_URL || '/api';
const CART_TOKEN_KEY = 'maison_glow_cart_token';

export function getCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

function saveCartToken(payload) {
  if (payload.cart_token) {
    localStorage.setItem(CART_TOKEN_KEY, payload.cart_token);
  }

  return payload;
}

async function parseCartResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.message || Object.values(payload.errors || {})[0]?.[0];
    throw new Error(validationMessage || 'Unable to update cart');
  }

  return saveCartToken(payload);
}

export async function fetchCart() {
  const token = getCartToken();
  const query = token ? `?cart_token=${encodeURIComponent(token)}` : '';
  const response = await fetch(`${API_URL}/cart${query}`);

  return parseCartResponse(response);
}

export async function addCartItem(productId, quantity = 1) {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      cart_token: getCartToken(),
      product_id: productId,
      quantity,
    }),
  });

  return parseCartResponse(response);
}

export async function updateCartItem(productId, quantity) {
  const response = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      cart_token: getCartToken(),
      quantity,
    }),
  });

  return parseCartResponse(response);
}

export async function deleteCartItem(productId) {
  const response = await fetch(`${API_URL}/cart/items/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      cart_token: getCartToken(),
    }),
  });

  return parseCartResponse(response);
}
