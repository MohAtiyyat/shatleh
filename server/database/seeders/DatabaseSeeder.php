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
        $this->call(ProductSeeder::class);
        $this->call(CartSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(OrderDetailSeeder::class);
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

        }

    }
}