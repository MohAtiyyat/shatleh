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
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
  };


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const topProducts = await fetchTopProducts();
        setProducts(topProducts);
      } catch (err) {
        console.error('Error fetching top products:', err);
      }
    };
    loadProducts();
  }, [t]);

  return (
    <motion.section
      ref={topSellersRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-10 rounded-3xl bg-gradient-to-tr from-[var(--primary-bg)] to-[rgba(34,139,34,0.15)] border border-[rgba(34,139,34,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={topSellersInView ? 'animate' : 'initial'}
      variants={topSellersVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
    >
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/bg2.svg')" }}>
    </div>


      <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-color)] mb-0 relative">
        {t('home.topSellers')}
        <span className="absolute inset-0 -z-10 bg-[var(--accent-color)] opacity-10 rounded-full filter blur-xl" />
      </h2>

      <ProductCarousel products={products} currentLocale={currentLocale} pageName="home" />

    </motion.section>
  );
}