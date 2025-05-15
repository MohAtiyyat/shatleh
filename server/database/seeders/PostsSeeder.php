<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostsSeeder extends Seeder
{
    public function run()
    {
        $posts = [
            [
                'title_en' => 'How to Care for Your Aloe Vera at Home',
                'title_ar' => 'كيف تعتني بنبتة الألوفيرا في بيتك؟',
                'like' => 0,
                'content_en' => "Aloe Vera is one of the most popular houseplants due to its low-maintenance nature and drought tolerance. To grow it successfully, place it in a sunny location such as a south-facing window, and use sandy, well-draining soil. Water only when the soil is completely dry, as overwatering can cause root rot. Aloe Vera is not just decorative—it contains a natural gel used for treating minor burns and soothing skin irritations. You can easily extract this gel at home. Remember to remove withered leaves to maintain its shape and prevent disease.",
                'content_ar' => "الألوفيرا واحدة من أكثر النباتات المنزلية شعبية، فهي لا تحتاج إلى عناية مفرطة وتتحمل الجفاف. لنجاح زراعتها، ضعها في مكان مشمس كعتبة نافذة تواجه الجنوب، واختر تربة رملية جيدة التصريف. قم بريها فقط عند جفاف التربة تمامًا، فالإفراط في الماء قد يؤدي إلى تعفن الجذور. الألوفيرا ليست فقط نباتًا زينياً، بل تحتوي أوراقها على جل طبيعي يستخدم لعلاج الحروق الخفيفة وتهدئة تهيجات البشرة، ويمكن استخراج هذا الجل بسهولة في المنزل. لا تنسَ إزالة الأوراق الذابلة للحفاظ على شكل النبات ومنع انتقال الأمراض.",
                'image' => '/images/posts/AloeVera.jpg',
                'user_id' => 1,
                'category_id' => 1,
                'product_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'Growing Basil in the Kitchen: Easy and Useful',
                'title_ar' => 'زراعة الريحان في المطبخ: سهولة وفائدة',
                'like' => 0,
                'content_en' => "Basil is a fragrant herb that’s easy to grow in the kitchen or on a sunny windowsill. It prefers slightly moist soil but doesn't tolerate waterlogged conditions. As it grows, trim the top leaves to encourage bushier growth. Fresh basil leaves are perfect for salads, pasta, and pizza. Its refreshing scent also improves the ambiance of your space. Basil is an excellent choice for beginner gardeners because it grows quickly and gives rewarding results within a few weeks.",
                'content_ar' => "الريحان من الأعشاب العطرية التي يسهل زراعتها في المطبخ أو على حافة نافذة مشمسة. يفضل تربة رطبة قليلًا، لكنه لا يتحمل التربة الغارقة بالماء. عند نموه، يمكنك قص الأوراق من الأعلى لتشجيع التفرعات الجانبية، مما يجعل النبات أكثر كثافة. أوراق الريحان الطازجة مثالية للسلطات والمعكرونة والبيتزا، كما أن رائحته المنعشة تساهم في تحسين جو المكان. يُعتبر الريحان خيارًا ممتازًا للمبتدئين في الزراعة لأنه سريع النمو ويمنح نتائج مرضية خلال أسابيع قليلة.",
                'image' => '/images/posts/Basil.jpg',
                'user_id' => 1,
                'category_id' => 1,
                'product_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'How to Start Growing Tomato Seeds at Home',
                'title_ar' => 'كيف تبدأ بزراعة بذور الطماطم في البيت؟',
                'like' => 0,
                'content_en' => "Growing tomatoes from seeds is a rewarding experience. Start by filling seedling trays with light, well-draining soil. Plant the seeds 0.5 cm deep and keep the soil moist but not waterlogged. Place the trays in a warm, well-lit area, ideally between 21-27°C. Once seedlings reach 5-7 cm in height, transplant them into larger pots or the garden. Ensure they receive 6-8 hours of direct sunlight daily for healthy growth.",
                'content_ar' => "زراعة الطماطم من البذور تجربة ممتعة ومجزية. ابدأ باستخدام صواني شتلات مملوءة بتربة خفيفة ومخصصة للزراعة. ازرع البذور على عمق 0.5 سم واحتفظ بالرطوبة دون إغراق. ضع الصواني في مكان دافئ ومضيء، ويفضل أن تكون درجة الحرارة بين 21-27 درجة مئوية. بعد ظهور الشتلات ونموها إلى 5-7 سم، قم بنقلها إلى أوعية أكبر أو إلى الحديقة. تأكد من تعريض النباتات لأشعة الشمس المباشرة لمدة 6-8 ساعات يوميًا للحصول على نمو صحي.",
                'image' => '/images/posts/Tomato.webp',
                'user_id' => 1,
                'category_id' => 2,
                'product_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'When and How Much to Water Indoor Plants?',
                'title_ar' => 'متى وكم تسقي النباتات الداخلية؟',
                'like' => 0,
                'content_en' => "Watering indoor plants depends on the plant type, pot size, and surrounding environment. Generally, check the soil by inserting your finger 2-3 cm deep; if it's dry, it's time to water. Plants like aloe vera and rosemary prefer the soil to dry out between waterings, while basil requires consistently moist soil. Use room-temperature water and avoid wetting the leaves to reduce the risk of fungal diseases. Regular and balanced watering ensures plant health and growth.",
                'content_ar' => "ري النباتات الداخلية يعتمد على نوع النبات، حجم الوعاء، والبيئة المحيطة. كقاعدة عامة، افحص التربة بإدخال إصبعك حتى عمق 2-3 سم؛ إذا كانت جافة، فقد حان وقت الري. النباتات مثل الألوفيرا وإكليل الجبل تفضل التربة الجافة بين الريات، بينما الريحان يحتاج إلى تربة رطبة باستمرار. استخدم مياه بدرجة حرارة الغرفة وتجنب رش الأوراق لتقليل خطر الأمراض الفطرية. الري المنتظم والمتوازن يضمن صحة ونمو النباتات.",
                'image' => '/images/posts/WaterIndoorPlants.webp',
                'user_id' => 1,
                'category_id' => 1,
                'product_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'What is NPK 20-20-20 Fertilizer and When to Use It?',
                'title_ar' => 'ما هو السماد المتوازن 20-20-20 ومتى يُستخدم؟',
                'like' => 0,
                'content_en' => "The balanced 20-20-20 fertilizer contains equal parts of nitrogen, phosphorus, and potassium, essential nutrients for plant growth. It's used to enhance overall growth, improve flowering, and increase fruit production. Ideal during active growth phases, such as early spring. Dissolve the recommended amount in water and apply to the soil every two weeks. Ensure to follow instructions to avoid over-fertilization.",
                'content_ar' => "السماد المتوازن 20-20-20 يحتوي على نسب متساوية من النيتروجين، الفوسفور، والبوتاسيوم، وهي عناصر أساسية لنمو النباتات. يُستخدم هذا السماد لتعزيز النمو العام، تحسين الإزهار، وزيادة إنتاج الثمار. يُفضل استخدامه خلال مراحل النمو النشط، مثل بداية الربيع. قم بإذابة الكمية الموصى بها في الماء وطبقها على التربة كل أسبوعين. تأكد من اتباع التعليمات لتجنب الإفراط في التسميد.",
                'image' => '/images/posts/NPK.jpg',
                'user_id' => 1,
                'category_id' => 3,
                'product_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'Drip Irrigation Basics: Is It Right for Your Garden?',
                'title_ar' => 'أساسيات الري بالتنقيط: هل يناسب حديقتك؟',
                'like' => 0,
                'content_en' => "Drip irrigation delivers water directly to plant roots, reducing evaporation and waste. It's ideal for home gardens, greenhouses, and areas with limited water resources. Installation is relatively simple, requiring a main hose, sub-tubing, and drip emitters. This system helps maintain soil moisture, reduces weed growth, and improves overall plant health.",
                'content_ar' => "الري بالتنقيط هو نظام يوفر الماء مباشرة إلى جذور النباتات، مما يقلل من التبخر والهدر. يُعتبر مثاليًا للحدائق المنزلية، البيوت المحمية، والمناطق ذات الموارد المائية المحدودة. تركيب النظام بسيط نسبيًا ويتطلب خرطوم رئيسي، أنابيب فرعية، ونقاط تنقيط. هذا النظام يساعد في الحفاظ على رطوبة التربة، يقلل من نمو الأعشاب الضارة، ويحسن من صحة النباتات بشكل عام.",
                'image' => '/images/posts/DripIrrigation.jpg',
                'user_id' => 1,
                'category_id' => 4,
                'product_id' => 5, 
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'Why You Should Grow Rosemary in Your Garden',
                'title_ar' => 'لماذا تختار نبتة إكليل الجبل لحديقتك؟',
                'like' => 0,
                'content_en' => "Rosemary is an aromatic evergreen plant used in cooking and known for its pleasant scent. It thrives in dry soil and withstands harsh climatic conditions. Besides its culinary uses, it acts as a natural insect repellent and adds aesthetic appeal to gardens. Requires a sunny spot and well-drained soil.",
                'content_ar' => "إكليل الجبل نبتة عطرية دائمة الخضرة، تُستخدم في الطهي وتتميز برائحتها الزكية. تنمو بشكل جيد في التربة الجافة وتتحمل الظروف المناخية القاسية. بالإضافة إلى استخدامها في المطبخ، تعمل كطارد طبيعي للحشرات وتضيف لمسة جمالية للحديقة. تحتاج إلى مكان مشمس وتربة جيدة التصريف.",
                'image' => '/images/posts/Rosemary.jpg',
                'user_id' => 1,
                'category_id' => 1,
                'product_id' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title_en' => 'Seedling Trays: A Smart Way to Start Planting',
                'title_ar' => 'صواني الشتلات: طريقة ذكية لبدء زراعتك',
                'like' => 0,
                'content_en' => "Seedling trays are used to germinate seeds in a controlled environment before transplanting them into the soil. These trays offer better control over watering, lighting, and temperature, increasing the chances of successful germination. They also make it easier to transplant seedlings without damaging the roots. It's recommended to use light, specialized soil within these trays.",
                'content_ar' => "صواني الشتلات تُستخدم لزراعة البذور في بيئة محكمة قبل نقلها إلى التربة. توفر هذه الصواني تحكمًا أفضل في الري، الإضاءة، ودرجة الحرارة، مما يزيد من فرص نجاح الإنبات. كما تسهل عملية نقل الشتلات دون إتلاف الجذور. يُفضل استخدام تربة خفيفة ومخصصة للزراعة داخل هذه الصواني.",
                'image' => '/images/posts/SeedlingTrays.png',
                'user_id' => 1,
                'category_id' => 4,
                'product_id' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('posts')->insert($posts);
    }
}