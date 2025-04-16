<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Product;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // Create a single address
        Address::create([
            'title' => 'Main Address',
            'country_id' => 1,
            'city' => 'New York',
            'address_line' => '123 Main St',
            'user_id' => 1
        ]);

        Product::create([
            'id' => '1',
            'image' => 'https://via.placeholder.com/75',
            'name_en' => 'test',
            'name_ar' => 'test',
            'price' => '0',
            'status' => 'test',
            'availability' => '1',
            'description_en' => 'No description available',
            'description_ar' => 'No description available',
            'updated_at' => '2022-01-01 00:00:00',
        ]);
    }
}
