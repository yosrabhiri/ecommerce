# Maison Glow Ecommerce

Maison Glow is a full-stack ecommerce project built with a Laravel API backend and a React/Vite frontend. The app now has a real product catalog, backend cart storage, account authentication, checkout protection, and a demo payment flow.

## Project Structure

```txt
backend/   Laravel API, database migrations, seeders, models, controllers, tests
frontend/  React storefront, product pages, cart drawer, auth page, payment page
```

## What Was Built

- Product catalog loaded from Laravel through `/api/products`
- Product detail pages loaded from Laravel through `/api/products/{id}`
- Filter data loaded from Laravel through `/api/filters`
- Backend database structure for categories, brands, products, product images, carts, orders, order items, auth tokens, and payments
- Backend cart system using a guest cart token
- Register/login API with token authentication
- Header account menu that shows Login or Logout on hover
- Checkout protection: guests must sign in or register before payment
- Pending order creation after authenticated checkout
- Demo card payment step that records a payment and marks the order as paid
- Loading state component for catalog, product, and payment loading screens
- Improved auth page UI and payment page UI
- Product seeder with 100 products, 20 per category

## Backend API Routes

```txt
GET    /api/products
GET    /api/products/{product}
GET    /api/filters

GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/{product}
DELETE /api/cart/items/{product}

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

POST   /api/checkout
GET    /api/orders/{order}
POST   /api/orders/{order}/payment
```

## Database

The current backend is configured for MySQL:

```env
DB_CONNECTION=mysql
DB_DATABASE=maison_glow
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed data:

```bash
cd backend
php artisan migrate:fresh --seed
```

The product seeder creates:

- 20 skincare products
- 20 dresses
- 20 knitwear products
- 20 sets
- 20 accessories

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Backend URL:

```txt
http://127.0.0.1:8000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://127.0.0.1:5173
```

The frontend proxies `/api` requests to the Laravel backend.

## Payment Note

The payment flow is a local demo processor. It validates the card shape and stores only the card brand and last four digits. It does not charge real money. A real provider such as Stripe can be added later.

## Tests

Run backend tests:

```bash
cd backend
php artisan test
```

Current coverage includes:

- product filters
- guest checkout blocking
- registered user checkout
- backend cart storage
- payment confirmation
