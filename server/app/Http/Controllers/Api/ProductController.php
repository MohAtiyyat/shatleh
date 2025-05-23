<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Fetch all products, optionally filtered by category IDs.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function allProducts(Request $request): JsonResponse
    {
        try {
            // Get category_ids from query parameter (e.g., ?category_ids=1,2,3)
            $categoryIds = $request->query('category_ids') ? array_map('intval', explode(',', $request->query('category_ids'))) : null;

            $query = Product::query()
                ->select([
                    'products.id',
                    'products.name_en',
                    'products.name_ar',
                    'products.price',
                    'products.image',
                    'products.description_en',
                    'products.description_ar',
                    'products.availability',
                    'products.sold_quantity',
                ])
                ->where('products.status', 'Active');

            // Apply category filtering if category_ids are provided
            if ($categoryIds) {
                $query->join('category_products', 'products.id', '=', 'category_products.product_id')
                    ->whereIn('category_products.category_id', $categoryIds)
                    ->distinct(); // Ensure no duplicate products
            }

            $products = $query
                ->with(['categories' => function ($query) {
                    $query->select('categories.id', 'categories.name_en', 'categories.name_ar', 'categories.parent_id')
                        ->with(['subcategories' => function ($subQuery) {
                            $subQuery->select('id', 'name_en', 'name_ar', 'parent_id');
                        }]);
                }])
                ->withCount(['reviews as rating' => function ($query) {
                    $query->select(DB::raw('ROUND(COALESCE(AVG(rating), 0), 1)'));
                }])
                ->get();

            // Transform the response to match the frontend Product type
            $transformedProducts = $products->map(function ($product) {
                $categories = $product->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name_en' => $category->name_en,
                        'name_ar' => $category->name_ar,
                        'parent_id' => $category->parent_id,
                    ];
                });

                return [
                    'id' => $product->id,
                    'name_en' => $product->name_en,
                    'name_ar' => $product->name_ar,
                    'price' => $product->price,
                    'image' => $product->image,
                    'description_en' => $product->description_en,
                    'description_ar' => $product->description_ar,
                    'availability' => $product->availability,
                    'sold_quantity' => $product->sold_quantity,
                    'categories' => $categories, // Include all categories
                    'rating' => $product->rating,
                ];
            });

            return response()->json([
                'data' => $transformedProducts,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch products'], 500);
        }
    }

    /**
     * Fetch top-selling products.
     *
     * @return JsonResponse
     */
    public function top_sellers(): JsonResponse
    {
        try {
            $products = Product::query()
                ->select([
                    'products.id',
                    'products.name_en',
                    'products.name_ar',
                    'products.price',
                    'products.image',
                    'products.description_en',
                    'products.description_ar',
                    'products.availability',
                    'products.sold_quantity',
                ])
                ->where('products.status', 'Active')
                ->where('products.availability', true)
                ->orderBy('sold_quantity', 'desc')
                ->take(5)
                ->with(['categories' => function ($query) {
                    $query->select('categories.id', 'categories.name_en', 'categories.name_ar', 'categories.parent_id')
                        ->with(['subcategories' => function ($subQuery) {
                            $subQuery->select('id', 'name_en', 'name_ar', 'parent_id');
                        }]);
                }])
                ->withCount(['reviews as rating' => function ($query) {
                    $query->select(DB::raw('ROUND(COALESCE(AVG(rating), 0), 1)'));
                }])
                ->get();

            // Transform the response to match the frontend Product type
            $transformedProducts = $products->map(function ($product) {
                $categories = $product->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name_en' => $category->name_en,
                        'name_ar' => $category->name_ar,
                        'parent_id' => $category->parent_id,
                    ];
                });

                return [
                    'id' => $product->id,
                    'name_en' => $product->name_en,
                    'name_ar' => $product->name_ar,
                    'price' => $product->price,
                    'image' => $product->image,
                    'description_en' => $product->description_en,
                    'description_ar' => $product->description_ar,
                    'availability' => $product->availability,
                    'sold_quantity' => $product->sold_quantity,
                    'categories' => $categories, // Include all categories
                    'rating' => $product->rating,
                ];
            });

            return response()->json([
                'data' => $transformedProducts,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching top sellers: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch top sellers'], 500);
        }
    }

    /**
     * Fetch all categories with their subcategories.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        try {
            $categories = Category::query()
                ->whereNull('parent_id')
                ->with(['subcategories' => function ($query) {
                    $query->select('id', 'name_en', 'name_ar', 'parent_id');
                }])
                ->select('id', 'name_en', 'name_ar')
                ->get();

            return response()->json([
                'data' => $categories,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching categories: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch categories'], 500);
        }
    }
}
