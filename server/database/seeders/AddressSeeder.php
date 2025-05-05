<?php

namespace Database\Seeders;

use App\Models\Address;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Define possible values for dynamic fields
        $titles = ['Primary Address', 'Secondary Address', 'Work Address', 'Home Address'];
        $cities = ['Amman', 'Zarqa', 'Irbid', 'Aqaba'];

        // Create 10 example addresses
        for ($i = 0; $i < 10; $i++) {
            Address::create([
                'title' => $faker->randomElement($titles),
                'country_id' => 1,
                'city' => $faker->randomElement($cities),
                'address_line' => $faker->streetAddress,
                'user_id' => $faker->optional(0.7)->numberBetween(1, 5), // 70% chance of having a user_id, null otherwise
            ]);
        }
    }
}