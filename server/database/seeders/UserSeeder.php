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
            'first_name' => 'Shatleh',
            'last_name' => 'Admin',
            'email' => 'admin@shatleh.shop',
            'email_verified_at' => now(),
            'password' => Hash::make('Admin123'),
            'phone_number' => '1234567890',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'Asia/Amman',
            'is_banned' => false,
            'bio' => 'Admin user for shop management',
            'address_id' => 1,
        ]);
        $admin->assignRole('Admin');

        $expert = User::create([
            'first_name' => 'Mohammad',
            'last_name' => 'Atiyyat',
            'email' => 'mohalatiyyat@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('Mohammad123'),
            'phone_number' => '00962798214834',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'Asia/Amman',
            'is_banned' => false,
            'bio' => 'Argicultural expert',
            'address_id' => 2,
        ]);
        $expert->assignRole('expert');


            $user = User::create([
                'first_name' => 'Mohammad',
                'last_name' => 'Ariqat',
                'email' => 'moh.ariqat@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('Ariqat123'),
                'phone_number' => '009620779968785',
                'language' => 'en',
                'ip_country_id' => 1,
                'time_zone' => 'Asia/Amman',
                'is_banned' => false,
                'bio' => 'Employee for shop tasks',
                'address_id' => 3,
            ]);
            $user->assignRole('Employee');

        $customer = User::create([
            'first_name' => 'Hussam',
            'last_name' => 'AlKhateeb',
            'email' => 'hussamkhaledb@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('Hussam123'),
            'phone_number' => '00962798827244',
            'language' => 'en',
            'ip_country_id' => 1,
            'time_zone' => 'Asia/Amman',
            'is_banned' => false,
            'bio' => 'Regular customer',
            'address_id' => 5,
        ]);
        $customer->assignRole('Customer');
   }
}
