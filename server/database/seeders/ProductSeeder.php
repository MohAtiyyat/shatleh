<?php

namespace Database\Seeders;

use App\Models\Product;
use Carbon\Carbon;
use Faker\Factory as Faker;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Define agriculture-related data
        $names_en = [
            'Tractor', 'Irrigation System', 'Seed Planter', 'Fertilizer Spreader', 
            'Harvesting Machine', 'Greenhouse Kit', 'Pesticide Sprayer'
        ];
        $names_ar = [
            'جرار', 'نظام ري', 'آلة زراعة البذور', 'موزع الأسمدة', 
            'آلة حصاد', 'مجموعة دفيئة', 'رذاذ المبيدات'
        ];
        $descriptions_en = [
            'A durable tractor with advanced features for large farms.',
            'Efficient irrigation system for optimal water distribution.',
            'High-precision seed planter for various crops.',
            'Reliable fertilizer spreader for even application.',
            'Automated harvesting machine for quick operations.',
            'Complete greenhouse kit for year-round farming.',
            'Effective pesticide sprayer for crop protection.'
        ];
        $descriptions_ar = [
            'جرار متين بميزات متقدمة للمزارع الكبيرة.',
            'نظام ري فعال لتوزيع المياه بكفاءة.',
            'آلة زراعة بذور عالية الدقة لمحاصيل متنوعة.',
            'موزع أسمدة موثوق لتوزيع متساوٍ.',
            'آلة حصاد أوتوماتيكية لعمليات سريعة.',
            'مجموعة دفيئة كاملة للزراعة على مدار العام.',
            'رذاذ مبيدات فعال لحماية المحاصيل.'
        ];
        $images = [
            'images/tractor.jpg', 'images/irrigation.jpg', 'images/planter.jpg',
            'images/spreader.jpg', 'images/harvester.jpg', 'images/greenhouse.jpg',
            'images/sprayer.jpg'
        ];

        // Create 15 example products
        for ($i = 0; $i < 15; $i++) {
            $index = $faker->numberBetween(0, count($names_en) - 1);
            Product::create([
                'name_en' => $names_en[$index],
                'name_ar' => $names_ar[$index],
                'price' => $faker->numberBetween(50000, 500000), // Price in cents (e.g., $500.00 to $5000.00)
                'image' => json_encode([$images[$index]]), // Store as JSON array
                'description_en' => $descriptions_en[$index],
                'description_ar' => $descriptions_ar[$index],
                'status' => $faker->randomElement(['active', 'inactive']),
                'availability' => $faker->numberBetween(0, 100), // Stock quantity
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
