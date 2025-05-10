<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request; // Added missing import
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Fetch the top 4 reviews for a product along with the average rating.
     *
     * @param int $productId
     * @return JsonResponse
     */
    public function getTopReviews($productId): JsonResponse
    {
        try {
            // Fetch top 4 reviews, ordered by created_at descending
            $reviews = Review::where('product_id', $productId)
                ->whereNull('deleted_at')
                ->orderBy('created_at', 'desc')
                ->take(4)
                ->with('customer')
                ->get();

            // Calculate average rating
            $averageRating = Review::where('product_id', $productId)
                ->whereNull('deleted_at')
                ->avg('rating') ?? 0;

            $formattedReviews = $reviews->map(function ($review) {
                // Check if created_at is null and log if it is
                if (is_null($review->created_at)) {
                    Log::warning("Review ID {$review->id} has null created_at for product ID {$review->product_id}");
                    $createdAt = now()->toIso8601String(); // Fallback to current timestamp
                } else {
                    $createdAt = $review->created_at->toIso8601String();
                }

                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'text' => $review->text,
                    'customer_name' => $review->customer ? ($review->customer->first_name . ' ' . $review->customer->last_name) : 'Anonymous',
                    'created_at' => $createdAt,
                ];
            });

            return response()->json([
                'data' => [
                    'reviews' => $formattedReviews,
                    'average_rating' => round($averageRating, 1),
                ],
                'message' => 'Reviews fetched successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to fetch reviews for product ID ' . $productId, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to fetch reviews',
                'message' => 'An unexpected error occurred while fetching reviews.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Submit a new review for a product.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function submitReview(Request $request): JsonResponse
    {
        try {
            Log::info('Review submitted' , $request->all());
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|integer',
                'rating' => 'required|integer|min:1|max:5',
                'text' => 'required|string',
                'customer_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check if the user has already reviewed this product
            $existingReview = Review::where('product_id', $request->product_id)
                ->where('customer_id', $request->customer_id)
                ->whereNull('deleted_at')
                ->exists();

            if ($existingReview) {
                return response()->json([
                    'error' => 'You have  reviewed this product',
                ], 400);
            }

            $review = Review::create([
                'product_id' => $request->product_id,
                'rating' => $request->rating,
                'text' => $request->text,
                'customer_id' => $request->customer_id,
            ]);

            return response()->json([
                'data' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'text' => $review->text,
                    'customer_name' => $review->customer ? ($review->customer->first_name . ' ' . $review->customer->last_name) : 'Anonymous',
                    'created_at' => $review->created_at ? $review->created_at->toIso8601String() : now()->toIso8601String(),
                ],
                'message' => 'Review submitted successfully',
            ], 201);
        } catch (Exception $e) {
            Log::error('Failed to submit review', [
                'request' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to submit review',
                'message' => 'An unexpected error occurred while submitting the review.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
