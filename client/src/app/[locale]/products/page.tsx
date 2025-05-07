'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../../../../components/products/search-bar';
import Filters from '../../../../components/products/filters';
import ProductCard from '../../../../components/products/product-card';
import Pagination from '../../../../components/pagination';
import { useTranslations } from 'next-intl';
import Breadcrumb from '../../../../components/breadcrumb';
import { usePathname, useRouter } from 'next/navigation';
import { useProducts } from '../../../../lib/ProductContext';
import type { Product } from '../../../../lib';

// Mock filters (unchanged)
const mockFilters = {
    categories: [
        { id: 1, name: { en: 'seeds', ar: 'بذور' }, selected: false },
        { id: 2, name: { en: 'Home Plants', ar: 'نباتات منزلية' }, selected: false },
        { id: 3, name: { en: 'Fruit Plants', ar: 'نباتات مثمرة' }, selected: false },
        { id: 4, name: { en: 'Supplies', ar: 'مستلزمات' }, selected: false },
        { id: 5, name: { en: 'Plants', ar: 'نباتات' }, selected: false },
        { id: 6, name: { en: 'Pesticides', ar: 'مبيدات' }, selected: false },
        { id: 7, name: { en: 'Fertilizers', ar: 'أسمدة' }, selected: false },
        { id: 8, name: { en: 'Agricultural Equipment', ar: 'مستلزمات زراعية' }, selected: false },
    ],
    availability: [
        { id: 1, name: { en: 'In Stock', ar: 'متوفر' }, selected: false },
        { id: 2, name: { en: 'Out of Stock', ar: 'غير متوفر' }, selected: false },
    ],
    ratings: [
        { id: 5, name: { en: '5 Stars', ar: '5 نجوم' }, count: 589, stars: 5, selected: false },
        { id: 4, name: { en: '4 Stars', ar: '4 نجوم' }, count: 461, stars: 4, selected: false },
        { id: 3, name: { en: '3 Stars', ar: '3 نجوم' }, count: 203, stars: 3, selected: false },
        { id: 2, name: { en: '2 Stars', ar: '2 نجوم' }, count: 50, stars: 2, selected: false },
        { id: 1, name: { en: '1 Star', ar: '1 نجمة' }, count: 18, stars: 1, selected: false },
    ],
};

// Updated filters to match product types
/*
const mockFilters = {
    categories: [
        { id: 1, name: { en: 'Laptops', ar: 'لاب توب' }, selected: false },
        { id: 2, name: { en: 'Smartphones', ar: 'هواتف ذكية' }, selected: false },
        { id: 3, name: { en: 'Tablets', ar: 'تابلت' }, selected: false },
    ],
    availability: [
        { id: 1, name: { en: 'In Stock', ar: 'متوفر' }, selected: false },
        { id: 2, name: { en: 'Out of Stock', ar: 'غير متوفر' }, selected: false },
    ],
    ratings: [
        { id: 5, name: { en: '5 Stars', ar: '5 نجوم' }, count: 0, stars: 5, selected: false },
        { id: 4, name: { en: '4 Stars', ar: '4 نجوم' }, count: 0, stars: 4, selected: false },
        { id: 3, name: { en: '3 Stars', ar: '3 نجوم' }, count: 0, stars: 3, selected: false },
        { id: 2, name: { en: '2 Stars', ar: '2 نجوم' }, count: 0, stars: 2, selected: false },
        { id: 1, name: { en: '1 Star', ar: '1 نجمة' }, count: 0, stars: 1, selected: false },
        { id: 0, name: { en: '0 Stars', ar: '0 نجوم' }, count: 0, stars: 0, selected: false },
    ],
};
*/
export default function ProductsPage() {
    const t = useTranslations('');
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const { allProducts, isLoading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        categories: [...mockFilters.categories],
        availability: [...mockFilters.availability],
        ratings: [...mockFilters.ratings],
        bestSelling: false,
    });
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Pre-select category from localStorage
    useEffect(() => {
        const category = localStorage.getItem('selectedCategory')?.toLocaleLowerCase();
        if (category) {
            setFilters((prev) => ({
                ...prev,
                categories: prev.categories.map((c) => ({
                    ...c,
                    selected: c.name.ar === category || c.name.en === category,
                })),
                availability: prev.availability.map((a) => ({ ...a, selected: false })),
                ratings: prev.ratings.map((r) => ({ ...r, selected: false })),
                bestSelling: false,
            }));
            localStorage.removeItem('selectedCategory');
        }
    }, []);

    // Clear localStorage on unmount
    useEffect(() => {
        return () => {
            localStorage.removeItem('selectedCategory');
        };
    }, []);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Apply filters and search with memoization
    const filteredProductsMemo = useMemo(() => {
        let result = [...allProducts];

        // Apply search filter (bilingual)
        if (debouncedSearchTerm) {
            result = result.filter((product) => {
                const searchLower = debouncedSearchTerm.toLowerCase();
                const nameMatch =
                    product.name_en.toLowerCase().includes(searchLower) ||
                    product.name_ar.toLowerCase().includes(searchLower);
                const descMatch =
                    product.description_en.toLowerCase().includes(searchLower) ||
                    product.description_ar.toLowerCase().includes(searchLower);
                return nameMatch || descMatch;
            });
        }

        // Filter by category (note: ineffective due to null categories in data)
        const selectedCategories = filters.categories
            .filter((c) => c.selected)
            .map((c) => c.name.en);
        if (selectedCategories.length > 0) {
            result = result.filter((product) => product.category_en && selectedCategories.includes(product.category_en));
        }

        // Filter by availability
        const inStockSelected = filters.availability.find((a) => a.name.en === 'In Stock')?.selected;
        const outOfStockSelected = filters.availability.find((a) => a.name.en === 'Out of Stock')?.selected;
        if (inStockSelected && !outOfStockSelected) {
            result = result.filter((product) => product.availability);
        } else if (!inStockSelected && outOfStockSelected) {
            result = result.filter((product) => !product.availability);
        }

        // Filter by rating
        const selectedRatings = filters.ratings.filter((r) => r.selected).map((r) => r.stars);
        if (selectedRatings.length > 0) {
            result = result.filter((product) => selectedRatings.includes(Math.floor(Number(product.rating))));
        }

        // Filter by best selling
        if (filters.bestSelling) {
            if (result.every((p) => p.sold_quantity === 0)) {
                // No best-selling products available
                console.log('No best-selling products found');
            } else {
                result = result.sort((a, b) => (b.sold_quantity || 0) - (a.sold_quantity || 0));
            }
        }

        return result;
    }, [filters, debouncedSearchTerm, allProducts]);

    useEffect(() => {
        setFilteredProducts(filteredProductsMemo);
        setCurrentPage(1);
    }, [filteredProductsMemo]);

    // Handle search submission
    const handleSearch = () => {
        console.log('Search submitted:', searchTerm);
    };

    // Get current page products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <div className="bg-[#337a5b] rounded-xl p-4 flex flex-col justify-between h-[400px] min-w-[280px] max-w-[280px] mx-2 animate-pulse">
            <div className="h-[270px] w-full bg-gray-300 rounded-lg"></div>
            <div className="flex flex-col flex-grow">
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mt-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mt-2"></div>
                <div className="flex justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-4 w-4 bg-gray-300 rounded-full mx-1"></div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#e8f5e9] overflow-hidden">
            <main className="container mx-auto px-4 py-2">
                <div className="mb-4 mx-8">
                    <Breadcrumb pageName="products" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-3">
                    <div className="sm:col-span-2 md:col-span-1 sm:mx-auto">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
                    </div>
                    <Filters filters={filters} setFilters={setFilters} currentLocale={currentLocale} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-[90%] mx-auto">
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <div
                                key={product.id}
                                onClick={() => router.push(`/${currentLocale}/products/${product.id}`)}
                                className="cursor-pointer"
                            >
                                <ProductCard product={product} index={index} pageName="products" />
                            </div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-10"
                        >
                            <p className="text-lg text-[#0f4229]">{t('products.noProducts')}</p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        categories: filters.categories.map((c) => ({ ...c, selected: false })),
                                        availability: filters.availability.map((a) => ({ ...a, selected: false })),
                                        ratings: filters.ratings.map((r) => ({ ...r, selected: false })),
                                        bestSelling: false,
                                    });
                                    setSearchTerm('');
                                    setFilteredProducts(allProducts);
                                }}
                                className="mt-4 px-4 py-2 bg-[#43bb67] text-white rounded-md"
                            >
                                {t('products.clearFilters')}
                            </button>
                        </motion.div>
                    )}
                </div>

                {!isLoading && filteredProducts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </main>
        </div>
    );
}