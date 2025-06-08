// components/products/filters.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FiltersState } from '../../lib/index';

interface FiltersProps {
    currentLocale: 'en' | 'ar';
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export default function Filters({ filters, setFilters, currentLocale }: FiltersProps) {
    const t = useTranslations('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Refs for dropdowns to handle click outside
    const dropdownRefs = {
        category: useRef<HTMLDivElement>(null),
        availability: useRef<HTMLDivElement>(null),
        rating: useRef<HTMLDivElement>(null),
    };

    // Close dropdown when clicking outside
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
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    // Toggle category or subcategory selection
    const toggleCategory = (categoryId: number, subcategoryId?: number) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((category) => {
                if (category.id === categoryId) {
                    if (subcategoryId) {
                        // Handle subcategory toggle
                        const updatedSubcategories = category.subcategories.map((sub) =>
                            sub.id === subcategoryId ? { ...sub, selected: !sub.selected } : sub
                        );
                        // Check if all subcategories are selected to update main category
                        const allSubcategoriesSelected = updatedSubcategories.every((sub) => sub.selected);
                        return {
                            ...category,
                            selected: allSubcategoriesSelected,
                            subcategories: updatedSubcategories,
                        };
                    } else {
                        // Handle main category toggle
                        const newSelected = !category.selected;
                        return {
                            ...category,
                            selected: newSelected,
                            subcategories: category.subcategories.map((sub) => ({
                                ...sub,
                                selected: newSelected, // Select/deselect all subcategories
                            })),
                        };
                    }
                }
                return category;
            }),
        }));
    };

    // Toggle other filters (availability, ratings)
    const toggleFilter = (type: 'availability' | 'ratings', id: number) => {
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

    // Clear specific filter
    const clearFilter = (
        type: 'categories' | 'availability' | 'ratings' | 'bestSelling',
        id?: number,
        subcategoryId?: number
    ) => {
        if (type === 'bestSelling') {
            setFilters((prev) => ({
                ...prev,
                bestSelling: false,
            }));
        } else if (type === 'categories' && id !== undefined) {
            setFilters((prev) => ({
                ...prev,
                categories: prev.categories.map((category) => {
                    if (category.id === id) {
                        if (subcategoryId) {
                            // Clear specific subcategory
                            const updatedSubcategories = category.subcategories.map((sub) =>
                                sub.id === subcategoryId ? { ...sub, selected: false } : sub
                            );
                            return {
                                ...category,
                                selected: false, // Main category is deselected if any subcategory is cleared
                                subcategories: updatedSubcategories,
                            };
                        }


                        return {
                            ...category,
                            selected: false,
                            subcategories: category.subcategories.map((sub) => ({ ...sub, selected: false })),
                        }
                    };
                    localStorage.removeItem('selectedCategory');
                    return category;
                }),
            }));
        } else if (id !== undefined) {
            setFilters((prev) => ({
                ...prev,
                [type]: prev[type].map((item) => (item.id === id ? { ...item, selected: false } : item)),
            }));
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((c) => ({
                ...c,
                selected: false,
                subcategories: c.subcategories.map((s) => ({ ...s, selected: false })),
            })),
            availability: prev.availability.map((a) => ({ ...a, selected: false })),
            ratings: prev.ratings.map((r) => ({ ...r, selected: false })),
            bestSelling: false,
        }));
        localStorage.removeItem('selectedCategory');

    };

    // Get count of selected filters
    const getSelectedCount = (type: 'categories' | 'availability' | 'ratings') => {
        if (type === 'categories') {
            return filters.categories.reduce((count, category) => {
                const subCount = category.subcategories.filter((sub) => sub.selected).length;
                return count + (category.selected ? 1 : 0) + subCount;
            }, 0);
        }
        return filters[type].filter((item) => item.selected).length;
    };

    // Get names of selected filters
    const getSelectedNames = (type: 'categories' | 'availability' | 'ratings') => {
        if (type === 'categories') {
            const names: string[] = [];
            filters.categories.forEach((category) => {
                if (category.selected) {
                    names.push(currentLocale === 'ar' ? category.name.ar : category.name.en);
                }
                category.subcategories.forEach((sub) => {
                    if (sub.selected) {
                        names.push(currentLocale === 'ar' ? sub.name.ar : sub.name.en);
                    }
                });
            });
            return names;
        }
        return filters[type]
            .filter((item) => item.selected)
            .map((item) => (currentLocale === 'ar' ? item.name.ar : item.name.en));
    };

    // Check if any filters are applied
    const hasActiveFilters = () => {
        return (
            filters.categories.some((c) => c.selected || c.subcategories.some((s) => s.selected)) ||
            filters.availability.some((a) => a.selected) ||
            filters.ratings.some((r) => r.selected) ||
            filters.bestSelling
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRefs.category}>
                    <button
                        onClick={() => toggleDropdown('category')}
                        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                        aria-expanded={openDropdown === 'category'}
                        aria-label={t('products.category')}
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
                            className="absolute top-full left-0 mt-1 bg-white border border-[#80ce97] rounded-md shadow-lg z-10 min-w-[200px]"
                            role="menu"
                            aria-label={t('products.categoryOptions')}
                        >
                            <div className="p-2 space-y-2">
                                {filters.categories.map((category) => (
                                    <div key={category.id}>
                                        {/* Main category checkbox */}
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={category.selected}
                                                onChange={() => toggleCategory(category.id)}
                                                className="rounded border-[#80ce97]"
                                                aria-label={currentLocale === 'ar' ? category.name.ar : category.name.en}
                                            />
                                            <span className="text-[#414141] font-medium">
                                                {currentLocale === 'ar' ? category.name.ar : category.name.en}
                                            </span>
                                        </label>
                                        {/* Subcategories */}
                                        {category.subcategories.length > 0 && (
                                            <div className="mx-6 space-y-1">
                                                {category.subcategories.map((subcategory) => (
                                                    <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={subcategory.selected}
                                                            onChange={() => toggleCategory(category.id, subcategory.id)}
                                                            className="rounded border-[#80ce97]"
                                                            aria-label={currentLocale === 'ar' ? subcategory.name.ar : subcategory.name.en}
                                                        />
                                                        <span className="text-[#414141]">
                                                            {currentLocale === 'ar' ? subcategory.name.ar : subcategory.name.en}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Best Selling Button */}
                <button
                    onClick={toggleBestSelling}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md min-w-[150px] ${filters.bestSelling
                        ? 'bg-[#80ce97] text-white border-[#80ce97]'
                        : 'bg-white text-[#0f4229] border-[#80ce97]'
                        }`}
                    aria-label={t('products.bestSelling')}
                >
                    <span>{t('products.bestSelling')}</span>
                </button>

                {/* Availability Dropdown */}
                <div className="relative" ref={dropdownRefs.availability}>
                    <button
                        onClick={() => toggleDropdown('availability')}
                        className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                        aria-expanded={openDropdown === 'availability'}
                        aria-label={t('products.availability')}
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
                            className="absolute top-full left-0 mt-1 bg-white border border-[#80ce97] rounded-md shadow-lg z-10 min-w-[150px]"
                            role="menu"
                            aria-label={t('products.availabilityOptions')}
                        >
                            <div className="p-2 space-y-2">
                                {filters.availability.map((item) => (
                                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleFilter('availability', item.id)}
                                            className="rounded border-[#80ce97]"
                                            aria-label={currentLocale === 'ar' ? item.name.ar : item.name.en}
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
                        aria-expanded={openDropdown === 'rating'}
                        aria-label={t('products.rating')}
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
                            className="absolute top-full left-0 mt-1 bg-white border border-[#80ce97] rounded-md shadow-lg z-10 min-w-[200px]"
                            role="menu"
                            aria-label={t('products.ratingOptions')}
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
                                                aria-label={currentLocale === 'ar' ? rating.name.ar : rating.name.en}
                                            />
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < rating.stars ? 'text-[#e75313] fill-[#e75313]' : 'text-[#e5e5e5]'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Selected Filters */}
            {hasActiveFilters() && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-wrap items-center gap-2 mb-6"
                >
                    {/* Selected category filters */}
                    {filters.categories.map((category) =>
                        category.selected ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                key={`category-${category.id}`}
                                className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                            >
                                <span>{currentLocale === 'ar' ? category.name.ar : category.name.en}</span>
                                <button
                                    onClick={() => clearFilter('categories', category.id)}
                                    className="text-[#0f4229] hover:text-[#e75313]"
                                    aria-label={t('products.removeFilter', {
                                        name: currentLocale === 'ar' ? category.name.ar : category.name.en,
                                    })}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </motion.div>
                        ) : null
                    )}
                    {filters.categories.map((category) =>
                        category.subcategories
                            .filter((sub) => sub.selected)
                            .map((sub) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    key={`subcategory-${sub.id}`}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#80ce97]/20 rounded-full text-sm"
                                >
                                    <span>{currentLocale === 'ar' ? sub.name.ar : sub.name.en}</span>
                                    <button
                                        onClick={() => clearFilter('categories', category.id, sub.id)}
                                        className="text-[#0f4229] hover:text-[#e75313]"
                                        aria-label={t('products.removeFilter', {
                                            name: currentLocale === 'ar' ? sub.name.ar : sub.name.en,
                                        })}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ))
                    )}

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
                                    aria-label={t('products.removeFilter', {
                                        name: currentLocale === 'ar' ? item.name.ar : item.name.en,
                                    })}
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
                                    aria-label={t('products.removeFilter', {
                                        name: currentLocale === 'ar' ? item.name.ar : item.name.en,
                                    })}
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
                                aria-label={t('products.removeFilter', { name: t('products.bestSelling') })}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </motion.div>
                    )}

                    {/* Clear All Button */}
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#e75313] hover:underline"
                        aria-label={t('products.clearAll')}
                    >
                        {t('products.clearAll')}
                    </button>
                </motion.div>
            )}
        </div>
    );
}