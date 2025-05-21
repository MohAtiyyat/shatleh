'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Locale } from '../../lib';

interface Review {
  id: number;
  name_en: string;
  name_ar: string;
  quote_en: string;
  quote_ar: string;
  rating: number;
}

interface CustomerReviewSectionProps {
  currentLocale: Locale;
}

export default function CustomerReviewSection({ currentLocale }: CustomerReviewSectionProps) {
  const t = useTranslations();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Fake reviews
  const reviews: Review[] = [
    {
      id: 1,
      name_en: 'Sarah Al-Mansoori',
      name_ar: 'سارة المنصوري',
      quote_en: 'The plants I ordered arrived in perfect condition, and the care tips provided were fantastic! My garden is thriving.',
      quote_ar: 'النباتات التي طلبتها وصلت بحالة ممتازة، ونصائح العناية كانت رائعة! حديقتي تزدهر.',
      rating: 5,
    },
    {
      id: 2,
      name_en: 'Ahmed Khaled',
      name_ar: 'أحمد خالد',
      quote_en: 'Amazing service and high-quality seeds. My farm has never been more productive. Highly recommend!',
      quote_ar: 'خدمة رائعة وبذور عالية الجودة. مزرعتي لم تكن أكثر إنتاجية من قبل. أوصي بها بشدة!',
      rating: 4,
    },
    {
      id: 3,
      name_en: 'Layla Hassan',
      name_ar: 'ليلى حسن',
      quote_en: 'The landscaping service transformed my backyard into a beautiful oasis. Professional and friendly team!',
      quote_ar: 'خدمة تنسيق الحدائق حولت فناء منزلي إلى واحة جميلة. فريق محترف وودود!',
      rating: 5,
    },
  ];

  // Animation variants for the section
  const sectionVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
  };

  // Animation variants for the heading
  const headingVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for the review cards
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-10 rounded-3xl bg-gradient-to-tr from-[var(--primary-bg)] to-[rgba(34,139,34,0.15)] border border-[rgba(34,139,34,0.3)] shadow-xl relative overflow-hidden"
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      variants={sectionVariants}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
    >

      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/bg5.svg')" }}
      ></div>

      <motion.h2
        className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-color)] mb-8 relative"
        variants={headingVariants}
        initial="initial"
        animate={isInView ? 'animate' : 'initial'}
      >
        {t('home.customerReview')}
        <span className="absolute inset-0 -z-10 bg-[var(--accent-color)] opacity-10 rounded-full filter blur-xl" />
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            className="bg-white rounded-xl p-6 flex flex-col items-center shadow-md relative overflow-hidden"
            variants={cardVariants}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Leaf Accent */}
            <div className="absolute top-0 left-0 w-12 h-12 opacity-20">
              <svg viewBox="0 0 24 24" fill="#228B22" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              </svg>
            </div>

            {/* Rating Stars */}
            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118l-3.39-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
           <p className="text-gray-700 text-center text-sm mb-4 flex-1">
              {currentLocale === 'ar' ? review.quote_ar : review.quote_en}
            </p>

            {/* Name */}
            <h4 className="text-lg font-semibold text-[var(--accent-color)]">
              {currentLocale === 'ar' ? review.name_ar : review.name_en}
            </h4>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}