<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('is_active', true)
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', fn ($category) => $category->where('name', $request->string('category')));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->string('search') . '%';

                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search)
                        ->orWhereHas('brand', fn ($brand) => $brand->where('name', 'like', $search))
                        ->orWhereHas('category', fn ($category) => $category->where('name', 'like', $search));
                });
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
            ->when($request->filled('materials'), function ($query) use ($request) {
                $query->whereIn('material', $this->csvValues($request, 'materials'));
            })
            ->when($request->filled('skin_types'), function ($query) use ($request) {
                $query->whereIn('skin_type', $this->csvValues($request, 'skin_types'));
            })
            ->when($request->filled('skin_concerns'), function ($query) use ($request) {
                $query->whereIn('skin_concern', $this->csvValues($request, 'skin_concerns'));
            })
            ->when($request->filled('occasions'), function ($query) use ($request) {
                $query->whereIn('occasion', $this->csvValues($request, 'occasions'));
            })
            ->when($request->filled('sizes'), function ($query) use ($request) {
                $query->whereHas('variants', fn ($variant) => $variant->whereIn('size', $this->csvValues($request, 'sizes')));
            })
            ->when($request->filled('colors'), function ($query) use ($request) {
                $query->whereHas('variants', fn ($variant) => $variant->whereIn('color', $this->csvValues($request, 'colors')));
            })
            ->when($request->filled('product_tags'), function ($query) use ($request) {
                foreach ($this->csvValues($request, 'product_tags') as $tag) {
                    $query->whereJsonContains('product_tags', $tag);
                }
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

        return response()->json($this->productPayload($product->load(['brand', 'category', 'images', 'variants'])));
    }

    public function recommendations(Product $product): JsonResponse
    {
        abort_unless($product->is_active, 404);

        $product->load(['brand', 'category']);
        $currentKeywords = $this->extractKeywords($product->name . ' ' . $product->description);

        $oftenBoughtIds = OrderItem::query()
            ->whereIn('order_id', function ($query) use ($product) {
                $query->select('order_id')
                    ->from('order_items')
                    ->where('product_id', $product->id);
            })
            ->where('product_id', '!=', $product->id)
            ->select('product_id', DB::raw('count(*) as total'))
            ->groupBy('product_id')
            ->orderByDesc('total')
            ->limit(5)
            ->pluck('product_id')
            ->all();

        $recommendations = Product::query()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->get()
            ->map(function (Product $item) use ($currentKeywords, $product, $oftenBoughtIds) {
                $itemKeywords = $this->extractKeywords($item->name . ' ' . $item->description);
                $commonKeywords = array_intersect($currentKeywords, $itemKeywords);

                $score = count($commonKeywords);

                if (in_array($item->id, $oftenBoughtIds, true)) {
                    $score += 15;
                    $item->is_bundle = true;
                }

                if ($item->category_id === $product->category_id) {
                    $score += 5;
                }

                if ($item->brand_id === $product->brand_id) {
                    $score += 3;
                }

                $priceDiff = abs($item->price - $product->price);
                if ($priceDiff <= ($product->price * 0.2)) {
                    $score += 4;
                }

                $item->ai_score = $score;
                $item->ai_insight = $this->generateAiInsight(
                    $product,
                    $item,
                    $commonKeywords,
                    in_array($item->id, $oftenBoughtIds, true)
                );

                return $item;
            })
            ->filter(fn (Product $item) => $item->ai_score > 0)
            ->sortByDesc('ai_score')
            ->take(8)
            ->values();

        return response()->json(
            $recommendations->map(fn (Product $item) => array_merge($this->productPayload($item), [
                'aiInsight' => $item->ai_insight,
                'aiScore' => $item->ai_score,
                'isBundle' => $item->is_bundle ?? false,
            ]))
        );
    }

    public function cartRecommendations(Request $request): JsonResponse
    {
        $productIds = $request->input('product_ids', []);

        if (empty($productIds)) {
            return response()->json([]);
        }

        $recommendations = Product::query()
            ->with(['brand', 'category', 'images', 'variants'])
            ->where('is_active', true)
            ->whereNotIn('id', $productIds)
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return response()->json(
            $recommendations->map(fn (Product $item) => array_merge($this->productPayload($item), [
                'aiInsight' => 'Complements your current selection.',
            ]))
        );
    }

    public function filters(): JsonResponse
    {
        return response()->json([
            'categories' => ['All', ...Category::query()->orderBy('name')->pluck('name')->all()],
            'brands' => Brand::query()->orderBy('name')->pluck('name'),
            'tags' => Product::query()->whereNotNull('tag')->distinct()->orderBy('tag')->pluck('tag'),
            'sizes' => $this->variantValues('size'),
            'colors' => $this->variantValues('color'),
            'materials' => $this->productValues('material'),
            'skinTypes' => $this->productValues('skin_type'),
            'skinConcerns' => $this->productValues('skin_concern'),
            'occasions' => $this->productValues('occasion'),
            'productTags' => Product::query()
                ->get()
                ->flatMap(fn (Product $product) => $product->product_tags ?? [])
                ->unique()
                ->sort()
                ->values(),
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
            'material' => $product->material,
            'skinType' => $product->skin_type,
            'skinConcern' => $product->skin_concern,
            'occasion' => $product->occasion,
            'productTags' => $product->product_tags ?? [],
            'sizes' => $product->variants->pluck('size')->filter()->unique()->values()->all(),
            'colors' => $product->variants->pluck('color')->filter()->unique()->values()->all(),
            'variants' => $product->variants->map(fn ($variant) => [
                'id' => $variant->id,
                'sku' => $variant->sku,
                'size' => $variant->size,
                'color' => $variant->color,
                'stock' => $variant->stock,
            ])->values()->all(),
            'image' => $images[0] ?? null,
            'images' => $images,
            'description' => $product->description,
        ];
    }

    private function extractKeywords(string $text): array
    {
        $stopWords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'];
        $text = strtolower($text);
        $text = preg_replace('/[^a-z0-9\s]/', '', $text);
        $words = explode(' ', $text);

        $keywords = array_filter($words, function ($word) use ($stopWords) {
            return strlen($word) > 2 && !in_array($word, $stopWords, true);
        });

        return array_values(array_unique($keywords));
    }

    private function generateAiInsight(Product $current, Product $recommended, array $common, bool $isBundle): string
    {
        if ($isBundle) {
            return 'Often purchased together with this item.';
        }

        if ($current->category_id === $recommended->category_id) {
            return 'From our ' . $current->category->name . ' collection.';
        }

        if (count($common) > 0) {
            $keyword = ucfirst($common[array_rand($common)]);
            return 'Matches your interest in ' . $keyword . '.';
        }

        return 'Complementary to your style.';
    }

    private function csvValues(Request $request, string $key): array
    {
        return collect(explode(',', $request->string($key)))
            ->map(fn ($value) => trim($value))
            ->filter()
            ->values()
            ->all();
    }

    private function productValues(string $column)
    {
        return Product::query()
            ->whereNotNull($column)
            ->distinct()
            ->orderBy($column)
            ->pluck($column);
    }

    private function variantValues(string $column)
    {
        return \App\Models\ProductVariant::query()
            ->whereNotNull($column)
            ->distinct()
            ->orderBy($column)
            ->pluck($column);
    }
}
