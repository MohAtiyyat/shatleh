'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PostFiltersState } from '../../lib/index';

interface FiltersProps {
    currentLocale: 'en' | 'ar';
    filters: PostFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<PostFiltersState>>;
}

export default function Filters({ filters, setFilters, currentLocale }: FiltersProps) {
    const t = useTranslations('');
    const [openDropdown, setOpenDropdown] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
    };

    // Toggle category selection
    const toggleCategory = (categoryId: number) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((category) =>
                category.id === categoryId ? { ...category, selected: !category.selected } : category
            ),
        }));
    };

    // Clear category filter
    const clearFilter = (categoryId: number) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((category) =>
                category.id === categoryId ? { ...category, selected: false } : category
            ),
        }));
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((c) => ({ ...c, selected: false })),
        }));
    };

    // Get selected filters count
    const getSelectedCount = () => {
        return filters.categories.filter((category) => category.selected).length;
    };

    // Get selected filters names
    const getSelectedNames = () => {
        return filters.categories
            .filter((category) => category.selected)
            .map((category) => (currentLocale === 'ar' ? category.name.ar : category.name.en));
    };

    // Check if any filters are applied
    const hasActiveFilters = () => {
        return filters.categories.some((c) => c.selected);
    };

    return (
        <>
            {/* Category Dropdown */}
            <div className={`flex justify-center mb-4 mx-5`}>
                <div className="relative" ref={categoryRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                        aria-expanded={openDropdown}
                        aria-label={t('products.category')}
                    >
                        {getSelectedCount() > 0 ? (
                            <span className="truncate max-w-[100px]">{getSelectedNames().join(', ')}</span>
                        ) : (
                            <span>{t('products.category')}</span>
                        )}
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {openDropdown && (
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
                                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={category.selected}
                                            onChange={() => toggleCategory(category.id)}
                                            className="rounded border-[#80ce97]"
                                            aria-label={currentLocale === 'ar' ? category.name.ar : category.name.en}
                                        />
                                        <span className="text-[#414141]">
                                            {currentLocale === 'ar' ? category.name.ar : category.name.en}
                                        </span>
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
                    className="flex flex-wrap items-center gap-2 mb-6 justify-center"
                >
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
                                    onClick={() => clearFilter(category.id)}
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
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#e75313] hover:underline"
                        aria-label={t('products.clearAll')}
                    >
                        {t('products.clearAll')}
                    </button>
                </motion.div>
            )}
        </>
    );
}