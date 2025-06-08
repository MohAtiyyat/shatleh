'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CategoryCarousel from './category-carousel';
import type { Category, Locale } from '../../lib';

interface CategoriesSectionProps {
  currentLocale: Locale;
}

export default function CategoriesSection({ currentLocale }: CategoriesSectionProps) {
  const t = useTranslations();
  const categoriesRef = useRef(null);
  const categoriesInView = useInView(categoriesRef, { once: true, margin: '-100px' });

  const categories: Category[] = [
    {
      id: Math.random(),
      name: { en: 'Plants', ar: 'نباتات' },
      subcategories: [],
      image: '/5.svg',
    },
    {
      id: Math.random(),
      name: { en: 'Seeds', ar: 'بذور' },
      subcategories: [],
      image: '/4.svg',
    },
    {
      id: Math.random(),
      name: { en: 'Pesticides', ar: 'مبيدات' },
      subcategories: [],
      image: '/6.svg',
    },
    {
      id: Math.random(),
      name: { en: 'Fertilizers', ar: 'أسمدة' },
      subcategories: [],
      image: '/7.svg',
    },
    {
      id: Math.random(),
      name: { en: 'Agricultural Equipment', ar: 'مستلزمات زراعية' },
      subcategories: [],
      image: '/10.svg',
    },
  ];

  const categoriesVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      ref={categoriesRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-8 rounded-3xl bg-gradient-to-br from-[var(--primary-bg)] to-[rgba(51,122,91,0.1)] border border-[rgba(51,122,91,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={categoriesInView ? 'animate' : 'initial'}
      variants={categoriesVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
    >
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/bg1.svg')" }}>
    </div>

      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--accent-color)] mb-8 relative">
        {t('categories.categories')}
        <span className="absolute" />
      </h2>
      <div className="relative overflow-hidden">
        <CategoryCarousel categories={categories} currentLocale={currentLocale} />
      </div>
    </motion.section>
  );
}