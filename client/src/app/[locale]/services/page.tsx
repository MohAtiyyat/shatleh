'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { fetchServices } from '../../../../lib/api';

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
}

export default function ServicesPage() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const [servicesData, setServicesData] = useState<Service[]>([]);

  const mockServicesData: Service[] = [
    {
      id: 1,
      name_en: 'Tree and Plant Care',
      name_ar: 'العناية بالأشجار والنباتات',
      description_en: 'Full care services for trees and plants to help them grow healthy and beautiful.',
      description_ar: 'خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.',
      image: '/agri services.jpg',
    },
    {
      id: 2,
      name_en: 'Agricultural Consultations',
      name_ar: 'الاستشارات الزراعية',
      description_en: 'Expert advice from agricultural engineers to improve plant care.',
      description_ar: 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
      image: '/educational content.webp',
    },
    {
      id: 3,
      name_en: 'Garden Landscaping',
      name_ar: 'تنسيق الحدائق',
      description_en: 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
      description_ar: 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
      image: '/best plants.jpg',
    },
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchServices();
        setServicesData(services.length ? services : mockServicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServicesData(mockServicesData);
      }
    };
    loadServices();
  }, []);

  const trimDescription = (description: string) => {
    const maxLength = 50;
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--accent-color)] mb-4">
            {t('header.services')}
          </h1>
          <p className="text-lg text-[var(--text-gray)] max-w-3xl mx-auto">
            {currentLocale === 'ar'
              ? 'اكتشف خدماتنا الزراعية المتنوعة التي صممت لتعزيز جمال وصحة حديقتك.'
              : 'Discover our diverse agricultural services designed to enhance the beauty and health of your garden.'}
          </p>
        </div>

        <motion.section
          ref={servicesRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="initial"
          animate={servicesInView ? 'animate' : 'initial'}
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <Image
                src={service.image ? `${process.env.NEXT_PUBLIC_API_URL}${service.image}` : '/placeholder.svg'}
                alt={currentLocale === 'ar' ? service.name_ar : service.name_en}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-3">
                  {currentLocale === 'ar' ? service.name_ar : service.name_en}
                </h2>
                <p className="text-gray-600 flex-1 mb-4">
                  {currentLocale === 'ar' ? trimDescription(service.description_ar) : trimDescription(service.description_en)}
                </p>
                <Link href={`/${currentLocale}/services/${service.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-full hover:bg-[var(--footer-accent)] hover:cursor-pointer transition-colors w-full text-center"
                  >
                    {t('serviceRequests.requestService')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </motion.div>
    </div>
  );
}