<?php

use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
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

Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
Route::get('/admin/products', [AdminController::class, 'products']);
Route::patch('/admin/products/{product}', [AdminController::class, 'updateProduct']);
Route::get('/admin/orders', [AdminController::class, 'orders']);
Route::patch('/admin/orders/{order}', [AdminController::class, 'updateOrder']);
Route::get('/admin/users', [AdminController::class, 'users']);
Route::get('/admin/payments', [AdminController::class, 'payments']);
