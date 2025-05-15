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
            'Aloe Vera Plant', 'Basil Plant', 'Rosemary Plant', '(Hybrid) Tomato Seeds',
            '(Local Variety) Cucumber Seeds', '(Iceberg) Lettuce Seeds', 'NPK 20-20-20 Fertilizer',
            'Potassium Sulfate (SOP)', 'Calcium Nitrate', 'Imidacloprid 35% SC', 'Lambda-Cyhalothrin 5% EC',
            'Deltamethrin 2.5% EC', 'Drip Irrigation Kit', 'Seedling Trays', 'Greenhouse Plastic Cover'
        ];

        $names_ar = [
            'نبتة الألوفيرا', 'نبتة الريحان', 'نبتة إكليل الجبل', 'بذور طماطم هجينة', 'بذور خيار محلي',
            'بذور خس آيسبرغ', 'سماد متوازن 20-20-20', 'كبريتات البوتاسيوم', 'نترات الكالسيوم',
            'إيميداكلوبريد 35% SC', 'لامبدا سايهالوثرين 5% EC', 'دلتا مثرين 2.5% EC',
            'طقم ري بالتنقيط', 'صواني شتلات', 'غطاء بلاستيكي للبيوت المحمية'
        ];

        $descriptions_en = [
            'A medicinal plant used for treating burns and moisturizing the skin; easy to care for and suitable for homes and offices. Price: 5 JOD.',
            'An aromatic plant used in cooking; grows quickly and adds a pleasant fragrance to the area. Price: 3 JOD.',
            'A perennial plant used in cooking and alternative medicine; requires direct sunlight and well-drained soil. Price: 4 JOD.',
            'High-yield, disease-resistant tomato seeds suitable for greenhouse cultivation. Price: 2 JOD.',
            'Cucumber seeds suitable for warm regions, yielding abundant harvests. Price: 1.5 JOD.',
            'Lettuce seeds producing large, crisp heads; ideal for salads. Price: 1.8 JOD.',
            'Balanced fertilizer containing nitrogen, phosphorus, and potassium; promotes overall plant growth. Price: 10 JOD (5 kg).',
            'Fertilizer rich in potassium and sulfur; used to enhance fruit quality and increase plant disease resistance. Price: 12 JOD (5 kg).',
            'Fertilizer containing calcium and nitrogen; used to strengthen root development and improve fruit quality. Price: 9 JOD (5 kg).',
            'A systemic insecticide used to control sucking insects like aphids and whiteflies. Price: 15 JOD (1 L).',
            'An effective insecticide against a wide range of insects; used in various crops. Price: 12 JOD (1 L).',
            'An insecticide used to control flying and crawling insects in agricultural crops. Price: 10 JOD (1 L).',
            'A complete drip irrigation system for water conservation and improved irrigation efficiency in gardens and farms. Price: 25 JOD.',
            'Multi-cell plastic trays for seedling cultivation; aid in organized growth and easy transportation. Price: 2 JOD per piece.',
            'High-quality plastic cover for greenhouses; offers protection from weather elements and enhances growth climate. Price: 30 JOD (10 meters).'
        ];

        $descriptions_ar = [
            'نبتة طبية تُستخدم في علاج الحروق وترطيب البشرة، سهلة العناية وتناسب المنازل والمكاتب. السعر: 5 دنانير أردنية.',
            'نبتة عطرية تُستخدم في الطهي، تنمو بسرعة وتضفي رائحة زكية على المكان. السعر: 3 دنانير أردنية.',
            'نبتة معمرة تُستخدم في الطهي والطب البديل، تحتاج إلى شمس مباشرة وتربة جيدة التصريف. السعر: 4 دنانير أردنية.',
            'بذور طماطم عالية الإنتاجية ومقاومة للأمراض، مناسبة للزراعة في البيوت البلاستيكية. السعر: 2 دينار أردني.',
            'بذور خيار مناسبة للزراعة في المناطق الدافئة، تعطي محصولًا وفيرًا. السعر: 1.5 دينار أردني.',
            'بذور خس تعطي رؤوسًا كبيرة ومقرمشة، مثالية للسلطات. السعر: 1.8 دينار أردني.',
            'سماد متوازن يحتوي على النيتروجين والفوسفور والبوتاسيوم، يعزز نمو النباتات بشكل عام. السعر: 10 دنانير أردنية (5 كغ).',
            'سماد غني بالبوتاسيوم والكبريت، يُستخدم لتحسين جودة الثمار وزيادة مقاومة النباتات للأمراض. السعر: 12 دينار أردني (5 كغ).',
            'سماد يحتوي على الكالسيوم والنيتروجين، يُستخدم لتعزيز نمو الجذور وتحسين جودة الثمار. السعر: 9 دنانير أردنية (5 كغ).',
            'مبيد حشري جهازي يُستخدم لمكافحة الحشرات الماصة مثل المنّ والذبابة البيضاء. السعر: 15 دينار أردني (1 لتر).',
            'مبيد حشري فعال ضد مجموعة واسعة من الحشرات، يُستخدم في المحاصيل المختلفة. السعر: 12 دينار أردني (1 لتر).',
            'مبيد حشري يُستخدم لمكافحة الحشرات الطائرة والزاحفة في المحاصيل الزراعية. السعر: 10 دنانير أردنية (1 لتر).',
            'نظام ري بالتنقيط متكامل لتوفير المياه وتحسين كفاءة الري في الحدائق والمزارع. السعر: 25 دينار أردني.',
            'صواني بلاستيكية متعددة الخلايا لزراعة الشتلات، تساعد في تنظيم النمو وتسهيل النقل. السعر: 2 دينار أردني للقطعة.',
            'غطاء بلاستيكي عالي الجودة للبيوت المحمية، يوفر حماية من العوامل الجوية ويحسن مناخ النمو. السعر: 30 دينار أردني (لكل 10 أمتار).'
        ];
        $prices = [
            5, 3, 4, 2, 1.5, 1.8, 10, 12, 9, 15, 12, 10, 25, 2, 30
        ];

        $images = [
            'images/products/AloeVera.jpg', 'images/products/BasilPlant.jpg', 'images/products/RosemaryPlant.avif',
            'images/products/TomatoSeedsHybrid.webp', 'images/products/CucumberSeeds.webp', 'images/products/LettuceSeeds.webp',
            'images/products/NPK20-20-20Fertilizer.webp', 'images/products/PotassiumSulfateSOP.jpg', 'images/products/CalciumNitrate.webp',
            'images/products/Imidacloprid35%SC.avif', 'images/products/LambdaCyhalothrin5%EC.avif', 'images/products/Deltamethrin2.5%EC.jpg',
            'images/products/DripIrrigationKit.jpg', 'images/products/SeedlingTrays.jpg', 'images/products/GreenhousePlasticCover.jpg'
        ];

        // Create 15 example products
        for ($i = 0; $i < 15; $i++) {
            $index = $faker->numberBetween(0, count($names_en) - 1);
            Product::create([
                'name_en' => $names_en[$index],
                'name_ar' => $names_ar[$index],
                'price' => $prices[$index]*100,
                'image' => json_encode([$images[$index]]),
                'description_en' => $descriptions_en[$index],
                'description_ar' => $descriptions_ar[$index],
                'status' => $faker->randomElement(['active', 'inactive']),
                'availability' => $faker->randomElement([1,0]), 
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
