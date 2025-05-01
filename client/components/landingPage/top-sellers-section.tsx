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
    const [error, setError] = useState<string | null>(null);

    const topSellersVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
    };

    const mockData: Product[] = [
        {
            id: 1,
            name: {
                en: 'Basil',
                ar: 'ريحان',
            },
            description: {
                en: 'Fresh basil plant for culinary use.',
                ar: 'نبات ربيحان طازج للاستخدام في الطهي.',
            },
            image: '/rayhan.webp',
            rating: 4.5,
            price: '3 JD',
            inStock: true,
        },
        {
            id: 2,
            name: {
                en: 'Lavender',
                ar: 'لافندر',
            },
            description: {
                en: 'Calming lavender plant for relaxation.',
                ar: 'نبات لافندر مهدئ للاسترخاء.',
            },
            image: '/lavander.webp',
            rating: 4.5,
            price: '5 JD',
            inStock: true,
        },
        {
            id: 3,
            name: {
                en: 'Carpet',
                ar: 'سجادة',
            },
            description: {
                en: 'Decorative carpet plant for gardens.',
                ar: 'نبات سجادة زخرفي للحدائق.',
            },
            image: '/sjadeh.webp',
            rating: 4.5,
            price: '3.5 JD',
            inStock: true,
        },
        {
            id: 4,
            name: {
                en: 'Damask Rose',
                ar: 'ورد دمشقي',
            },
            description: {
                en: 'Fragrant damask rose for beauty.',
                ar: 'ورد دمشقي عطري للجمال.',
            },
            image: '/jori.jpg',
            rating: 4.7,
            price: '5 JD',
            inStock: true,
        },
        {
            id: 5,
            name: {
                en: 'Mint',
                ar: 'نعناع',
            },
            description: {
                en: 'Refreshing mint plant for teas.',
                ar: 'نبات نعناع منعش للشاي.',
            },
            image: '/na3nah.jpg',
            rating: 4.3,
            price: '1.5 JD',
            inStock: true,
        },
    ];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const topProducts = await fetchTopProducts();
                setProducts(topProducts);
            } catch (err) {
                setError(t('errors.fetchFailed'));
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

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <ProductCarousel products={products} currentLocale={currentLocale} pageName="home" />
        </motion.section>
    );
}