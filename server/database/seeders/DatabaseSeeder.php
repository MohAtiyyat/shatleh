<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Product;
use Illuminate\Database\Seeder;
use App\Models\User;
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

        // Create a single address
        Address::create([
            'title' => 'Secondry Address',
            'country_id' => 1,
            'city' => 'amman',
            'address_line' => '123 Main St',
            'user_id' => 1
        ]);
         // Create Permissions
         $permissions = [
             'view shops',
             'edit shops',
             'create shops',
             'delete shops',
             'view products',
             'edit products',
             'create products',
             'delete products',
         ];

         foreach ($permissions as $permission) {
             Permission::create(['name' => $permission, 'guard_name' => 'web']);
         }

         // Create Roles and assign permissions
         $adminRole = Role::create(['name' => 'Admin', 'guard_name' => 'web']);
         $adminRole->givePermissionTo(Permission::all());

         $managerRole = Role::create(['name' => 'Manager', 'guard_name' => 'web']);
         $managerRole->givePermissionTo([
             'view shops',
             'edit shops',
             'create shops',
             'view products',
             'edit products',
             'create products',
         ]);

         $employeeRole = Role::create(['name' => 'Employee', 'guard_name' => 'web']);
         $employeeRole->givePermissionTo(['view shops', 'view products']);

         $customerRole = Role::create(['name' => 'Customer', 'guard_name' => 'web']);
         $customerRole->givePermissionTo(['view products']);

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
         $manager = User::create([
             'first_name' => 'Jane',
             'last_name' => 'Smith',
             'email' => 'manager@example.com',
             'email_verified_at' => now(),
             'password' => Hash::make('password'),
             'phone_number' => '0987654321',
             'language' => 'en',
             'ip_country_id' => 1,
             'time_zone' => 'America/New_York',
             'is_banned' => false,
             'bio' => 'Manager for shop operations',
             'address_id' => 1,
         ]);
         $manager->assignRole('Manager');

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
                 'address_id' => 1,
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
             'address_id' => 1,
         ]);
         $customer->assignRole('Customer');
    }
}
