<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($this->cartPayload($this->cartForToken($request->string('cart_token')->toString())));
    }

    public function storeItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cart_token' => ['nullable', 'string', 'max:255'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $product = Product::query()
            ->where('is_active', true)
            ->findOrFail($data['product_id']);

        $cart = $this->cartForToken($data['cart_token'] ?? null);
        $quantity = $data['quantity'] ?? 1;
        $item = $cart->items()->firstOrNew(['product_id' => $product->id]);
        $nextQuantity = $item->exists ? $item->quantity + $quantity : $quantity;

        $this->ensureStock($product, $nextQuantity);

        $item->quantity = $nextQuantity;
        $item->save();

        return response()->json($this->cartPayload($cart), 201);
    }

    public function updateItem(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'cart_token' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        abort_unless($product->is_active, 404);

        $this->ensureStock($product, $data['quantity']);

        $cart = $this->cartForToken($data['cart_token']);
        $cart->items()->updateOrCreate(
            ['product_id' => $product->id],
            ['quantity' => $data['quantity']]
        );

        return response()->json($this->cartPayload($cart));
    }

    public function destroyItem(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'cart_token' => ['required', 'string', 'max:255'],
        ]);

        $cart = $this->cartForToken($data['cart_token']);
        $cart->items()->where('product_id', $product->id)->delete();

        return response()->json($this->cartPayload($cart));
    }

    private function cartForToken(?string $token): Cart
    {
        if ($token) {
            $cart = Cart::query()->where('token', $token)->first();

            if ($cart) {
                return $cart;
            }
        }

        return Cart::query()->create(['token' => (string) Str::uuid()]);
    }

    private function ensureStock(Product $product, int $quantity): void
    {
        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => "{$product->name} does not have enough stock.",
            ]);
        }
    }

    private function cartPayload(Cart $cart): array
    {
        $cart->load(['items.product.brand', 'items.product.category', 'items.product.images']);

        $items = $cart->items
            ->filter(fn ($item) => $item->product && $item->product->is_active)
            ->values()
            ->map(fn ($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'lineTotal' => (float) $item->product->price * $item->quantity,
                'product' => $this->productPayload($item->product),
            ]);

        return [
            'cart_token' => $cart->token,
            'items' => $items,
            'count' => $items->sum('quantity'),
            'total' => $items->sum('lineTotal'),
        ];
    }

    private function productPayload(Product $product): array
    {
        $images = $product->images->pluck('url')->all();

        return [
            'id' => $product->id,
            'brand' => $product->brand->name,
            'name' => $product->name,
            'category' => $product->category->name,
            'price' => (float) $product->price,
            'oldPrice' => $product->old_price ? (float) $product->old_price : null,
            'rating' => (float) $product->rating,
            'tag' => $product->tag,
            'stock' => $product->stock,
            'image' => $images[0] ?? null,
            'images' => $images,
            'description' => $product->description,
        ];
    }
}
