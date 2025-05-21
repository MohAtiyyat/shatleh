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

        $this->call(CountrySeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CustomerSeeder::class);
        $this->call(AddressSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(CartsTableSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(OrderDetailSeeder::class);
        $this->call(PostsSeeder::class);

        for ($i = 1; $i <= 2; $i++) {
            DB::table('categories')->insert([
                [

                    'name_en' => 'test',
                    'name_ar' => 'اختبار',
                    'image' => 'test.jpg',
                    'description_ar' => 'test',
                    'description_en' => 'test',
                    'created_at' => now(),
                    'updated_at' => now(),
                    'parent_id' => null,
                ]
            ]);

        };
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
