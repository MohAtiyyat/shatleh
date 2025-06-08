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
    categories: [
      { id: 1, name_en: 'Electronics', name_ar: 'إلكترونيات', parent_id: null },
      { id: 2, name_en: 'Mobile Phones', name_ar: 'هواتف محمولة', parent_id: 1 },
    ],
    rating: 4.5,
  },
  // Add more mock products as needed
];