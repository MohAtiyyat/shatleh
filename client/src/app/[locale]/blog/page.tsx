'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon } from 'lucide-react';
import BlogCard from '../../../../components/post/blog-card';
import Breadcrumb from '../../../../components/breadcrumb';
import Filters from '../../../../components/post/category-filter';
import Pagination from '../../../../components/pagination';
import SearchBar from '../../../../components/post/search-bar';
import { BlogPost, PostFiltersState } from '../../../../lib/index';
import { fetchBlogPosts, fetchPostCategories, getAuthToken } from '../../../../lib/api';

export default function Home() {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = (pathname.split('/')[1] || 'ar') as 'en' | 'ar';

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<(BlogPost & { bookmarked: boolean })[]>([]);
    const [filters, setFilters] = useState<PostFiltersState>({ categories: [] });
    const [error, setError] = useState<string | null>(null);
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const postsData = await fetchBlogPosts();
            setPosts(postsData);

            const categoriesData = await fetchPostCategories(currentLocale);
            const usedCategoryNames = new Set(
                postsData
                    .map((post) => (currentLocale === 'ar' ? post.category_ar : post.category_en))
                    .filter((category): category is string => !!category)
            );

            const filteredCategories = categoriesData.filter((category) =>
                usedCategoryNames.has(currentLocale === 'ar' ? category.name.ar : category.name.en)
            );

            setFilters({ categories: filteredCategories });
        } catch (err) {
            setError(t('error.fetchFailed', { default: 'Failed to fetch data' }));
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentLocale]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, showBookmarkedOnly]);

    const handleSearch = () => {
        console.log('Search submitted:', searchTerm);
    };

    const toggleBookmarkedView = () => {
        setShowBookmarkedOnly((prev) => !prev);
    };

    const filteredPosts = posts.filter((post) => {
        if (showBookmarkedOnly && !post.bookmarked) {
            return false;
        }
        const postCategory = currentLocale === 'ar' ? post.category_ar : post.category_en;
        if (!filters.categories.some((c) => c.selected)) {
            return true;
        }
        if (!postCategory) {
            return false;
        }
        return filters.categories.some(
            (category) =>
                category.selected &&
                (currentLocale === 'ar' ? category.name.ar : category.name.en) === postCategory
        );
    });

    const finalPosts = filteredPosts.filter((post) =>
        ((currentLocale === 'ar' ? post.title_ar : post.title_en) || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        ((currentLocale === 'ar' ? post.content_ar : post.content_en) || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const postsPerPage = 6;
    const totalPages = Math.ceil(finalPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = finalPosts.slice(startIndex, endIndex);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

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

    const buttonVariants = {
        idle: { scale: 1, rotate: 0 },
    };

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

    const isAuthenticated = !!getAuthToken();

    return (
        <div className="min-h-screen bg-[#e8f5e9] overflow-hidden mx-10">
            <main className="container mx-auto px-5 py-2">
                <div className="mb-4 mx-8">
                    <Breadcrumb pageName="blog" />
                </div>
                <div className="mb-3 ">
                    <div className={`flex flex-wrap items-center mb-4`}>
                        <div className="flex flex-wrap ">
                            <SearchBar
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onSearch={handleSearch}
                            />
                            {isAuthenticated && (
                                <motion.button
                                    onClick={toggleBookmarkedView}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md mb-5 ${
                                        showBookmarkedOnly
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-white text-teal-600'
                                    }
                                    ${currentLocale === 'ar' ? 'mr-10' : 'ml-2'}
                                    hover:bg-teal-600 hover:text-white transition-colors shadow-sm font-medium text-sm`}
                                    aria-label={
                                        showBookmarkedOnly
                                            ? t('education.showAllPosts', {
                                                  default: 'Show All Posts',
                                              })
                                            : t('education.showBookmarked', {
                                                  default: 'Show Bookmarked Posts',
                                              })
                                    }
                                    variants={buttonVariants}
                                    initial="idle"
                                    animate={showBookmarkedOnly ? 'clicked' : 'idle'}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <BookmarkIcon className="h-5 w-5" />
                                    <span>
                                        {showBookmarkedOnly
                                            ? t('education.showAllPosts', { default: 'Show All Posts' })
                                            : t('education.showBookmarked', { default: 'Bookmarks' })}
                                    </span>
                                </motion.button>
                            )}
                            <Filters
                                filters={filters}
                                setFilters={setFilters}
                                currentLocale={currentLocale}
                            />
                        </div>
                    </div>
                </div>
                {error && (
                    <motion.p
                        className="col-span-full text-center text-red-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {error}
                    </motion.p>
                )}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        Array.from({ length: postsPerPage }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
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
                                        <BlogCard
                                            post={post}
                                            currentLocale={currentLocale}
                                            setPosts={setPosts}
                                        />
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
                                    {showBookmarkedOnly
                                        ? t('education.noBookmarkedPosts', {
                                              default: 'No bookmarked posts found',
                                          })
                                        : t('education.noResults', {
                                              default: 'No results found',
                                          })}
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