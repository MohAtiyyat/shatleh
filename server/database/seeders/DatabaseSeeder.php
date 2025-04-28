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

        // DB::table('model_has_roles')->insert([
        //     [
        //         'role_id'    => 7,
        //         'model_type' => 'App\Models\User',
        //         'model_id'   => 2,
        //     ],
        //     [
        //         'role_id'    => 7,
        //         'model_type' => 'App\Models\User',
        //         'model_id'   => 1,
        //     ]
        // ]);
         // Seed Service Requests
         ServiceRequest::query()->delete();
         $serviceRequests = [];
         $customers = Customer::all();


         $services = Service::pluck('id')->toArray();
         $statuses = ['pending', 'assigned', 'in_progress', 'completed'];

         $faker = \Faker\Factory::create();
         for ($i = 0; $i < 15; $i++) {
             $customer = $customers->random();
             $serviceRequests[] = [
                 'service_id' => $faker->randomElement($services),
                 'address_id' => 5,
                 'details' => $faker->randomElement([
                     'Need tractor repair for John Deere model.',
                     'Request soil testing for wheat field.',
                     'Consultation needed for pest control.',
                     'Install drip irrigation system.',
                     'Repair combine harvester.',
                 ]),
                 'image' => 'images/service_' . $faker->numberBetween(1, 5) . '.jpg',
                 'customer_id' => $customer->id,
                 'employee_id' => null,
                 'expert_id' =>  null,
                 'status' => $faker->randomElement($statuses),
                 'created_at' => now(),
                 'updated_at' => now(),
             ];
         }
         DB::table('service_requests')->insert($serviceRequests);
    }
}
