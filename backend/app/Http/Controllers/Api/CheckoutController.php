<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = AuthController::userFromBearerToken($request);

        if (! $user) {
            return response()->json([
                'message' => 'You must sign in or register before payment.',
            ], 401);
        }

        $data = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'cart_token' => ['nullable', 'string', 'max:255'],
            'customer.name' => ['nullable', 'string', 'max:255'],
            'customer.email' => ['nullable', 'email', 'max:255'],
            'customer.phone' => ['nullable', 'string', 'max:50'],
            'shipping.address' => ['nullable', 'string', 'max:255'],
            'shipping.city' => ['nullable', 'string', 'max:255'],
            'shipping.postal_code' => ['nullable', 'string', 'max:50'],
            'shipping.country' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $quantities = collect($data['items'])->mapWithKeys(
            fn (array $item) => [(int) $item['product_id'] => (int) $item['quantity']]
        );

        $products = Product::query()
            ->whereIn('id', $quantities->keys())
            ->where('is_active', true)
            ->get();

        if ($products->count() !== $quantities->count()) {
            throw ValidationException::withMessages([
                'items' => 'One or more products are unavailable.',
            ]);
        }

        foreach ($products as $product) {
            if ($product->stock < $quantities[$product->id]) {
                throw ValidationException::withMessages([
                    'items' => "{$product->name} does not have enough stock.",
                ]);
            }
        }

        $subtotal = $products->sum(
            fn (Product $product) => (float) $product->price * $quantities[$product->id]
        );

        $order = DB::transaction(function () use ($data, $products, $quantities, $subtotal, $user) {
            $order = Order::query()->create([
                'user_id' => $user->id,
                'order_number' => 'MG-'.now()->format('Ymd').'-'.strtoupper(str()->random(6)),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'later',
                'customer_name' => $data['customer']['name'] ?? null,
                'customer_email' => $data['customer']['email'] ?? null,
                'customer_phone' => $data['customer']['phone'] ?? null,
                'shipping_address' => $data['shipping']['address'] ?? null,
                'shipping_city' => $data['shipping']['city'] ?? null,
                'shipping_postal_code' => $data['shipping']['postal_code'] ?? null,
                'shipping_country' => $data['shipping']['country'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($products as $product) {
                $quantity = $quantities[$product->id];
                $lineTotal = (float) $product->price * $quantity;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $product->price,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ]);

                $product->decrement('stock', $quantity);
            }

            if (! empty($data['cart_token'])) {
                Cart::query()
                    ->where('token', $data['cart_token'])
                    ->first()
                    ?->items()
                    ->delete();
            }

            return $order->load('items');
        });

        return response()->json([
            'message' => 'Order created. Payment is pending until the real payment flow is added.',
            'order' => $order,
        ], 201);
    }
}
