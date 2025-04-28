<?php

namespace Database\Seeders;

use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $services = [
            [
                'name_en' => 'Consulting',
                'name_ar' => 'استشارات',
                'image' => 'consulting.jpg',
                'description_en' => 'Professional consulting services',
                'description_ar' => 'خدمات استشارية مهنية',
                'status' => 'active',
                'deleted_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Training',
                'name_ar' => 'تدريب',
                'image' => 'training.jpg',
                'description_en' => 'Comprehensive training programs',
                'description_ar' => 'برامج تدريب شاملة',
                'status' => 'active',
                'deleted_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Support',
                'name_ar' => 'دعم',
                'image' => 'support.jpg',
                'description_en' => '24/7 support services',
                'description_ar' => 'خدمات دعم على مدار الساعة',
                'status' => 'inactive',
                'deleted_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
