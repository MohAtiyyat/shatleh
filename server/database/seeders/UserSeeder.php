<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Create Admin User
         $admin = User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone_number' => '1234567890',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'America/New_York',
            'is_banned' => false,
            'bio' => 'Admin user for shop management',
            'address_id' => 1,
        ]);
        $admin->assignRole('Admin');

        // Create Manager User
        $expert = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'expert@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone_number' => '0987654321',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'America/New_York',
            'is_banned' => false,
            'bio' => 'Manager for shop operations',
            'address_id' => 2,
        ]);
        $expert->assignRole('expert');

        // Create Employee Users
        $employees = [
            [
                'first_name' => 'Alice',
                'last_name' => 'Johnson',
                'email' => 'alice@example.com',
                'phone_number' => '1112223333',
            ],
            [
                'first_name' => 'Bob',
                'last_name' => 'Williams',
                'email' => 'bob@example.com',
                'phone_number' => '4445556666',
            ],
        ];

        foreach ($employees as $emp) {
            $user = User::create([
                'first_name' => $emp['first_name'],
                'last_name' => $emp['last_name'],
                'email' => $emp['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone_number' => $emp['phone_number'],
                'language' => 'en',
                'ip_country_id' => 1,
                'time_zone' => 'America/New_York',
                'is_banned' => false,
                'bio' => 'Employee for shop tasks',
                'address_id' => 3,
            ]);
            $user->assignRole('Employee');
        }

        // Create Customer User
        $customer = User::create([
            'first_name' => 'Emma',
            'last_name' => 'Brown',
            'email' => 'customer@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone_number' => '7778889999',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'America/New_York',
            'is_banned' => false,
            'bio' => 'Regular customer',
            'address_id' => 5,
        ]);
        $customer->assignRole('Customer');
   }
}
