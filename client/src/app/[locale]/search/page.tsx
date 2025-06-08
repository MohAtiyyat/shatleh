'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { search, fetchBookmarkedPosts, getAuthToken } from '../../../../lib/api';
import type { Product, BlogPost, Service } from '../../../../lib';
import BlogCard from '../../../../components/post/blog-card';
import ServiceCard from '../../../../components/service/service-card';
import ProductCard from '../../../../components/products/product-card';
import Link from 'next/link';

interface SearchResults {
    products: Product[];
    posts: (BlogPost & { bookmarked?: boolean })[]; // Updated to include bookmarked property
    services: Service[];
}

export default function SearchPage() {
    const t = useTranslations('search');
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLocale = (pathname.split('/')[1] || 'en') as 'en' | 'ar';
    const [contentType, setContentType] = useState<string>('all');
    const [results, setResults] = useState<SearchResults>({ products: [], posts: [], services: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState<string>('');
    const [posts, setPosts] = useState<(BlogPost & { bookmarked?: boolean })[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Moved to state

    // Set isAuthenticated on client side
    useEffect(() => {
        setIsAuthenticated(!!getAuthToken());
    }, []);
    // Sync query state with URL search parameter and localStorage
    useEffect(() => {
        const urlQuery = searchParams.get('q') || '';
        const storedQuery = localStorage.getItem('searchQuery') || '';
        const newQuery = urlQuery || storedQuery;
        setQuery(newQuery);
        if (urlQuery && urlQuery !== storedQuery) {
            localStorage.setItem('searchQuery', urlQuery);
        }
    }, [searchParams]);

    // Fetch search results and merge bookmark status for posts
    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults({ products: [], posts: [], services: [] });
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const data = await search(query, contentType);
                console.log('Search API response:', data);

                // Fetch bookmarked posts if authenticated
                let postsWithBookmarks = data.data.posts;
                if (isAuthenticated) {
                    const bookmarkedPosts = await fetchBookmarkedPosts();
                    const bookmarkedPostIds = new Set(bookmarkedPosts.map((post) => post.id));
                    postsWithBookmarks = data.data.posts.map((post: BlogPost) => ({
                        ...post,
                        bookmarked: bookmarkedPostIds.has(post.id),
                    }));
                }

                setResults({
                    ...data.data,
                    posts: postsWithBookmarks,
                });
                setPosts(postsWithBookmarks);
            } catch (err) {
                setError(t('error'));
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, contentType, t, isAuthenticated]);

    // Handle dropdown click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleContentTypeChange = (type: string) => {
        setContentType(type);
        setIsDropdownOpen(false);
    };


    const contentTypes = [
        { id: 'all', label: t('all') },
        { id: 'products', label: t('products') },
        { id: 'posts', label: t('posts') },
        { id: 'services', label: t('services') },
    ];

    console.log('Content types:', contentTypes);
    console.log('Current results:', results);
    console.log('Current query:', query);

    return (
        <main className="min-h-screen mx-auto px-4 py-10 max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">{t('title', { query })}</h1>

            {/* Filter Dropdown */}
            <div className="relative mb-6" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                    aria-expanded={isDropdownOpen}
                    aria-label={t('filter')}
                >
                    <span>{contentTypes.find((type) => type.id === contentType)?.label || t('all')}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full ${currentLocale === "ar" ? "right-0" : "left-0"} mt-1 bg-white border border-[#80ce97] rounded-md shadow-lg z-10 min-w-[150px]`}
                        role="menu"
                        aria-label={t('filterOptions')}
                    >
                        <div className="p-2 space-y-2">
                            {contentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleContentTypeChange(type.id)}
                                    className={`w-full ${currentLocale === "ar" ? "text-right" : "text-left"} px-4 py-2 hover:bg-gray-100 text-[#414141]`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Results */}
            {loading ? (
                <p>{t('loading')}</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : results.products.length === 0 &&
                results.posts.length === 0 &&
                results.services.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <Search className="h-16 w-16 text-[#80ce97] mb-4" />
                    <h2 className="text-2xl font-semibold text-[#0f4229] mb-2">
                        {t('noResultsTitle', { default: 'No Results Found' })}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {t('noResultsMessage', { default: 'Sorry, we couldn’t find any results for your search query. Try a different search term or check out our categories.' })}
                    </p>
                    <Link
                        href={`/${currentLocale}`}
                        className="px-4 py-2 bg-[#337a5b] text-white rounded-md hover:bg-[#2a634a] transition-colors"
                    >
                        {t('goBack', { default: 'Go Back' })}
                    </Link>
                </div>
            ) : (
                <div>
                    {(contentType === 'all' || contentType === 'products') && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">{t('products')}</h2>
                            {results.products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
                                    {results.products.map((product, index) => (
                                        <ProductCard
                                            key={product.id}
                                            product={{ ...product, image: Array.isArray(product.image) ? product.image : [product.image] }}
                                            index={index}
                                            pageName="search"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>{t('noResults')}</p>
                            )}
                        </div>
                    )}
                    {(contentType === 'all' || contentType === 'posts') && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">{t('posts')}</h2>
                            {posts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
                                    {posts.map((post) => (
                                        <BlogCard
                                            key={post.id}
                                            post={post}
                                            currentLocale={currentLocale as 'en' | 'ar'}
                                            setPosts={setPosts}
                                            pageName='search'
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>{t('noResults')}</p>
                            )}
                        </div>
                    )}
                    {(contentType === 'all' || contentType === 'services') && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">{t('services')}</h2>
                            {results.services.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
                                    {results.services.map((service, index) => (
                                        <ServiceCard key={service.id} service={service} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <p>{t('noResults')}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}