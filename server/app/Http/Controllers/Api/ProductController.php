<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function top_sellers(): JsonResponse
    {

        
        $products = Product::query()
            ->select('id', 'name_en', 'name_ar', 'price', 'image', 'description_en', 'description_ar', 'sold_quantity')
            ->where('availability', true)
            ->orderBy('sold_quantity', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => [
                        'en' => $product->name_en,
                        'ar' => $product->name_ar,
                    ],
                    'description' => [
                        'en' => $product->description_en,
                        'ar' => $product->description_ar,
                    ],
                    'image' => is_array($product->image) ? ($product->image[0] ?? null) : $product->image,
                    'rating' => 4.5, // Placeholder; replace with actual rating logic if available
                    'price' => number_format($product->price, 2) . ' JD',
                    'inStock' => $product->availability,
                ];
            });

        return response()->json([
            'data' => $products,
        ]);
    }
}
