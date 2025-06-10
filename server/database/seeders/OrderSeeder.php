<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch customers (all users) and employees (users with Expert or Employee roles)
        
        $customers =  User::with('roles', 'addresses')->get()->filter(
                fn ($user) => $user->roles->contains(fn ($role) =>$role->name === 'Customer'));;
        $employees = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['Expert', 'Employee']);
        })->get();

        // Check if customers and employees exist
        if ($customers->isEmpty() || $employees->isEmpty()) {
            echo "Error: No customers or employees found. Please seed the users table first.\n";
            return;
        }

        // Create 5 order records
        for ($i = 1; $i <= 5; $i++) {
            $customer = $customers->random();
            $employee = $employees->random();
            $isDelivered = rand(0, 1); // Randomly decide if the order is delivered

            Order::create([
                'order_code' => 'ORD-' . str_pad($i, 3, '0', STR_PAD_LEFT), // e.g., ORD-001
                'total_price' => rand(5000, 200000), // Random price between 50.00 and 2000.00 (in cents)
                'customer_id' => $customer->id,
                'first_name' => $customer->first_name,
                'last_name' => $customer->last_name,
                'phone_number' => $customer->phone_number,
                'is_gift' => rand(0, 1), // Randomly set as gift (0 or 1)
                'employee_id' => $employee->id,
                'address_id' => rand(1, 5), // Placeholder: Assumes addresses with IDs 1-5 exist
                'coupon_id' => rand(1, 5), // Placeholder: Assumes coupons with IDs 1-5 exist
                'status' => $isDelivered ? 'completed' : (rand(0, 1) ? 'pending' : 'shipped'),
                'delivery_cost' => rand(500, 2000), // Random delivery cost between 5.00 and 20.00 (in cents)
                'delivered_at' => $isDelivered ? Carbon::now()->subDays(rand(1, 10)) : null,
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
                'updated_at' => Carbon::now(),
            ]);
        }

    }
}
