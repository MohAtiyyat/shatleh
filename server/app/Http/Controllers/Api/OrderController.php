<?php

namespace App\Http\Controllers\Api;

use App\Enums\LogsTypes;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use App\Traits\HelperTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    use HelperTrait;
    /**
     * Fetch all orders for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $orders = Order::where('customer_id', $user->id)
                ->with(['products', 'address'])
                ->get();

            $formattedOrders = $orders->map(function ($order) use ($request) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'order_date' => $order->order_date
                        ? $order->order_date->toIso8601String()
                        : now()->toIso8601String(), // Fallback to current timestamp
                    'total_price' => $order->total_price,
                    'status' => $order->status,
                    'products' => $order->products->map(function ($product) use ($request) {
                        return [
                            'id' => $product->id,
                            'name' => [
                                'en' => $product->name_en,
                                'ar' => $product->name_ar,
                            ],
                            'image' => $product->image,
                            'price' => $product->pivot->price,
                            'quantity' => $product->pivot->quantity,
                        ];
                    }),
                    'address' => $order->address ? [
                        'title' => $order->address->title,
                        'city' => $order->address->city,
                        'address_line' => $order->address->address_line,
                    ] : null,
                ];
            });

            return response()->json([
                'data' => $formattedOrders,
                'message' => 'Orders fetched successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to fetch orders', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to fetch orders',
                'message' => 'An unexpected error occurred while fetching orders.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Cancel an order.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function cancel($id): JsonResponse
    {
        try {
            $user = Auth::user();
            $order = Order::where('id', $id)
                ->where('customer_id', $user->id)
                ->firstOrFail();

            if ($order->status !== 'pending') {
                return response()->json([
                    'error' => 'Cannot cancel order',
                    'message' => 'Only pending orders can be cancelled.',
                ], 400);
            }

            $order->status = 'cancelled';
            $order->save();

            $this->logAction(
                $user->id,
                'order_cancelled',
                'Order cancelled successfully: Order ID ' . $order->id,
                LogsTypes::INFO->value
            );
            return response()->json([
                'message' => 'Order cancelled successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to cancel order', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->logAction(
                Auth::id(),
                'order_cancel_error',
                'Failed to cancel order: ' . $e,
                LogsTypes::ERROR->value
            );
            
            return response()->json([
                'error' => 'Failed to cancel order',
                'message' => 'An unexpected error occurred while cancelling the order.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Fetch unrated, non-skipped, delivered orders for the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getUnratedOrders(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $orders = Order::where('customer_id', $user->id)
                ->where('status', 'delivered')
                ->where('skipped_rating', false)
                ->whereDoesntHave('reviews', function ($query) {
                    $query->whereNotNull('order_id');
                })
                ->with(['products', 'address'])
                ->get();

            $formattedOrders = $orders->map(function ($order) use ($request) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'order_date' => $order->order_date
                        ? $order->order_date->toIso8601String()
                        : now()->toIso8601String(), // Fallback to current timestamp
                    'total_price' => $order->total_price,
                    'status' => $order->status,
                    'products' => $order->products->map(function ($product) use ($request) {
                        return [
                            'id' => $product->id,
                            'name' => [
                                'en' => $product->name_en,
                                'ar' => $product->name_ar,
                            ],
                            'image' => $product->image,
                            'price' => $product->pivot->price,
                            'quantity' => $product->pivot->quantity,
                        ];
                    }),
                    'address' => $order->address ? [
                        'title' => $order->address->title,
                        'city' => $order->address->city,
                        'address_line' => $order->address->address_line,
                    ] : null,
                ];
            });

            return response()->json([
                'data' => $formattedOrders,
                'message' => 'Unrated orders fetched successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to fetch unrated orders', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to fetch unrated orders',
                'message' => 'An unexpected error occurred while fetching unrated orders.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Submit ratings for products in an order.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function submitRatings(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $order = Order::where('id', $id)
                ->where('customer_id', $user->id)
                ->where('status', 'delivered')
                ->firstOrFail();

            $validator = Validator::make($request->all(), [
                'ratings' => 'required|array',
                'ratings.*.product_id' => 'required|integer|exists:products,id',
                'ratings.*.rating' => 'required|integer|min:1|max:5',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check if the order has already been rated
            if ($order->reviews()->exists()) {
                return response()->json([
                    'error' => 'Order already rated',
                    'message' => 'This order has already been rated.',
                ], 400);
            }

            // Validate that all products in the order are rated
            $orderProductIds = $order->products->pluck('id')->toArray();
            $ratedProductIds = collect($request->ratings)->pluck('product_id')->toArray();

            if (array_diff($orderProductIds, $ratedProductIds)) {
                return response()->json([
                    'error' => 'Incomplete ratings',
                    'message' => 'All products in the order must be rated.',
                ], 400);
            }

            foreach ($request->ratings as $rating) {
                Review::create([
                    'product_id' => $rating['product_id'],
                    'order_id' => $order->id,
                    'customer_id' => $user->id,
                    'rating' => $rating['rating'],
                ]);
            }

            return response()->json([
                'message' => 'Ratings submitted successfully',
            ], 201);
        } catch (Exception $e) {
            Log::error('Failed to submit ratings', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'request' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to submit ratings',
                'message' => 'An unexpected error occurred while submitting ratings.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Skip rating for an order.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function skipRating($id): JsonResponse
    {
        try {
            $user = Auth::user();
            $order = Order::where('id', $id)
                ->where('customer_id', $user->id)
                ->where('status', 'delivered')
                ->firstOrFail();

            if ($order->skipped_rating) {
                return response()->json([
                    'error' => 'Rating already skipped',
                    'message' => 'This order has already been skipped for rating.',
                ], 400);
            }

            if ($order->reviews()->exists()) {
                return response()->json([
                    'error' => 'Order already rated',
                    'message' => 'This order has already been rated and cannot be skipped.',
                ], 400);
            }

            $order->skipped_rating = true;
            $order->save();

            return response()->json([
                'message' => 'Rating skipped successfully',
            ]);
        } catch (Exception $e) {
            Log::error('Failed to skip rating', [
                'order_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to skip rating',
                'message' => 'An unexpected error occurred while skipping the rating.',
                'details' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
