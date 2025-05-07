
'use client';

import { usePathname } from 'next/navigation';

export default function ProductDetailsSkeleton() {
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'ar';

    return (
        <div className={`min-h-screen bg-[#e8f5e9] overflow-hidden ${currentLocale === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section: Image and Breadcrumb */}
                    <div className="md:w-1/2 lg:w-5/12">
                        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4 animate-pulse"></div>
                        <div className="h-[400px] w-full bg-gray-300 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Right Section: Product Info */}
                    <div className="md:w-1/2 lg:w-7/12">
                        <div className="h-8 w-3/4 bg-gray-300 rounded mb-3 animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-300 rounded mb-4 animate-pulse"></div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-5 w-5 bg-gray-300 rounded-full mr-1 animate-pulse"></div>
                            ))}
                        </div>
                        <div className="mb-6">
                            <div className="h-4 w-16 bg-gray-300 rounded mb-2 animate-pulse"></div>
                            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="h-10 w-32 bg-gray-300 rounded-md animate-pulse"></div>
                            <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="h-10 w-32 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="md:max-w-7xl mx-auto px-4 py-12">
                <div className="flex border-b border-[#d0d5dd] mb-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-gray-300 rounded mr-4 animate-pulse"></div>
                    ))}
                </div>
                <div className="h-[300px] w-full bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            {/* Suggested Products Skeleton */}
            <div className="border-t border-[#d0d5dd] py-8 bg-[#e8f5e9]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-6 w-48 mx-auto bg-gray-300 rounded mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-[#337a5b] rounded-xl p-4 flex flex-col justify-between h-[400px] min-w-[280px] max-w-[280px] mx-2 animate-pulse"
                            >
                                <div className="h-[270px] w-full bg-gray-300 rounded-lg"></div>
                                <div className="flex flex-col flex-grow">
                                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mt-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-full mt-2"></div>
                                    <div className="flex justify-center mt-2">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <div key={j} className="h-4 w-4 bg-gray-300 rounded-full mx-1"></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
