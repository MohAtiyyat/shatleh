import { Product } from './index';

export const mockProducts: Product[] = [
  {
    id: 1,
    name_en: 'Sample Product',
    name_ar: 'منتج عينة',
    price: '19.99',
    image: '/images/sample.jpg',
    description_en: 'A sample product description',
    description_ar: 'وصف منتج عينة',
    availability: true,
    sold_quantity: 20,
    category_id: 1,
    category_en: 'seeds',
    category_ar: 'بذور',
    rating: 4.5,
  },
  // Add more mock products as needed
];