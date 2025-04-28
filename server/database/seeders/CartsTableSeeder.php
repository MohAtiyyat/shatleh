<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if customers and products exist
        $customers = Customer::pluck('id')->toArray();
        $products = Product::pluck('id')->toArray();


        // Sample cart data
        $cartData = [
            [
                'customer_id' => $customers[array_rand($customers)],
                'product_id' => $products[array_rand($products)],
                'quantity' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'customer_id' => $customers[array_rand($customers)],
                'product_id' => $products[array_rand($products)],
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'customer_id' => $customers[array_rand($customers)],
                'product_id' => $products[array_rand($products)],
                'quantity' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert cart data, ensuring no duplicate composite keys
        foreach ($cartData as $cart) {
            // Check if the product_id and customer_id combination already exists
            $exists = DB::table('carts')
                ->where('product_id', $cart['product_id'])
                ->where('customer_id', $cart['customer_id'])
                ->exists();

            if (!$exists) {
                DB::table('carts')->insert($cart);
            } else {
                $this->command->info("Skipped duplicate cart entry for customer_id {$cart['customer_id']} and product_id {$cart['product_id']}.");
            }
        }

        $this->command->info('Carts table seeded successfully.');
    }
}
