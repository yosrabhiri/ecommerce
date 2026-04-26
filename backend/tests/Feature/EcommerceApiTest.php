<?php

namespace Tests\Feature;

use App\Models\Product;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcommerceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_listed_with_filters(): void
    {
        $this->seed(ProductSeeder::class);

        $response = $this->getJson('/api/products?category=Skincare&sort=price_asc');

        $response
            ->assertOk()
            ->assertJsonCount(20)
            ->assertJsonPath('0.category', 'Skincare')
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'brand',
                    'name',
                    'category',
                    'price',
                    'oldPrice',
                    'rating',
                    'tag',
                    'stock',
                    'material',
                    'skinType',
                    'skinConcern',
                    'occasion',
                    'productTags',
                    'sizes',
                    'colors',
                    'variants',
                    'image',
                    'images',
                    'description',
                ],
            ]);
    }

    public function test_products_can_be_filtered_by_recommendation_attributes(): void
    {
        $this->seed(ProductSeeder::class);

        $filters = $this->getJson('/api/filters')
            ->assertOk()
            ->assertJsonStructure([
                'sizes',
                'colors',
                'materials',
                'skinTypes',
                'skinConcerns',
                'occasions',
                'productTags',
            ]);

        $product = Product::query()->with('variants')->firstOrFail();
        $material = $product->material;
        $size = $product->variants->first()->size;

        $this
            ->getJson('/api/products?materials='.urlencode($material).'&sizes='.urlencode($size))
            ->assertOk()
            ->assertJsonFragment([
                'id' => $product->id,
                'material' => $material,
            ]);
    }

    public function test_checkout_requires_an_account(): void
    {
        $this->seed(ProductSeeder::class);

        $product = Product::query()->firstOrFail();

        $response = $this->postJson('/api/checkout', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response
            ->assertUnauthorized()
            ->assertJsonPath('message', 'You must sign in or register before payment.');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_registered_user_can_create_pending_order(): void
    {
        $this->seed(ProductSeeder::class);

        $product = Product::query()->firstOrFail();

        $registerResponse = $this->postJson('/api/auth/register', [
            'name' => 'Youssra',
            'email' => 'youssra@example.com',
            'password' => 'password123',
        ]);

        $token = $registerResponse
            ->assertCreated()
            ->json('token');

        $response = $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/checkout', [
                'items' => [
                    ['product_id' => $product->id, 'quantity' => 2],
                ],
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('order.status', 'pending')
            ->assertJsonPath('order.payment_status', 'pending')
            ->assertJsonPath('order.items.0.quantity', 2);

        $this->assertDatabaseHas('orders', [
            'id' => $response->json('order.id'),
            'customer_email' => null,
            'payment_method' => 'later',
        ]);
    }

    public function test_registered_user_can_pay_pending_order(): void
    {
        $this->seed(ProductSeeder::class);

        $product = Product::query()->firstOrFail();
        $token = $this->postJson('/api/auth/register', [
            'name' => 'Youssra',
            'email' => 'pay@example.com',
            'password' => 'password123',
        ])->json('token');

        $orderId = $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/checkout', [
                'items' => [
                    ['product_id' => $product->id, 'quantity' => 1],
                ],
            ])
            ->json('order.id');

        $response = $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/orders/{$orderId}/payment", [
                'cardholder_name' => 'Youssra Test',
                'card_number' => '4242 4242 4242 4242',
                'expiry' => now()->addYear()->format('m/y'),
                'cvc' => '123',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('order.status', 'confirmed')
            ->assertJsonPath('order.payment_status', 'paid')
            ->assertJsonPath('order.payments.0.status', 'paid')
            ->assertJsonPath('order.payments.0.card_last_four', '4242');

        $this->assertDatabaseHas('payments', [
            'order_id' => $orderId,
            'status' => 'paid',
            'card_last_four' => '4242',
        ]);
    }

    public function test_customer_account_summary_shows_orders_and_payments(): void
    {
        $this->seed(ProductSeeder::class);

        $product = Product::query()->firstOrFail();
        $token = $this->postJson('/api/auth/register', [
            'name' => 'Youssra',
            'email' => 'account@example.com',
            'password' => 'password123',
        ])->json('token');

        $order = $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/checkout', [
                'items' => [
                    ['product_id' => $product->id, 'quantity' => 1],
                ],
            ])
            ->json('order');

        $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/orders/{$order['id']}/payment", [
                'cardholder_name' => 'Youssra Test',
                'card_number' => '4242 4242 4242 4242',
                'expiry' => now()->addYear()->format('m/y'),
                'cvc' => '123',
            ])
            ->assertCreated();

        $this
            ->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/account/summary')
            ->assertOk()
            ->assertJsonPath('user.email', 'account@example.com')
            ->assertJsonPath('stats.orders', 1)
            ->assertJsonPath('stats.paidOrders', 1)
            ->assertJsonPath('orders.0.payment_status', 'paid')
            ->assertJsonStructure(['orders' => [['items' => [['product' => ['images']]]]]])
            ->assertJsonPath('payments.0.card_last_four', '4242');
    }

    public function test_admin_dashboard_requires_admin_user(): void
    {
        $this->seed(ProductSeeder::class);

        $customerToken = $this->postJson('/api/auth/register', [
            'name' => 'Customer',
            'email' => 'customer@example.com',
            'password' => 'password123',
        ])->json('token');

        $this
            ->withHeader('Authorization', "Bearer {$customerToken}")
            ->getJson('/api/admin/dashboard')
            ->assertForbidden()
            ->assertJsonPath('message', 'Admin access required.');

        $adminToken = $this->postJson('/api/auth/register', [
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password123',
        ])->json('token');

        \App\Models\User::query()
            ->where('email', 'admin@example.com')
            ->update(['is_admin' => true]);

        $this
            ->withHeader('Authorization', "Bearer {$adminToken}")
            ->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'stats' => ['products', 'orders', 'customers', 'revenue'],
                'recentOrders',
                'lowStockProducts',
                'topProducts',
            ]);
    }

    public function test_cart_items_are_stored_on_the_backend(): void
    {
        $this->seed(ProductSeeder::class);

        $product = Product::query()->firstOrFail();

        $addResponse = $this->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $addResponse
            ->assertCreated()
            ->assertJsonPath('items.0.product.id', $product->id)
            ->assertJsonPath('items.0.quantity', 2);

        $token = $addResponse->json('cart_token');

        $this->patchJson("/api/cart/items/{$product->id}", [
            'cart_token' => $token,
            'quantity' => 3,
        ])->assertOk()->assertJsonPath('items.0.quantity', 3);

        $this->deleteJson("/api/cart/items/{$product->id}", [
            'cart_token' => $token,
        ])->assertOk()->assertJsonCount(0, 'items');
    }
}
