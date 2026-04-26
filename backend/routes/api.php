<?php

use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/filters', [ProductController::class, 'filters']);

Route::get('/cart', [CartController::class, 'show']);
Route::post('/cart/items', [CartController::class, 'storeItem']);
Route::patch('/cart/items/{product}', [CartController::class, 'updateItem']);
Route::delete('/cart/items/{product}', [CartController::class, 'destroyItem']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

Route::get('/orders/{order}', [OrderController::class, 'show']);
Route::post('/checkout', [CheckoutController::class, 'store']);
Route::post('/orders/{order}/payment', [PaymentController::class, 'store']);
