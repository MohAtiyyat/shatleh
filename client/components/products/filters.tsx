'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

type FilterCategory = {
    id: number;
    name: {
        en: string;
        ar: string;
    };
    selected: boolean;
};

type FilterRating = FilterCategory & {
    count: number;
    stars: number;
};

type FiltersProps = {
    currentLocale:string;
    filters: {
        categories: FilterCategory[];
        availability: FilterCategory[];
        ratings: FilterRating[];
        bestSelling: boolean;
        
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            categories: FilterCategory[];
            availability: FilterCategory[];
            ratings: FilterRating[];
            bestSelling: boolean;
        }>
    >;
};

export default function Filterss({ filters, setFilters , currentLocale   }: FiltersProps ) {
    const t = useTranslations('');

    // State for dropdown visibility
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Refs for dropdowns
    const dropdownRefs = {
        category: useRef<HTMLDivElement>(null),
        availability: useRef<HTMLDivElement>(null),
        rating: useRef<HTMLDivElement>(null),
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (openDropdown && dropdownRefs[openDropdown as keyof typeof dropdownRefs]?.current) {
                if (!dropdownRefs[openDropdown as keyof typeof dropdownRefs].current?.contains(event.target as Node)) {
                    setOpenDropdown(null);
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    // Toggle dropdown visibility
    const toggleDropdown = (dropdown: string) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };

    // Toggle filter selection
    const toggleFilter = (type: 'categories' | 'availability' | 'ratings', id: number) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type].map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
        }));
    };

    // Toggle best selling filter
    const toggleBestSelling = () => {
        
        setFilters((prev) => ({
            ...prev,
            bestSelling: !prev.bestSelling,
        }));
    };

    // Clear filter
    const clearFilter = (type: 'categories' | 'availability' | 'ratings' | 'bestSelling', id?: number) => {
        if (type === 'bestSelling') {
            setFilters((prev) => ({
                ...prev,
                bestSelling: false,
            }));
        } else if (id !== undefined) {
            setFilters((prev) => ({
                ...prev,
                [type]: prev[type].map((item) => (item.id === id ? { ...item, selected: false } : item)),
            }));
        }
    };

    // Get selected filters count
    const getSelectedCount = (type: 'categories' | 'availability' | 'ratings') => {
        return filters[type].filter((item) => item.selected).length;
    };

    // Get selected filters names
    const getSelectedNames = (type: 'categories' | 'availability' | 'ratings') => {
        return filters[type].filter((item) => item.selected).map((item) => currentLocale === "ar" ? item.name.ar : item.name.en);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            categories: filters.categories.map((c) => ({ ...c, selected: false })),
            availability: filters.availability.map((a) => ({ ...a, selected: false })),
            ratings: filters.ratings.map((r) => ({ ...r, selected: false })),
            bestSelling: false,
        });
    };

    // Check if any filters are applied
    const hasActiveFilters = () => {
        return (
            filters.categories.some((c) => c.selected) ||
            filters.availability.some((a) => a.selected) ||
            filters.ratings.some((r) => r.selected) ||
            filters.bestSelling
        );
    };

    return (
        <>
            {/* Filter Dropdowns */}
            <div className={`flex flex-wrap items-center gap-3 mb-4  justify-center ${currentLocale === "ar" ? "ml-10" : "mr-10"}`}>
                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRefs.category}>
                    <button
                        onClick={() => toggleDropdown('category')}
                        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                    >
                        {getSelectedCount('categories') > 0 ? (
                            <span className="truncate max-w-[100px]">{getSelectedNames('categories').join(', ')}</span>
                        ) : (
                            <span>{t('products.category')}</span>
                        )}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === 'category' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-1 container-fluid bg-white border border-[#80ce97] rounded-md shadow-lg z-10"
                        >
                            <div className="p-2 space-y-2">
                                {filters.categories.map((category) => (
                                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={category.selected}
                                            onChange={() => toggleFilter('categories', category.id)}
                                            className="rounded border-[#80ce97]"
                                        />
                                        <span className="text-[#414141] whitespace-nowrap">{currentLocale === 'ar' ? category.name.ar : category.name.en}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Best selling Button */}
                <button
                    onClick={toggleBestSelling} 
                    className={`flex items-center justify-center px-4 py-2 border rounded-md min-w-[150px] ${filters.bestSelling
                            ? 'bg-[#80ce97] text-white border-[#80ce97]'
                            : 'bg-white text-[#0f4229] border-[#80ce97]'
                        }`}
                >
                    <span>{t('products.bestSelling')}</span>
                </button>

                {/* Availability Dropdown */}
                <div className="relative" ref={dropdownRefs.availability}>
                    <button
                        onClick={() => toggleDropdown('availability')}
                        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                    >
                        {getSelectedCount('availability') > 0 ? (
                            <span className="truncate max-w-[100px]">{getSelectedNames('availability').join(', ')}</span>
                        ) : (
                            <span>{t('products.availability')}</span>
                        )}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === 'availability' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#80ce97] rounded-md shadow-lg z-10"
                        >
                            <div className="p-2 space-y-2">
                                {filters.availability.map((item) => (
                                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleFilter('availability', item.id)}
                                            className="rounded border-[#80ce97]"
                                        />
                                        <span className="text-[#414141]">{currentLocale === 'ar' ? item.name.ar : item.name.en}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Rating Dropdown */}
                <div className="relative" ref={dropdownRefs.rating}>
                    <button
                        onClick={() => toggleDropdown('rating')}
                        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                    >
                        {getSelectedCount('ratings') > 0 ? (
                            <span className="truncate max-w-[100px]">{getSelectedNames('ratings').join(', ')}</span>
                        ) : (
                            <span>{t('products.rating')}</span>
                        )}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown === 'rating' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#80ce97] rounded-md shadow-lg z-10"
                        >
                            <div className="p-2 space-y-2">
                                {filters.ratings.map((rating) => (
                                    <label
                                        key={rating.id}
                                        className="flex items-center justify-between cursor-pointer p-1 hover:bg-[#e8f5e9]/50 rounded"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={rating.selected}
                                                onChange={() => toggleFilter('ratings', rating.id)}
                                                className="rounded border-[#80ce97]"
                                            />
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < rating.stars ? 'text-[#e75313] fill-[#e75313]' : 'text-[#e5e5e5]'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-[#414141]">{rating.count}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Filter Button */}
                {/* <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#43bb67] text-white rounded-md"
                    onClick={() => {
                        setOpenDropdown(null);
                    }}
                >
                    <Filter className="h-4 w-4" />
                    <span>{t('products.filter')}</span>
                </button> */}
            </div>

            {/* Selected Filters */}
            {hasActiveFilters() && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-wrap items-center gap-2 mb-6"
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        {/* Selected category filters */}
                        {filters.categories
                            .filter((item) => item.selected)
                            .map((item) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    key={`category-${item.id}`}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                                >
                                    <span>{currentLocale === 'ar' ? item.name.ar : item.name.en}</span>
                                    <button
                                        onClick={() => clearFilter('categories', item.id)}
                                        className="text-[#0f4229] hover:text-[#e75313]"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ))}

                        {/* Selected availability filters */}
                        {filters.availability
                            .filter((item) => item.selected)
                            .map((item) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    key={`availability-${item.id}`}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                                >
                                    <span>{currentLocale === 'ar' ? item.name.ar : item.name.en}</span>
                                    <button
                                        onClick={() => clearFilter('availability', item.id)}
                                        className="text-[#0f4229] hover:text-[#e75313]"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ))}

                        {/* Selected rating filters */}
                        {filters.ratings
                            .filter((item) => item.selected)
                            .map((item) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    key={`rating-${item.id}`}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                                >
                                    <span>{currentLocale === 'ar' ? item.name.ar : item.name.en}</span>
                                    <button
                                        onClick={() => clearFilter('ratings', item.id)}
                                        className="text-[#0f4229] hover:text-[#e75313]"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ))}

                        {/* Best selling filter */}
                        {filters.bestSelling && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                            >
                                <span>{t('products.bestSelling')}</span>
                                <button
                                    onClick={() => clearFilter('bestSelling')}
                                    className="text-[#0f4229] hover:text-[#e75313]"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                    <button onClick={clearAllFilters} className="text-sm text-[#e75313] hover:underline">
                        {t('products.clearAll')}
                    </button>
                </motion.div>
            )}
        </>
    );
}