<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch existing orders
        $orders = Order::all();

        // Check if orders exist
        if ($orders->isEmpty()) {
            echo "Error: No orders found. Please seed the orders table first.\n";
            return;
        }

        foreach ($orders as $order) {
            // Get the customer's cart items
            $cartItems = Cart::where('customer_id', $order->customer_id)->get();

            if ($cartItems->isEmpty()) {
                echo "Warning: No cart items found for customer ID {$order->customer_id}. Skipping order ID {$order->id}.\n";
                continue;
            }

            // Prepare data for syncWithoutDetaching
            $productsToSync = [];
            foreach ($cartItems as $cartItem) {
                $product = Product::find($cartItem->product_id);

                if (!$product) {
                    echo "Warning: Product ID {$cartItem->product_id} not found for cart item. Skipping.\n";
                    continue;
                }

                // If the product is already in productsToSync, add to the quantity
                if (isset($productsToSync[$cartItem->product_id])) {
                    $productsToSync[$cartItem->product_id]['quantity'] += $cartItem->quantity;
                } else {
                    $productsToSync[$cartItem->product_id] = [
                        'price' => $product->price,
                        'quantity' => $cartItem->quantity,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->updated_at,
                    ];
                }
            }

            // Sync products to the order without detaching existing ones
            $order->products()->syncWithoutDetaching($productsToSync);
        }

        // Update total_price for each order based on order_details
        foreach ($orders as $order) {
            $total = $order->products()
                           ->selectRaw('SUM(order_details.price * order_details.quantity) as total')
                           ->value('total');
            $order->update([
                'total_price' => $total + $order->delivery_cost,
            ]);
        }
    }
}
