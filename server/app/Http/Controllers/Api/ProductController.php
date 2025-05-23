<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Product;
use App\Models\Service;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{

    /**
     * Search products, posts, and services based on query.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->query('q', '');
            $contentType = $request->query('type', 'all'); // 'products', 'posts', 'services', or 'all'

            if (empty($query)) {
                return response()->json([
                    'data' => [
                        'products' => [],
                        'posts' => [],
                        'services' => [],
                    ],
                    'message' => 'Search query is required',
                ], 400);
            }

            $results = [
                'products' => [],
                'posts' => [],
                'services' => [],
            ];

            // Search Products
            if ($contentType === 'all' || $contentType === 'products') {
                $productsQuery = Product::query()
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
                    ->where(function ($q) use ($query) {
                        $q->where('name_en', 'LIKE', "%{$query}%")
                            ->orWhere('name_ar', 'LIKE', "%{$query}%")
                            ->orWhere('description_en', 'LIKE', "%{$query}%")
                            ->orWhere('description_ar', 'LIKE', "%{$query}%");
                    })
                    ->with(['categories' => function ($query) {
                        $query->select('categories.id', 'categories.name_en', 'categories.name_ar', 'categories.parent_id')
                            ->with(['subcategories' => function ($subQuery) {
                                $subQuery->select('id', 'name_en', 'name_ar', 'parent_id');
                            }]);
                    }])
                    ->withCount(['reviews as rating' => function ($query) {
                        $query->select(DB::raw('ROUND(COALESCE(AVG(rating), 0), 1)'));
                    }]);

                $products = $productsQuery->get()->map(function ($product) {
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
                        'categories' => $categories,
                        'rating' => $product->rating,
                    ];
                });

                $results['products'] = $products;
            }

            // Search Posts
            if ($contentType === 'all' || $contentType === 'posts') {
                $postsQuery = Post::query()
                    ->select([
                        'posts.id',
                        'posts.title_en',
                        'posts.title_ar',
                        'posts.content_en',
                        'posts.content_ar',
                        'posts.category_id',
                        'posts.product_id',
                        'posts.image',
                    ])
                    ->where(function ($q) use ($query) {
                        $q->where('title_en', 'LIKE', "%{$query}%")
                            ->orWhere('title_ar', 'LIKE', "%{$query}%")
                            ->orWhere('content_en', 'LIKE', "%{$query}%")
                            ->orWhere('content_ar', 'LIKE', "%{$query}%");
                    })
                    ->with(['category', 'product']);

                $posts = $postsQuery->get()->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title_en' => $post->title_en,
                        'title_ar' => $post->title_ar,
                        'content_en' => $post->content_en,
                        'content_ar' => $post->content_ar,
                        'category_id' => $post->category_id,
                        'category_en' => $post->category ? $post->category->name_en : null,
                        'category_ar' => $post->category ? $post->category->name_ar : null,
                        'product_id' => $post->product_id,
                        'product_en' => $post->product ? $post->product->name_en : null,
                        'product_ar' => $post->product ? $post->product->name_ar : null,
                        'image' => $post->image ? asset('storage/' . $post->image) : null,
                    ];
                });

                $results['posts'] = $posts;
            }

            // Search Services
            if ($contentType === 'all' || $contentType === 'services') {
                $servicesQuery = Service::query()
                    ->select([
                        'services.id',
                        'services.name_en',
                        'services.name_ar',
                        'services.description_en',
                        'services.description_ar',
                        'services.image',
                    ])
                    ->where('services.status', 1)
                    ->where(function ($q) use ($query) {
                        $q->where('name_en', 'LIKE', "%{$query}%")
                            ->orWhere('name_ar', 'LIKE', "%{$query}%")
                            ->orWhere('description_en', 'LIKE', "%{$query}%")
                            ->orWhere('description_ar', 'LIKE', "%{$query}%");
                    });

                $services = $servicesQuery->get()->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name_en' => $service->name_en,
                        'name_ar' => $service->name_ar,
                        'description_en' => $service->description_en,
                        'description_ar' => $service->description_ar,
                        'image' => $service->image,
                    ];
                });

                $results['services'] = $services;
            }

            return response()->json([
                'data' => $results,
                'message' => 'Search results fetched successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Error performing search: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to perform search'], 500);
        }
    }


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
