const API_URL = import.meta.env.VITE_API_URL || '/api';

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    oldPrice: product.oldPrice || product.old_price ? Number(product.oldPrice ?? product.old_price) : null,
    images: product.images?.length ? product.images : [product.image],
  };
}

function buildProductQuery(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== 'All') {
    params.set('category', filters.category);
  }

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.brands?.length) {
    params.set('brands', filters.brands.join(','));
  }

  if (filters.tags?.length) {
    params.set('tags', filters.tags.join(','));
  }

  if (filters.priceRange?.min != null) {
    params.set('min_price', filters.priceRange.min);
  }

  if (filters.priceRange?.max != null) {
    params.set('max_price', filters.priceRange.max);
  }

  if (filters.sort && filters.sort !== 'featured') {
    params.set('sort', filters.sort);
  }

  return params.toString();
}

export async function fetchProducts(filters) {
  const query = buildProductQuery(filters);
  const response = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`);

  if (!response.ok) {
    throw new Error('Unable to load products');
  }

  const products = await response.json();
  return products.map(normalizeProduct);
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Unable to load product');
  }

  return normalizeProduct(await response.json());
}

export async function fetchFilters() {
  const response = await fetch(`${API_URL}/filters`);

  if (!response.ok) {
    throw new Error('Unable to load filters');
  }

  return response.json();
}

export async function fetchRecommendations(productId) {
  const response = await fetch(`${API_URL}/products/${productId}/recommendations`);

  if (!response.ok) {
    throw new Error('Unable to load recommendations');
  }

  const products = await response.json();
  return products.map(normalizeProduct);
}
