<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name_en' => 'Plants',
                'name_ar' => 'النباتات',
                'image' => 'test.jpg',
                'description_ar' => '',
                'description_en' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'parent_id' => null,
            ],
            [
                'name_en' => 'Seeds',
                'name_ar' => 'البذور',
                'image' => 'test.jpg',
                'description_ar' => '',
                'description_en' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'parent_id' => null,
            ],
            [
                'name_en' => 'Fertilizers',
                'name_ar' => 'الأسمدة',
                'image' => 'test.jpg',
                'description_ar' => '',
                'description_en' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'parent_id' => null,
            ],
            [
                'name_en' => 'Pesticides',
                'name_ar' => 'المبيدات الحشرية',
                'image' => 'test.jpg',
                'description_ar' => '',
                'description_en' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'parent_id' => null,
            ],
            [
                'name_en' => 'Agricultural Supplies',
                'name_ar' => 'المستلزمات الزراعية',
                'image' => 'test.jpg',
                'description_ar' => '',
                'description_en' => '',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'parent_id' => null,
            ],
        ];

        DB::table('categories')->insert($categories);
    }
}