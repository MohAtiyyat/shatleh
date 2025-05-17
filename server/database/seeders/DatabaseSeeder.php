<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Service;
use App\Models\ServiceRequest;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


        $this->call(ProductSeeder::class);




        DB::table('payment_info')->insert([
            [
                'card_type' => 'visa',
                'card_number' => '1234567890123456',
                'cvv' => '123',
                'card_holder_name' => 'ahmed ali',
                'customer_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'card_type' => 'mastercard',
                'card_number' => '9876543210987654',
                'cvv' => '321',
                'card_holder_name' => 'ali ahmed',
                'customer_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

    }
}
