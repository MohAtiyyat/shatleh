'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ProductCarousel from './product-carousel';
import { fetchTopProducts } from '../../lib/api'; 
import type { Product, Locale } from '../../lib';

interface TopSellersSectionProps {
    currentLocale: Locale;
}

export default function TopSellersSection({ currentLocale }: TopSellersSectionProps) {
    const t = useTranslations();
    const topSellersRef = useRef(null);
    const topSellersInView = useInView(topSellersRef, { once: true, margin: '-100px' });
    const [products, setProducts] = useState<Product[]>([]);

    const topSellersVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
    };

    const mockData: Product[] = [
        {
            id: 1,
            name_en: 'Basil',
            name_ar: 'ريحان',
            price: 3 ,
            image: '/rayhan.webp',
            description_en: 'Fresh basil plant for culinary use.',
            description_ar: 'نبات ربيحان طازج للاستخدام في الطهي.',
            availability: 1,
            sold_quantity: 0,
            category_en: 'Supplies',
            category_ar: 'مستلزمات',
            rating: 4.5,
        },
        {
            id: 2,
            name_en: 'Lavender',
            name_ar: 'لافندر',
            price: 5,
            image: '/lavander.webp',
            description_en: 'Calming lavender plant for relaxation.',
            description_ar: 'نبات لافندر مهدئ للاسترخاء.',
            availability: 1,
            sold_quantity: 0,
            category_en: 'Supplies',
            category_ar: 'مستلزمات',
            rating: 4.5,
        },
        {
            id: 3,
            name_en: 'Carpet',
            name_ar: 'سجادة',
            price: 3.5 ,
            image: '/sjadeh.webp',
            description_en: 'Decorative carpet plant for gardens.',
            description_ar: 'نبات سجادة زخرفي للحدائق.',
            availability: 1,
            sold_quantity: 0,
            category_en: 'Supplies',
            category_ar: 'مستلزمات',
            rating: 4.5,
        },
        {
            id: 4,
            name_en: 'Damask Rose',
            name_ar: 'ورد دمشقي',
            price:5 ,
            image: '/jori.jpg',
            description_en: 'Fragrant damask rose for beauty.',
            description_ar: 'ورد دمشقي عطري للجمال.',
            availability: 1,
            sold_quantity: 0,
            category_en: 'Supplies',
            category_ar: 'مستلزمات',
            rating: 4.7,
        },
        {
            id: 5,
            name_en: 'Mint',
            name_ar: 'نعناع',
            price: 1.5 ,
            image: '/na3nah.jpg',
            description_en: 'Refreshing mint plant for teas.',
            description_ar: 'نبات نعناع منعش للشاي.',
            availability: 1,
            sold_quantity: 0,
            category_en: 'Supplies',
            category_ar: 'مستلزمات',
            rating: 4.3,
        },
    ];

    useEffect(() => {

        const loadProducts = async () => {
            try {
                const topProducts = await fetchTopProducts();
                setProducts(topProducts);
            } catch (err) {
                setProducts(mockData); // Fallback to mock data
                console.error('Error fetching top products:', err);
            }
        };
        loadProducts();
    }, [t]);

    return (
        <motion.section
            ref={topSellersRef}
            className="max-w-6xl mx-auto p-4 section-padding section-full-width rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4 relative"
            initial="initial"
            animate={topSellersInView ? 'animate' : 'initial'}
            variants={topSellersVariants}
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <h2 className="text-center text-4xl font-medium text-[var(--accent-color)] relative drop-shadow-md">
                {t('home.topSellers')}
            </h2>


            <ProductCarousel products={products} currentLocale={currentLocale} pageName="home" />
        </motion.section>
    );
}