import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CustomerFullReviewSection() {
    const t = useTranslations();
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';

    // Customer Review Data
    const customerReviewData = [
        {
            name: t('customerReviews.review1.name'),
            review: t('customerReviews.review1.review'),
            image:
                'https://images.pexels.com/photos/8090508/pexels-photo-8090508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 5,
        },
        {
            name: t('customerReviews.review2.name'),
            review: t('customerReviews.review2.review'),
            image:
                'https://images.pexels.com/photos/5976933/pexels-photo-5976933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            rating: 5,
        },
        {
            name: t('customerReviews.review3.name'),
            review: t('customerReviews.review3.review'),
            image:
                'https://images.pexels.com/photos/29739385/pexels-photo-29739385/free-photo-of-elderly-man-playing-traditional-rababah-in-petra.jpeg?auto=compress&cs=tinysrgb&w=600',
            rating: 5,
        },
    ];

    return (

        < section
            className="max-w-6xl mx-auto p-6 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'
            }
        >
            <h2 className="text-center md:text-4xl sm:text-3xl font-medium text-[var(--accent-color)] mb-10 relative drop-shadow-md">
                {t('home.customerReview')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {customerReviewData.map((review, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ amount: 0.4 }}
                        className={`rounded-3xl p-6 shadow-md relative overflow-hidden ${review.name === t('customerReviews.review2.name')
                            ? 'bg-[var(--accent-color)] text-white'
                            : 'bg-[rgba(232,245,233,0.5)]'
                            }`}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                    >
                        <div className="absolute inset-0 opacity-5">
                            <svg
                                width="200"
                                height="200"
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={currentLocale === 'ar' ? 'absolute left-0 bottom-0' : 'absolute right-0 bottom-0'}
                            >
                                <path
                                    d={
                                        currentLocale === 'ar'
                                            ? 'M50 50C50 50 100 50 100 100C100 150 50 150 50 150'
                                            : 'M150 50C150 50 100 50 100 100C100 150 150 150 150 150'
                                    }
                                    stroke={
                                        review.name === t('customerReviews.review2.name') ? 'white' : 'var(--accent-color)'
                                    }
                                    strokeWidth="2"
                                />
                                <path
                                    d={
                                        currentLocale === 'ar'
                                            ? 'M80 80C80 80 100 80 100 100C100 120 80 120 80 120'
                                            : 'M120 80C120 80 100 80 100 100C100 120 120 120 120 120'
                                    }
                                    stroke={
                                        review.name === t('customerReviews.review2.name') ? 'white' : 'var(--accent-color)'
                                    }
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center mb-4">
                            <div
                                className={`w-16 h-16 rounded-full overflow-hidden ${currentLocale === 'ar' ? 'ml-4' : 'mr-4'
                                    } shadow-md`}
                            >
                                <Image
                                    src={review.image}
                                    width={64}
                                    height={64}
                                    alt={review.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4
                                    className={`text-2xl font-medium ${review.name === t('customerReviews.review2.name')
                                        ? ''
                                        : 'text-[var(--accent-color)]'
                                        }`}
                                >
                                    {review.name}
                                </h4>
                                <div className="flex">
                                    {Array.from({ length: review.rating }).map((_, star) => (
                                        <svg
                                            key={star}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="#fff84e"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10 1L13 7L19 8L14.5 12.5L16 19L10 16L4 19L5.5 12.5L1 8L7 7L10 1Z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p
                            className={
                                review.name === t('customerReviews.review2.name')
                                    ? ''
                                    : 'text-[rgba(51,122,91,0.8)]'
                            }
                        >
                            {review.review}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section >
    )
}
