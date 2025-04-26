<?php

namespace Database\Seeders;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name_en' => 'Laptop',
                'name_ar' => 'لاب توب',
                'price' => 99999, // Stored as integer (e.g., 999.99 * 100 = 99999 if price is in cents)
                'image' => 'images/laptop.jpg',
                'description_en' => 'A high-performance laptop with 16GB RAM and 512GB SSD.',
                'description_ar' => 'لاب توب عالي الأداء بذاكرة 16 جيجابايت وتخزين 512 جيجابايت SSD.',
                'status' => 'active',
                'availability' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Smartphone',
                'name_ar' => 'هاتف ذكي',
                'price' => 49999,
                'image' => 'images/smartphone.jpg',
                'description_en' => 'A latest model smartphone with 128GB storage and 48MP camera.',
                'description_ar' => 'هاتف ذكي حديث بتخزين 128 جيجابايت وكاميرا 48 ميجابكسل.',
                'status' => 'active',
                'availability' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Headphones',
                'name_ar' => 'سماعات رأس',
                'price' => 7999,
                'image' => 'images/headphones.jpg',
                'description_en' => 'Wireless headphones with noise cancellation and 20-hour battery life.',
                'description_ar' => 'سماعات رأس لاسلكية مع خاصية إلغاء الضوضاء وعمر بطارية 20 ساعة.',
                'status' => 'inactive',
                'availability' => 0,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Tablet',
                'name_ar' => 'تابلت',
                'price' => 29999,
                'image' => 'images/tablet.jpg',
                'description_en' => 'A 10-inch tablet with 64GB storage and stylus support.',
                'description_ar' => 'تابلت 10 بوصة بتخزين 64 جيجابايت ودعم للقلم الإلكتروني.',
                'status' => 'active',
                'availability' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name_en' => 'Smartwatch',
                'name_ar' => 'ساعة ذكية',
                'price' => 19999,
                'image' => 'images/smartwatch.jpg',
                'description_en' => 'A smartwatch with heart rate monitoring and fitness tracking.',
                'description_ar' => 'ساعة ذكية مع مراقبة معدل ضربات القلب وتتبع اللياقة البدنية.',
                'status' => 'active',
                'availability' => 0,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
