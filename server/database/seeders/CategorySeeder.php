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
       $categories = array(
                        array('id' => '4','name_en' => 'qevvqv','name_ar' => 'aev','image' => NULL,'description_en' => 'aev','description_ar' => 'aev','created_at' => '2025-06-10 17:44:15','updated_at' => '2025-06-10 17:44:15','parent_id' => '1'),
                        array('id' => '6','name_en' => 'Seeds','name_ar' => 'بذور','image' => NULL,'description_en' => 'A variety of seeds for vegetables, herbs, and plants, suitable for home gardening and farming.','description_ar' => '.مجموعة متنوعة من البذور للخضروات والأعشاب والنباتات، مناسبة للزراعة المنزلية والمزارع','created_at' => '2025-06-12 22:29:01','updated_at' => '2025-06-12 22:29:01','parent_id' => NULL),
                        array('id' => '7','name_en' => 'Plants','name_ar' => 'نباتات','image' => NULL,'description_en' => 'Live plants including fruit trees, medicinal herbs, and ornamental greenery.','description_ar' => '.نباتات حية تشمل أشجارًا مثمرة وأعشابًا طبية ونباتات زينة','created_at' => '2025-06-12 22:32:38','updated_at' => '2025-06-12 22:32:38','parent_id' => NULL),
                        array('id' => '8','name_en' => 'Pesticides','name_ar' => 'مبيدات','image' => NULL,'description_en' => 'Organic and chemical solutions for pest, insect, and fungal control.','description_ar' => '.حلول عضوية وكيميائية لمكافحة الآفات والحشرات والفطريات','created_at' => '2025-06-12 22:33:44','updated_at' => '2025-06-12 22:33:44','parent_id' => NULL),
                        array('id' => '9','name_en' => 'Fertilizers','name_ar' => 'أسمدة','image' => NULL,'description_en' => 'Nutrient-rich fertilizers to support healthy plant growth and soil enrichment.','description_ar' => '.أسمدة غنية بالعناصر الغذائية لدعم نمو النباتات وتحسين خصوبة التربة','created_at' => '2025-06-12 22:34:35','updated_at' => '2025-06-12 22:38:00','parent_id' => NULL),
                        array('id' => '10','name_en' => 'Agricultural Equipment','name_ar' => 'مستلزمات زراعية','image' => NULL,'description_en' => 'Tools and devices that assist with gardening, planting, irrigation, and maintenance.','description_ar' => '.أدوات وأجهزة تساعد في الزراعة، الري، والصيانة','created_at' => '2025-06-12 22:37:45','updated_at' => '2025-06-12 22:37:45','parent_id' => NULL),
                        array('id' => '11','name_en' => 'Vegetable Seeds','name_ar' => 'بذور خضروات','image' => NULL,'description_en' => 'Seeds for growing common vegetables like tomatoes, cucumbers, and peppers.','description_ar' => '.بذور لزراعة الخضروات الشائعة مثل الطماطم والخيار والفلفل','created_at' => '2025-06-12 22:42:24','updated_at' => '2025-06-12 22:42:24','parent_id' => '6'),
                        array('id' => '12','name_en' => 'Leafy Vegetables','name_ar' => 'خضروات ورقية','image' => NULL,'description_en' => 'Seeds for leafy greens such as lettuce, spinach, and arugula.','description_ar' => '.بذور للخضروات الورقية مثل الخس والسبانخ والجرجير','created_at' => '2025-06-12 22:44:32','updated_at' => '2025-06-12 22:44:32','parent_id' => '6'),
                        array('id' => '13','name_en' => 'Herb Seeds','name_ar' => 'بذور أعشاب','image' => NULL,'description_en' => 'Seeds for herbs like basil, mint, and thyme for cooking or health.','description_ar' => '.بذور أعشاب مثل الريحان والنعناع والزعتر للطهي أو الفوائد الصحية','created_at' => '2025-06-12 22:45:37','updated_at' => '2025-06-12 22:45:37','parent_id' => '6'),
                        array('id' => '14','name_en' => 'Fruit Trees','name_ar' => 'أشجار مثمرة','image' => NULL,'description_en' => 'Seedlings of trees that produce edible fruits like olives, citrus, and pomegranates.','description_ar' => '.شتلات لأشجار مثمرة مثل الزيتون والحمضيات والرمان','created_at' => '2025-06-12 22:47:21','updated_at' => '2025-06-12 22:47:21','parent_id' => '7'),
                        array('id' => '15','name_en' => 'Medicinal Plants','name_ar' => 'نباتات طبية','image' => NULL,'description_en' => 'Plants known for their natural healing and health benefits.','description_ar' => '.نباتات معروفة بخصائصها العلاجية وفوائدها الصحية','created_at' => '2025-06-12 22:49:54','updated_at' => '2025-06-12 22:49:54','parent_id' => '7'),
                        array('id' => '16','name_en' => 'Ornamental Plants','name_ar' => 'نباتات زينة','image' => NULL,'description_en' => 'Decorative plants used to beautify homes, gardens, and offices.','description_ar' => '.نباتات تستخدم للزينة لتجميل المنازل والحدائق والمكاتب','created_at' => '2025-06-12 22:51:24','updated_at' => '2025-06-12 22:51:24','parent_id' => '7'),
                        array('id' => '17','name_en' => 'Insect Control','name_ar' => 'مكافحة الحشرات','image' => NULL,'description_en' => 'Products used to eliminate or repel harmful insects from plants.','description_ar' => '.منتجات تستخدم للقضاء على الحشرات الضارة أو طردها من النباتات','created_at' => '2025-06-12 22:52:12','updated_at' => '2025-06-12 22:52:12','parent_id' => '8'),
                        array('id' => '18','name_en' => 'Fungal Control','name_ar' => 'مكافحة الفطريات','image' => NULL,'description_en' => 'Sprays and treatments to prevent and treat fungal diseases in crops.','description_ar' => '.بخاخات ومعالجات لمنع وعلاج الأمراض الفطرية في المحاصيل','created_at' => '2025-06-12 22:53:34','updated_at' => '2025-06-12 22:53:34','parent_id' => '8'),
                        array('id' => '19','name_en' => 'Pest Control','name_ar' => 'مكافحة الآفات','image' => NULL,'description_en' => 'General-purpose solutions to control garden pests like snails and worms.','description_ar' => '.حلول متعددة الاستخدامات لمكافحة الآفات مثل القواقع والديدان','created_at' => '2025-06-12 22:54:47','updated_at' => '2025-06-12 22:54:47','parent_id' => '8'),
                        array('id' => '20','name_en' => 'Organic Fertilizers','name_ar' => 'أسمدة عضوية','image' => NULL,'description_en' => 'Natural fertilizers made from compost, manure, or plant waste.','description_ar' => '.أسمدة طبيعية مصنوعة من السماد العضوي أو بقايا النباتات','created_at' => '2025-06-12 22:55:39','updated_at' => '2025-06-12 22:55:39','parent_id' => '9'),
                        array('id' => '21','name_en' => 'Chemical Fertilizers','name_ar' => 'أسمدة كيميائية','image' => NULL,'description_en' => 'Fertilizers with precise nutrient ratios to boost fast plant growth.','description_ar' => '.أسمدة تحتوي على نسب دقيقة من المغذيات لتعزيز النمو السريع للنباتات','created_at' => '2025-06-12 22:58:03','updated_at' => '2025-06-12 22:58:03','parent_id' => '9'),
                        array('id' => '22','name_en' => 'Liquid Fertilizers','name_ar' => 'أسمدة سائل','image' => NULL,'description_en' => 'Easy-to-use liquid fertilizers absorbed quickly by plants.','description_ar' => '.أسمدة سائلة سهلة الاستخدام وتمتصها النباتات بسرعة','created_at' => '2025-06-12 22:59:19','updated_at' => '2025-06-12 22:59:19','parent_id' => '9'),
                        array('id' => '23','name_en' => 'Gardening Tools','name_ar' => 'أدوات البستنة','image' => NULL,'description_en' => 'Essential tools for planting, digging, and daily garden tasks.','description_ar' => '.أدوات أساسية للزراعة والحفر والمهام اليومية في الحديقة','created_at' => '2025-06-12 23:00:31','updated_at' => '2025-06-12 23:00:31','parent_id' => '10'),
                        array('id' => '24','name_en' => 'Irrigation Tools','name_ar' => 'أدوات الري','image' => NULL,'description_en' => 'Tools and accessories for watering plants efficiently.','description_ar' => '.أدوات وملحقات لري النباتات بكفاءة','created_at' => '2025-06-12 23:01:16','updated_at' => '2025-06-12 23:01:16','parent_id' => '10'),
                        array('id' => '25','name_en' => 'Cutting Tools','name_ar' => 'أدوات القطع','image' => NULL,'description_en' => 'Tools for trimming, pruning, and harvesting plants.','description_ar' => '.أدوات لتقليم النباتات وتشذيبها وجني المحاصيل','created_at' => '2025-06-12 23:02:11','updated_at' => '2025-06-12 23:02:11','parent_id' => '10'),
                        array('id' => '26','name_en' => 'Soil Testers','name_ar' => 'أجهزة اختبار التربة','image' => NULL,'description_en' => 'Devices that test soil pH, moisture, and nutrient levels.','description_ar' => '.أجهزة تقيس حموضة التربة، الرطوبة، ومستويات المغذيات','created_at' => '2025-06-12 23:02:49','updated_at' => '2025-06-12 23:02:49','parent_id' => '10')
                    );


        DB::table('categories')->insert($categories);
    }
}