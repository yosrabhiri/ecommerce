<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with(['brand', 'category', 'images'])
            ->where('is_active', true)
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', fn ($category) => $category->where('name', $request->string('category')));
            })
            ->when($request->filled('brands'), function ($query) use ($request) {
                $brands = collect(explode(',', $request->string('brands')))
                    ->map(fn ($brand) => trim($brand))
                    ->filter()
                    ->all();

                $query->whereHas('brand', fn ($brandQuery) => $brandQuery->whereIn('name', $brands));
            })
            ->when($request->filled('tags'), function ($query) use ($request) {
                $tags = collect(explode(',', $request->string('tags')))
                    ->map(fn ($tag) => trim($tag))
                    ->filter()
                    ->all();

                $query->whereIn('tag', $tags);
            })
            ->when($request->filled('min_price'), fn ($query) => $query->where('price', '>=', $request->float('min_price')))
            ->when($request->filled('max_price'), fn ($query) => $query->where('price', '<=', $request->float('max_price')));

        match ($request->string('sort')->toString()) {
            'price_asc' => $products->orderBy('price'),
            'price_desc' => $products->orderByDesc('price'),
            'rating_desc' => $products->orderByDesc('rating'),
            default => $products->orderBy('id'),
        };

        return response()->json(
            $products->get()->map(fn (Product $product) => $this->productPayload($product))
        );
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        return response()->json($this->productPayload($product->load(['brand', 'category', 'images'])));
    }

    public function filters(): JsonResponse
    {
        return response()->json([
            'categories' => ['All', ...Category::query()->orderBy('name')->pluck('name')->all()],
            'brands' => Brand::query()->orderBy('name')->pluck('name'),
            'tags' => Product::query()->whereNotNull('tag')->distinct()->orderBy('tag')->pluck('tag'),
            'priceRanges' => [
                ['label' => 'Under $30', 'min' => null, 'max' => 30],
                ['label' => '$30 - $90', 'min' => 30, 'max' => 90],
                ['label' => 'Over $90', 'min' => 90, 'max' => null],
            ],
            'sorts' => [
                ['label' => 'Featured', 'value' => 'featured'],
                ['label' => 'Price: Low to High', 'value' => 'price_asc'],
                ['label' => 'Price: High to Low', 'value' => 'price_desc'],
                ['label' => 'Top Rated', 'value' => 'rating_desc'],
            ],
        ]);
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
