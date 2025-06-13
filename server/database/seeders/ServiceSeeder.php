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
                'name_en' => 'Tree and Plant Care',
                'name_ar' => 'العناية بالأشجار والنباتات',
                'image' => '/storage/images/service/TreeandPlantCare.jpg',
                'description_en' => 'Full care services for trees and plants to help them grow healthy and beautiful.',
                'description_ar' => 'خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.',
                'status' => 'Active',
                'deleted_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Agricultural Consultations',
                'name_ar' => 'الاستشارات الزراعية',
                'image' => '/storage/images/service/AgriculturalConsultations.jpg',
                'description_en' => 'Expert advice from agricultural engineers to improve plant care.',
                'description_ar' => 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
                'status' => 'Active',
                'deleted_at' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Garden Landscaping',
                'name_ar' => 'تنسيق الحدائق',
                'image' => '/storage/images/service/GardenLandscaping.jpg',
                'description_en' => 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
                'description_ar' => 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
                'status' => 'Active',
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
