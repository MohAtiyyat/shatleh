'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Loading() {
    const t = useTranslations('search');
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';

    return (
        <main className="min-h-screen mx-auto px-4 py-10 max-w-7xl" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="text-2xl font-bold mb-6">{t('loading')}</h1>

            {/* Filter Dropdown Skeleton */}
            <div className="relative mb-6">
                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-200 rounded-md min-w-[150px] h-10">
                    <div className="w-20 h-4 bg-gray-300 rounded" />
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                </div>
            </div>

            {/* Skeleton for Products */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('products')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-[#337a5b] rounded-xl p-4 flex flex-col justify-between h-[400px] w-full"
                        >
                            <div className="mb-4 flex justify-center items-center rounded-lg h-[270px] w-full">
                                <div className="w-full h-full bg-gray-300 rounded-lg" />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2 mx-auto" />
                                <div className="w-full h-4 bg-gray-300 rounded mb-2 mx-auto" />
                                <div className="flex justify-center mb-2">
                                    <div className="w-20 h-4 bg-gray-300 rounded" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="w-16 h-4 bg-gray-300 rounded" />
                                    <div className="w-8 h-8 bg-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skeleton for Posts */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('posts')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[350px]"
                        >
                            <div className="relative h-56">
                                <div className="w-full h-full bg-gray-300 rounded-t-xl" />
                            </div>
                            <div className="p-4 bg-green-50 flex flex-col justify-between flex-grow">
                                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2" />
                                <div className="w-full h-4 bg-gray-300 rounded mb-4" />
                                <div className="flex justify-between items-center">
                                    <div className="w-16 h-4 bg-gray-300 rounded" />
                                    <div className="w-20 h-4 bg-gray-300 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skeleton for Services */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('services')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-[#337a5b] rounded-xl p-4 flex flex-col justify-between h-[400px] w-[280px]"
                        >
                            <div className="mb-4 flex justify-center items-center rounded-lg h-[270px] w-full">
                                <div className="w-full h-full bg-gray-300 rounded-lg" />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="w-3/4 h-6 bg-gray-300 rounded mb-2 mx-auto" />
                                <div className="w-full h-4 bg-gray-300 rounded mb-2 mx-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}