<?php

namespace Database\Seeders;

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
        // Create a single test user for login
        User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => bcrypt('password123'),
            'phone_number' => '+1-555-555-5555',
            'language' => 'en',
            'ip_country_id' => 7, // Set to null since countries table is empty
            'time_zone' => 'America/New_York',
            'is_banned' => false,
            'bio' => 'Test user for login functionality.',
            'address_id' => null, // Set to null since addresses table is empty
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
