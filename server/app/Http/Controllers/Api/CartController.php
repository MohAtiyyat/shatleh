<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Fetch the user's cart items.
     */
    public function index(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
        ]);

        $customerId = $request->input('customer_id');

        // Ensure the authenticated user matches the requested customer_id
        if (Auth::id() != $customerId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItems = Cart::where('customer_id', $customerId)
            ->with('product')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($cart) {
                return [
                    'id' => $cart->id,
                    'customer_id' => $cart->customer_id,
                    'product_id' => $cart->product_id,
                    'name_en' => $cart->product->name_en ?? $cart->product->name,
                    'name_ar' => $cart->product->name_ar ?? $cart->product->name,
                    'description_en' => $cart->product->description_en ?? $cart->product->description,
                    'description_ar' => $cart->product->description_ar ?? $cart->product->description,
                    'price' => (string) $cart->product->price,
                    'image' => $cart->product->image,
                    'quantity' => $cart->quantity,
                ];
            });

        return response()->json(['data' => $cartItems], 200);
    }

    /**
     * Update or add a cart item.
     */
    public function update(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $customerId = $request->input('customer_id');
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        // Ensure the authenticated user matches the requested customer_id
        if (Auth::id() != $customerId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = Cart::where('customer_id', $customerId)
            ->where('product_id', $productId)
            ->first();

        if ($quantity <= 0) {
            // Delete the cart item if quantity is 0
            if ($cart) {
                $cart->delete();
            }
            return response()->json(['message' => 'Cart item removed'], 200);
        }

        if ($cart) {
            // Update existing cart item
            $cart->quantity = $quantity;
            $cart->save();
        } else {
            // Create new cart item
            Cart::create([
                'customer_id' => $customerId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return response()->json(['message' => 'Cart updated successfully'], 200);
    }

    /**
     * Clear the user's cart (hard delete).
     */
    public function clear(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
        ]);

        $customerId = $request->input('customer_id');

        // Ensure the authenticated user matches the requested customer_id
        if (Auth::id() != $customerId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hard delete all cart items for the user
        Cart::where('customer_id', $customerId)->delete();

        return response()->json(['message' => 'Cart cleared successfully'], 200);
    }
}