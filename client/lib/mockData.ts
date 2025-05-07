// lib/mockData.ts
import type { Product } from './index';

export const mockProducts: Product[] = Array.from({ length: 20 }, (_, i): Product => ({
    id: i + 1,
    name_en: 'Calathea Plant',
    name_ar: 'نبات كالاثيا',
    price: 4.50,
    image:
        'https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    description_en: 'Beautiful calathea plant for indoor decoration.',
    description_ar: 'نبات كالاثيا جميل للزينة الداخلية.',
    availability: i % 3 !== 0,
    sold_quantity: 23,
    category_en:
        i % 4 === 0 ? 'Seeds' : i % 4 === 1 ? 'Home Plants' : i % 4 === 2 ? 'Fruit Plants' : 'Supplies',
    category_ar:
        i % 4 === 0 ? 'بذور' : i % 4 === 1 ? 'نباتات منزلية' : i % 4 === 2 ? 'نباتات مثمرة' : 'مستلزمات',
    rating: 5,
}));