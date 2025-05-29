// app/[locale]/products/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../../../../components/products/search-bar';
import Filters from '../../../../components/products/filters';
import ProductCard from '../../../../components/products/product-card';
import Pagination from '../../../../components/pagination';
import Breadcrumb from '../../../../components/breadcrumb';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useProducts } from '../../../../lib/ProductContext';
import { fetchCategories } from '../../../../lib/api';
import { Product, Category, FiltersState } from '../../../../lib/index';

// Initialize filters with dynamic categories
const initializeFilters = (categories: Category[]): FiltersState => ({
    categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        selected: false,
        subcategories: category.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            selected: false,
        })),
    })),
    availability: [
        { id: 1, name: { en: 'In Stock', ar: 'متوفر' }, stars: 0, selected: false },
        { id: 2, name: { en: 'Out of Stock', ar: 'غير متوفر' }, stars: 0, selected: false },
    ],
    ratings: [
        { id: 5, name: { en: '5 Stars', ar: '5 نجوم' }, stars: 5, selected: false },
        { id: 4, name: { en: '4 Stars', ar: '4 نجوم' }, stars: 4, selected: false },
        { id: 3, name: { en: '3 Stars', ar: '3 نجوم' }, stars: 3, selected: false },
        { id: 2, name: { en: '2 Stars', ar: '2 نجوم' }, stars: 2, selected: false },
        { id: 1, name: { en: '1 Star', ar: '1 نجمة' }, stars: 1, selected: false },
        { id: 0, name: { en: '0 Stars', ar: '0 نجوم' }, stars: 0, selected: false },
    ],
    bestSelling: false,
});

export default function ProductsPage() {
const t = useTranslations('');
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = pathname.split('/')[1] as 'en' | 'ar';
    const { allProducts, isLoading, setCategoryIds } = useProducts();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<FiltersState>(initializeFilters([]));
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

 // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
                setFilters(initializeFilters(fetchedCategories));
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
                setFilters(initializeFilters([]));
            }
        };
        loadCategories();
    }, []);

    // Pre-select category from localStorage
    useEffect(() => {
        const category = localStorage.getItem('selectedCategory')?.toLowerCase();
        if (category && categories.length > 0) {
            setFilters((prev) => {
                const updatedFilters = {
                    ...prev,
                    categories: prev.categories.map((c) => {
                        const isMainCategoryMatch = c.name.en.toLowerCase() === category || c.name.ar.toLowerCase() === category;
                        const matchedSubcategory = c.subcategories.find(
                            (s) => s.name.en.toLowerCase() === category || s.name.ar.toLowerCase() === category
                        );
                        if (isMainCategoryMatch) {
                            return {
                                ...c,
                                selected: true,
                                subcategories: c.subcategories.map((s) => ({ ...s, selected: true })),
                            };
                        } else if (matchedSubcategory) {
                            return {
                                ...c,
                                selected: false,
                                subcategories: c.subcategories.map((s) => ({
                                    ...s,
                                    selected: s.id === matchedSubcategory.id,
                                })),
                            };
                        }
                        return c;
                    }),
                    availability: prev.availability.map((a) => ({ ...a, selected: false })),
                    ratings: prev.ratings.map((r) => ({ ...r, selected: false })),
                    bestSelling: false,
                };
                return updatedFilters;
            });
        }
    }, [categories]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Update category IDs for backend filtering whenever filters change
    const updateCategoryIds = (filters: FiltersState) => {
        // Collect IDs of selected main categories and subcategories
        const selectedCategoryIds: number[] = [];
        filters.categories.forEach((category) => {
            if (category.selected) {
                selectedCategoryIds.push(category.id);
            }
            category.subcategories.forEach((sub) => {
                if (sub.selected) {
                    selectedCategoryIds.push(sub.id);
                }
            });
        });
        // Update ProductContext with selected category IDs
        setCategoryIds(selectedCategoryIds);
    };
    // Update category IDs for backend filtering
    useEffect(() => {
        const selectedCategoryIds: number[] = [];
        filters.categories.forEach((category) => {
            if (category.selected) {
                selectedCategoryIds.push(category.id);
            }
            category.subcategories.forEach((sub) => {
                if (sub.selected) {
                    selectedCategoryIds.push(sub.id);
                }
            });
        });
        setCategoryIds(selectedCategoryIds);
    }, [filters.categories, setCategoryIds]);

    // Trigger category ID update when filters change
    useEffect(() => {
        updateCategoryIds(filters);
    }, [filters.categories]);

    // Apply client-side filters (search, availability, ratings, bestSelling)
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
            result = result.filter((product) => product.rating && selectedRatings.includes(Math.floor(product.rating)));
        }

        // Filter by best selling
        if (filters.bestSelling) {
            result = result.filter((product) => (product.sold_quantity || 0) > 10);
            if (result.length === 0) {
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
                <div className="flex flex-wrap justify-center space-x-6 mb-3">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
                    <Filters filters={filters} setFilters={setFilters} currentLocale={currentLocale} />
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-6 sm:w-[280px] md:w-[90%] mx-auto">
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <div
                                key={product.id}
                                onClick={() => router.push(`/${currentLocale}/products/${product.id}`)}
                                className="cursor-pointer mx-4 max-w-6xl rounded-3xl relative"
                            >
                                <ProductCard product={product} index={index} pageName="products" />
                            </div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 col-span-full text-center py-10"
                        >
                            <p className="text-lg text-[#0f4229]">{t('products.noProducts')}</p>
                            <button
                                onClick={() => {
                                    setFilters(initializeFilters(categories));
                                    localStorage.removeItem('selectedCategory');
                                    setSearchTerm('');
                                    setCategoryIds([]); // Reset category filters in context
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