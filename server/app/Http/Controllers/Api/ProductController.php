<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function allProducts(): JsonResponse
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
                    DB::raw('MIN(categories.name_en) as category_en'),
                    DB::raw('MIN(categories.name_ar) as category_ar'),
                ])
                ->leftJoin('category_products', 'products.id', '=', 'category_products.product_id')
                ->leftJoin('categories', 'category_products.category_id', '=', 'categories.id')
                ->where('products.availability', true )
                ->groupBy('products.id')
                ->withCount(['reviews as rating' => function ($query) {
                    $query->select(DB::raw('ROUND(COALESCE(AVG(rating), 0), 1)'));
                }])
                ->get();

            return response()->json([
                'data' => $products,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch products'], 500);
        }
    }

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
                    DB::raw('MIN(categories.name_en) as category'),
                    DB::raw('MIN(categories.name_ar) as categoryAr'),
                ])
                ->leftJoin('category_products', 'products.id', '=', 'category_products.product_id')
                ->leftJoin('categories', 'category_products.category_id', '=', 'categories.id')
                ->where('products.availability', true)
                ->groupBy('products.id')
                ->orderBy('sold_quantity', 'desc')
                ->take(5)
                ->withCount(['reviews as rating' => function ($query) {
                    $query->select(DB::raw('ROUND(COALESCE(AVG(rating), 0), 1)'));
                }])
                ->get();

            return response()->json([
                'data' => $products,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching top sellers: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch top sellers'], 500);
        }
    }
}
