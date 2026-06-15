<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Maison Glow API',
        'status' => 'running',
        'endpoints' => [
            'products' => url('/api/products'),
            'filters' => url('/api/filters'),
            'health' => url('/up'),
        ],
    ]);
});
