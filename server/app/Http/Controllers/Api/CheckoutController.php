<?php

namespace App\Http\Controllers\Api;

use App\Enums\LogsTypes;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Coupon;
use App\Traits\HelperTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckoutController extends Controller
{
    use HelperTrait;

    /**
     * Handle the checkout process.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:users,id',
            'address_id' => 'required|exists:addresses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'is_gift' => 'nullable|boolean',
            'gift_first_name' => 'required_if:is_gift,true|string|max:255',
            'gift_last_name' => 'required_if:is_gift,true|string|max:255',
            'gift_phone_number' => 'required_if:is_gift,true|string|max:255',
            'coupon_id' => 'nullable|exists:coupons,id',
            'total' => 'required|numeric|min:0',
            'delivery_cost' => 'required|numeric|min:0',
            'orderCode' => 'required|string|max:255',
            'payment_method' => 'required|in:cash,credit-card', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Determine is_gift value (default to false if not provided)
            $isGift = $request->input('is_gift', false);

            // Create order
            $order = Order::create([
                'order_code' => $request->orderCode,
                'address_id' => $request->address_id,
                'total_price' => $request->total,
                'customer_id' => $request->customer_id,
                'first_name' => $isGift ? $request->gift_first_name : null,
                'last_name' => $isGift ? $request->gift_last_name : null,
                'phone_number' => $isGift ? $request->gift_phone_number : null,
                'is_gift' => $isGift,
                'coupon_id' => $request->coupon_id,
                'status' => "pending", 
                'delivery_cost' => $request->delivery_cost,
                'payment_method' => $request->payment_method, 
            ]);

            // Store order details
            foreach ($request->items as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Decrement coupon quantity if applied
            if ($request->coupon_id) {
                $coupon = Coupon::find($request->coupon_id);
                if ($coupon && $coupon->quantity > 0) {
                    $coupon->decrement('quantity');
                }
            }

            DB::commit();

            $this->logAction(
                $request->customer_id,
                'checkout',
                'Order placed successfully: Order ID ' . $order->id,
                LogsTypes::INFO->value
            );

            return response()->json([
                'data' => [
                    'order_id' => $order->id,
                    'order_code' => $order->order_code,
                    'total' => $order->total_price,
                    'status' => $order->status,
                ],
                'message' => 'Order placed successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logAction(
                $request->customer_id,
                'checkout_error',
                'Failed to place order: ' . $e,
                LogsTypes::ERROR->value
            );
            return response()->json([
                'error' => 'Failed to process checkout',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}