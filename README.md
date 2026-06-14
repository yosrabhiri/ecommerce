# Maison Glow Ecommerce

Maison Glow is a full-stack ecommerce project built with a Laravel API backend and a React/Vite frontend. The app has a real product catalog, backend cart storage, token-based authentication, a multi-step checkout flow, a demo payment processor, and a customer account dashboard with payment history.

## Project Structure

```txt
backend/   Laravel API, database migrations, seeders, models, controllers, tests
frontend/  React storefront, product pages, cart drawer, checkout, payment, account pages
```

## What Was Built

### Catalog and Cart
- Product catalog loaded from Laravel through `/api/products`
- Product detail pages loaded from Laravel through `/api/products/{id}`
- Filter data loaded from Laravel through `/api/filters`
- Backend database structure for categories, brands, products, product images, carts, orders, order items, auth tokens, and payments
- Backend cart system using a guest cart token stored in localStorage

### Authentication
- Register and login API with custom token authentication (no Sanctum)
- Token hashed with SHA-256 before storage; never stored in plain text
- Header account menu showing Login or Logout depending on session state
- Guest cart merges into the user account on login or register

### Checkout and Payment Flow
The complete flow from cart to paid order is:

1. **Cart drawer** — user reviews items and clicks "Checkout"
2. **`/checkout` page** — shows the full order summary (product names, quantities, line totals, grand total) with a "Proceed to payment" button; guests are redirected to sign in first
3. **`POST /api/checkout`** — creates the order in the database with `status = pending`, decrements product stock, and clears the cart
4. **`/payment/:orderId` page** — fake card form (cardholder name, card number, expiry MM/YY, CVC); the backend runs a full Luhn check on the card number and validates the expiry date
5. **`POST /api/orders/{order}/payment`** — detects the card brand (Visa / Mastercard / Amex), stores only the last 4 digits, marks the order `payment_status = paid`, and records the payment
6. **`/payment/success` page** — confirmation screen showing the order number, items, total paid, and the card used (brand + last 4 digits)

No real money is charged. The payment processor is a local demo. A real provider such as Stripe can be wired in later.

### Customer Account
- `/account` page shows total spent, order count, paid orders, and cart item count
- Recent orders panel with product thumbnails and a "Pay order" shortcut for unpaid orders
- Payment history panel showing transaction references, card brand, last 4 digits, and amount
- `GET /api/account/summary` returns all of the above in one request
- `GET /api/payments` returns paginated payment history for the authenticated user

### Admin Dashboard
- `/admin` protected by `is_admin` flag on the user
- Dashboard with stats: total revenue, orders, products, users, pending orders, paid orders
- Product management: list, edit stock, toggle active/inactive
- Order management: list with status badges, inline status updates
- User list and payment list

### Other
- Loading state component used on catalog, product detail, and payment screens
- Error states for backend offline, invalid product, and failed payment
- Product seeder with 100 products (20 per category: skincare, dresses, knitwear, sets, accessories)
- Mobile-responsive layout

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

GET    /api/account/summary
GET    /api/payments

POST   /api/checkout
GET    /api/orders/{order}
POST   /api/orders/{order}/payment

GET    /api/admin/dashboard
GET    /api/admin/products
PATCH  /api/admin/products/{product}
GET    /api/admin/orders
PATCH  /api/admin/orders/{order}
GET    /api/admin/users
GET    /api/admin/payments
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

## Gmail Payment Receipts

Payment receipts are sent by the Laravel backend after `POST /api/orders/{order}/payment`. To send them with a Gmail App Password, set these values in `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your-gmail-address@gmail.com
MAIL_PASSWORD="your-16-character-gmail-app-password"
MAIL_FROM_ADDRESS="${MAIL_USERNAME}"
MAIL_FROM_NAME="${APP_NAME}"
```

Create the app password from your Google account security settings. Your Gmail account must have 2-Step Verification enabled. Paste the 16-character app password into `MAIL_PASSWORD`, then run:

```bash
cd backend
php artisan config:clear
```

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
