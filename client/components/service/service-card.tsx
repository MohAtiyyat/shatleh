'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Service } from '../../lib';

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

interface ServiceCardProps {
    service: Service;
    index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const description = truncateText(
        currentLocale === 'ar' ? service.description_ar : service.description_en,
        100
    );

    return (
        <Link href={`/${currentLocale}/services/${service.id}`} passHref>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: 'easeOut',
                }}
                whileHover={{
                    scale: 1.03,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                className="bg-[#337a5b] rounded-xl p-4 text-white flex flex-col justify-between h-full w-[280px] relative cursor-pointer"
                aria-label={currentLocale === 'ar' ? service.name_ar : service.name_en}
            >
                <div className="mb-4 flex justify-center items-center rounded-lg h-[270px] w-full relative">
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL + service.image || '/placeholder.png'}
                        alt={currentLocale === 'ar' ? service.name_ar : service.name_en}
                        width={300}
                        height={270}
                        className="object-cover rounded-lg w-full h-full"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <h3 className="font-medium text-center mb-1 text-white">
                        {currentLocale === 'ar' ? service.name_ar : service.name_en}
                    </h3>
                    <p className="text-xs text-center mb-2 flex-grow text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}

export default ServiceCard;