<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $user = AuthController::userFromBearerToken($request);

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $orders = Order::query()
            ->with(['items.product.images', 'payments'])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();

        $payments = Payment::query()
            ->with('order')
            ->whereHas('order', fn ($query) => $query->where('user_id', $user->id))
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ],
            'stats' => [
                'orders' => Order::query()->where('user_id', $user->id)->count(),
                'paidOrders' => Order::query()->where('user_id', $user->id)->where('payment_status', 'paid')->count(),
                'pendingOrders' => Order::query()->where('user_id', $user->id)->where('payment_status', 'pending')->count(),
                'totalSpent' => (float) Payment::query()
                    ->where('status', 'paid')
                    ->whereHas('order', fn ($query) => $query->where('user_id', $user->id))
                    ->sum('amount'),
                'cartItems' => (int) CartItem::query()
                    ->whereHas('cart', fn ($query) => $query->where('user_id', $user->id))
                    ->sum('quantity'),
            ],
            'orders' => $orders,
            'payments' => $payments,
        ]);
    }
}
