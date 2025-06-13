<?php

namespace Database\Seeders;

use App\Models\Address;
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
        $this->call(AddressSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(CartsTableSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(OrderDetailSeeder::class);
        $this->call(PostsSeeder::class);
        $this->call(CategorySeeder::class);

    }
}
