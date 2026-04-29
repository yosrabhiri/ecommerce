<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function show(Request $request, Order $order): JsonResponse
    {
        $user = AuthController::userFromBearerToken($request);

        if (! $user || $order->user_id !== $user->id) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        return response()->json([
            'order' => $order->load(['items', 'payments']),
        ]);
    }
}
