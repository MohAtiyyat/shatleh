<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $products = Product::all();

        if ($customers->isEmpty() || $products->isEmpty()) {
            echo "Error: No customers or products found. Please seed the users and products tables first.\n";
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            Cart::create([
                'customer_id' => $customers->random()->id,
                'product_id' => $products->random()->id,
                'quantity' => rand(1, 5),
            ]);
        }
    }
}
