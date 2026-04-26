<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        return response()->json([
            'stats' => [
                'products' => Product::query()->count(),
                'activeProducts' => Product::query()->where('is_active', true)->count(),
                'orders' => Order::query()->count(),
                'paidOrders' => Order::query()->where('payment_status', 'paid')->count(),
                'customers' => User::query()->where('is_admin', false)->count(),
                'revenue' => (float) Payment::query()->where('status', 'paid')->sum('amount'),
                'lowStock' => Product::query()->where('stock', '<=', 8)->count(),
            ],
            'recentOrders' => $this->ordersQuery()->limit(8)->get(),
            'lowStockProducts' => $this->productsQuery()->where('stock', '<=', 8)->limit(8)->get(),
            'topProducts' => $this->topProducts(),
        ]);
    }

    public function products(Request $request): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        return response()->json([
            'products' => $this->productsQuery()->paginate(20),
        ]);
    }

    public function orders(Request $request): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        return response()->json([
            'orders' => $this->ordersQuery()->paginate(20),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        return response()->json([
            'users' => User::query()
                ->withCount('authTokens')
                ->withCount('orders')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function payments(Request $request): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        return response()->json([
            'payments' => Payment::query()
                ->with('order.user')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        $data = $request->validate([
            'stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $product->update($data);

        return response()->json([
            'product' => $product->load(['brand', 'category', 'images']),
        ]);
    }

    public function updateOrder(Request $request, Order $order): JsonResponse
    {
        if ($forbidden = $this->authorizeAdmin($request)) {
            return $forbidden;
        }

        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,processing,shipped,delivered,cancelled,refunded'],
        ]);

        $order->update($data);

        return response()->json([
            'order' => $order->load(['user', 'items', 'payments']),
        ]);
    }

    private function authorizeAdmin(Request $request): ?JsonResponse
    {
        $user = AuthController::userFromBearerToken($request);

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! $user->is_admin) {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        return null;
    }

    private function productsQuery()
    {
        return Product::query()
            ->with(['brand', 'category', 'images'])
            ->orderBy('stock')
            ->orderBy('name');
    }

    private function ordersQuery()
    {
        return Order::query()
            ->with(['user', 'items', 'payments'])
            ->latest();
    }

    private function topProducts()
    {
        return DB::table('order_items')
            ->select('product_name', DB::raw('sum(quantity) as quantity'), DB::raw('sum(line_total) as revenue'))
            ->groupBy('product_name')
            ->orderByDesc('quantity')
            ->limit(8)
            ->get();
    }
}
