<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CouponController extends Controller
{

    public function index()
    {
        try {
            $coupons = Coupon::where('is_active', true)
                ->where('expire_date', '>=', Carbon::now())
                ->where('quantity', '>', 0)
                ->with('country')
                ->get();

            return response()->json([
                'data' => $coupons->map(function ($coupon) {
                    return [
                        'id' => $coupon->id,
                        'title' => $coupon->title,
                        'code' => $coupon->code,
                        'amount' => $coupon->amount,
                        'expire_date' => $coupon->expire_date,
                        'country_id' => $coupon->country_id,
                        'country_name' => $coupon->country?->name,
                    ];
                }),
                'message' => 'Coupons retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch coupons',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function apply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255',
            'country_id' => 'nullable|integer|exists:countries,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $coupon = Coupon::where('code', $request->code)
                ->where('is_active', true)
                ->where('expire_date', '>=', Carbon::now())
                ->where('quantity', '>', 0)
                ->first();

            if (!$coupon) {
                return response()->json([
                    'error' => 'Invalid or expired coupon',
                ], 404);
            }

            // Check country restriction if applicable
            if ($coupon->country_id && $request->country_id && $coupon->country_id !== $request->country_id) {
                return response()->json([
                    'error' => 'Coupon not valid for the selected country',
                ], 400);
            }

            return response()->json([
                'data' => [
                    'id' => $coupon->id,
                    'title' => $coupon->title,
                    'code' => $coupon->code,
                    'amount' => $coupon->amount,
                    'expire_date' => $coupon->expire_date,
                    'country_id' => $coupon->country_id,
                ],
                'message' => 'Coupon applied successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to apply coupon',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
