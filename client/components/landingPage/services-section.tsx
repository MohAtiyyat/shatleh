'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {  motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fetchServices } from '../../lib/api';


interface Service {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    image: string[] | null;
}

interface ServicesSectionProps {
    currentLocale: 'en' | 'ar';
}

export default function ServicesSection({ currentLocale }: ServicesSectionProps) {
    const t = useTranslations();
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
            image: ['/agri services.jpg'],
        },
        {
            id: 2,
            name_en: 'Agricultural Consultations',
            name_ar: 'الاستشارات الزراعية',
            description_en: 'Expert advice from agricultural engineers to improve plant care.',
            description_ar: 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
            image: ['/educational content.webp'],
        },
        {
            id: 3,
            name_en: 'Garden Landscaping',
            name_ar: 'تنسيق الحدائق',
            description_en: 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
            description_ar: 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
            image: ['/best plants.jpg'],
        },
    ];

    useEffect(() => {
        const loadServices = async () => {
            try {
                const services = await fetchServices();
                if (services.length === 0) {
                    setServicesData(mockServicesData); // Fallback to mock data
                    return;
                }
                setServicesData(services);
            } catch (error) {
                console.error('Error fetching services:', error);
                setServicesData(mockServicesData); // Fallback to mock data
            }
        };
        loadServices();
    }, []);

    const servicesVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <motion.section
            ref={servicesRef}
            className="max-w-6xl mx-auto p-4 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4 relative"
            initial="initial"
            animate={servicesInView ? 'animate' : 'initial'}
            variants={servicesVariants}
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <h2 className="text-center text-4xl font-medium text-[var(--accent-color)] mb-3 relative drop-shadow-md">
                {t('header.services')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                    <h3 className="text-3xl font-medium text-[var(--accent-color)] mb-4">
                        {t('home.choosePlantsTitle')}
                    </h3>
                </div>
                <div>
                    <p className="text-base text-gray-700">{t('home.choosePlantsDescription')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {servicesData.map((service) => (
                    <Link href={`/${currentLocale}/services?service_id=${service.id}`} key={service.id}>
                        <motion.div
                            className={`rounded-xl p-6 flex flex-col items-center h-full ${
                                service.id === 2 ? 'bg-[var(--accent-color)] text-white' : 'bg-white'
                            }`}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={service.image && service.image.length > 0 ? `${process.env.NEXT_PUBLIC_API_URL + "/"}${service.image[0]}` : '/placeholder.svg'}
                                alt={currentLocale === 'ar' ? service.name_ar : service.name_en}
                                width={400}
                                height={300}
                                className="w-full h-56 object-cover mb-4"
                            />
                            <h4
                                className={`text-xl font-medium mb-3 ${
                                    service.id === 2 ? '' : 'text-[var(--accent-color)]'
                                }`}
                            >
                                {currentLocale === 'ar' ? service.name_ar : service.name_en}
                            </h4>
                            <p className={`text-center flex-1 ${service.id === 2 ? '' : 'text-gray-700'}`}>
                                {currentLocale === 'ar' ? service.description_ar : service.description_en}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.section>
    );
}