<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Fetch the user with the 'Customer' role (from UserSeeder)
        // $customerUser = User::where('email', 'customer@example.com')->first();

        // Create a customer entry for the customer user
        // if ($customerUser) {
            Customer::create([
                'user_id' => 5,
                'balance' => $faker->numberBetween(10000, 100000), // Balance in cents (e.g., $100.00 to $1000.00)
                'payment_info_id' => null, // No payment info for now
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        // }

        // Create additional customer entries (some without user_id to simulate standalone customers)
        // $additionalCustomers = [
        //     [
        //         'user_id' => null, // No associated user
        //         'balance' => $faker->numberBetween(5000, 50000), // $50.00 to $500.00
        //         'payment_info_id' => null,
        //     ],
        //     [
        //         'user_id' => null, // No associated user
        //         'balance' => $faker->numberBetween(20000, 200000), // $200.00 to $2000.00
        //         'payment_info_id' => null,
        //     ],
        // ];

        // foreach ($additionalCustomers as $customerData) {
        //     Customer::create([
        //         'user_id' => $customerData['user_id'],
        //         'balance' => $customerData['balance'],
        //         'payment_info_id' => $customerData['payment_info_id'],
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ]);
        // }
    }
}