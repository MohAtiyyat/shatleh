'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from '../../../../components/post/blog-card';
import SearchBar from '../../../../components/post/search-bar';
import Breadcrumb from '../../../../components/breadcrumb';
import Filters from '../../../../components/post/category-filter';
import Pagination from '../../../../components/pagination';
import { BlogPost } from '../../../../lib/index';
import { PostFiltersState } from '../../../../lib/index';

export default function Home() {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = (pathname.split('/')[1] || 'ar') as 'en' | 'ar';

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const postsPerPage = 6;

    const [filters, setFilters] = useState<PostFiltersState>({
        categories: [
            {
                id: 1,
                name: { en: 'Plants', ar: 'النباتات' },
                selected: false,
            },
            {
                id: 2,
                name: { en: 'General', ar: 'عام' },
                selected: false,
            },
            {
                id: 3,
                name: { en: 'Indoor Plants', ar: 'نباتات داخلية' },
                selected: false,
            },
            {
                id: 4,
                name: { en: 'Outdoor Plants', ar: 'نباتات خارجية' },
                selected: false,
            },
            {
                id: 5,
                name: { en: 'Specialized', ar: 'متخصص' },
                selected: false,
            },
        ],
    });

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Reset currentPage to 1 when searchTerm or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const handleSearch = () => {
        console.log('Search submitted:', searchTerm);
    };

    // Sample blog post data
    const posts: BlogPost[] = [
        {
            id: 1,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'Plants',
            category_ar: 'النباتات',
            image: '/ariqat.jpeg',
        },
        {
            id: 2,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 3,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'Indoor Plants',
            category_ar: 'نباتات داخلية',
            image: '/best plants.jpg',
        },
        {
            id: 4,
            title_en: 'nooo',
            title_ar: 'لا',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'Outdoor Plants',
            category_ar: 'نباتات خارجية',
            image: '/me.png',
        },
        {
            id: 5,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'Specialized',
            category_ar: 'متخصص',
            image: '/ariqat.jpeg',
        },
        {
            id: 6,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 7,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 8,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 9,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 10,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 11,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 12,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 13,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 14,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 15,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 16,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
        {
            id: 17,
            title_en: 'Post title',
            title_ar: 'عنوان المنشور',
            content_en:
                'At accumsan condimentum donec dictumst eros, tempus in diam. Ornare gravida quis eu blandit lectus.',
            content_ar:
                'في accumsan condimentum donec dictumst eros، tempus in diam. Ornare gravida quis eu blandit lectus.',
            category_en: 'General',
            category_ar: 'عام',
            image: '/ariqat.jpeg',
        },
    ];

    // Filter posts based on selected categories
    const filteredPosts = posts.filter((post) => {
        const postCategory = currentLocale === 'ar' ? post.category_ar : post.category_en;

        // Skip posts with undefined category
        if (!postCategory) {
            return false;
        }

        // If no categories are selected, show all posts
        if (!filters.categories.some((c) => c.selected)) {
            return true;
        }

        // Include posts matching selected categories
        return filters.categories.some(
            (category) =>
                category.selected &&
                (currentLocale === 'ar' ? category.name.ar : category.name.en) === postCategory
        );
    });

    // Apply search term filtering (case-insensitive)
    const finalPosts = filteredPosts.filter((post) =>
        (currentLocale === 'ar' ? post.title_ar : post.title_en)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        (currentLocale === 'ar' ? post.content_ar : post.content_en)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(finalPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = finalPosts.slice(startIndex, endIndex);

    // Animation variants for the container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Animation variants for each BlogCard
    const cardVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.4,
                ease: 'easeIn',
            },
        },
    };

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm h-[400px] animate-pulse">
            <div className="h-56 w-full bg-gray-300"></div>
            <div className="p-4 bg-gray-50 flex flex-col">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="flex justify-between items-center mt-4">
                    <div className="h-5 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#e8f5e9] overflow-hidden mx-10">
            <main className="container mx-auto px-5 py-2">
                <div className="mb-4 mx-8">
                    <Breadcrumb pageName="blog" />
                </div>
                <div className="mb-3">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
                        <Filters filters={filters} setFilters={setFilters} currentLocale={currentLocale} />
                    </div>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        <AnimatePresence mode="wait">
                            {paginatedPosts.length > 0 ? (
                                paginatedPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        variants={cardVariants}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <BlogCard post={post} currentLocale={currentLocale} />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.p
                                    key="no-results"
                                    className="col-span-full text-center text-[#0f4229]"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {t('products.noResults', { defaultMessage: 'No posts found.' })}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    )}
                    
                </motion.div>
                {!isLoading && totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}