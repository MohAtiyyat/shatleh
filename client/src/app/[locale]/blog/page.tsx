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
import { fetchBlogPosts, fetchPostCategories, fetchBookmarkedPosts, getAuthToken } from '../../../../lib/api';


export default function Home() {
    const t = useTranslations('');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = (pathname.split('/')[1] || 'ar') as 'en' | 'ar';

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<(BlogPost & { bookmarked?: boolean })[]>([]);
    const [filters, setFilters] = useState<PostFiltersState>({ categories: [] });
    const [error, setError] = useState<string | null>(null);
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Moved to state

    // Set isAuthenticated on client side
    useEffect(() => {
        setIsAuthenticated(!!getAuthToken());
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const postsData = await fetchBlogPosts();
            let bookmarkedPosts: BlogPost[] = [];
            if (isAuthenticated) {
                bookmarkedPosts = await fetchBookmarkedPosts();
            }
            const bookmarkedPostIds = new Set(bookmarkedPosts.map((post) => post.id));

            const postsWithBookmarks = postsData.map((post) => ({
                ...post,
                bookmarked: bookmarkedPostIds.has(post.id),
            }));

            setPosts(postsWithBookmarks);

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
    }, [currentLocale, isAuthenticated]);

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
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            staggerChildren: 0.15,
        },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, rotate: 2 },
        visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.5,
        },
        },
        exit: {
        opacity: 0,
        y: -30,
        rotate: -2,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
        },
    };

    const buttonVariants = {
        idle: { scale: 1, rotate: 0 },
        clicked: {
        scale: [1, 1.2, 0.9, 1],
        transition: { duration: 0.3 },
        },
    };

        const SkeletonCard = () => (
            <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-sm h-[400px] animate-pulse"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
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
            </motion.div>
        );

    const getPostKey = (post: BlogPost, index: number) => `${post.id}-${currentPage}-${index}`;

        return (
            <div className="min-h-screen bg-[#e8f5e9] mx-10">
            <main className="container mx-auto px-5 py-2">
                <div className="mb-4 mx-8">
                <Breadcrumb pageName="blog" />
                </div>
                <div className="mb-3">
                    <div className="flex flex-wrap items-center mb-4">
                        <div className="flex flex-wrap">
                            <SearchBar
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onSearch={handleSearch}
                            />
                            {isAuthenticated && (
                                <motion.button
                                    onClick={toggleBookmarkedView}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md mb-5 ${
                                        showBookmarkedOnly ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'
                                    } ${currentLocale === 'ar' ? 'mr-10' : 'ml-2'} hover:bg-teal-600 hover:text-white transition-colors shadow-sm font-medium text-sm`}
                                    aria-label={
                                        showBookmarkedOnly
                                        ? t('education.showAllPosts', { default: 'Show All Posts' })
                                        : t('education.showBookmarked', { default: 'Show Bookmarked Posts' })
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
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
                        <SkeletonCard key={`skeleton-${index}`} />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {paginatedPosts.length > 0 ? (
                                paginatedPosts.map((post, index) => (
                                <motion.div
                                    key={getPostKey(post, index)}
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
                                    pageName="blog"
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
                                    ? t('education.noBookmarkedPosts', { default: 'No bookmarked posts found' })
                                    : t('education.noResults', { default: 'No results found' })}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    )}
                </motion.div>
                {!isLoading && totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        />
                    </motion.div>
                )}
            </main>
        </div>
    );
}