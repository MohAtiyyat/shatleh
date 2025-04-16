<?php

namespace Database\Seeders;

use App\Models\Address;
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
    }
}
