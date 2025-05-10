'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FiltersState } from '../../lib/index';

interface FiltersProps {
    currentLocale: 'en' | 'ar';
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export default function Filters({ filters, setFilters, currentLocale }: FiltersProps) {
    const t = useTranslations('');

    // State for dropdown visibility
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Ref for category dropdown
    const categoryRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (openDropdown === 'category' && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setOpenDropdown(openDropdown === 'category' ? null : 'category');
    };

    // Toggle category or subcategory selection
    const toggleCategory = (categoryId: number, subcategoryId?: number) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((category) => {
                if (category.id === categoryId) {
                    if (subcategoryId) {
                        // Toggle subcategory
                        return {
                            ...category,
                            subcategories: category.subcategories.map((sub) =>
                                sub.id === subcategoryId ? { ...sub, selected: !sub.selected } : sub
                            ),
                        };
                    } else {
                        // Toggle main category and all subcategories
                        const newSelected = !category.selected;
                        return {
                            ...category,
                            selected: newSelected,
                            subcategories: category.subcategories.map((sub) => ({
                                ...sub,
                                selected: newSelected,
                            })),
                        };
                    }
                }
                return category;
            }),
        }));
    };

    // Clear filter
    const clearFilter = (id: number, subcategoryId?: number) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.map((category) => {
                if (category.id === id) {
                    if (subcategoryId) {
                        return {
                            ...category,
                            subcategories: category.subcategories.map((sub) =>
                                sub.id === subcategoryId ? { ...sub, selected: false } : sub
                            ),
                        };
                    }
                    return {
                        ...category,
                        selected: false,
                        subcategories: category.subcategories.map((sub) => ({ ...sub, selected: false })),
                    };
                }
                return category;
            }),
        }));
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
        }));
    };

    // Get selected filters count
    const getSelectedCount = () => {
        return filters.categories.reduce((count, category) => {
            const subCount = category.subcategories.filter((sub) => sub.selected).length;
            return count + (category.selected ? 1 : 0) + subCount;
        }, 0);
    };

    // Get selected filters names
    const getSelectedNames = () => {
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
    };

    // Check if any filters are applied
    const hasActiveFilters = () => {
        return filters.categories.some((c) => c.selected || c.subcategories.some((s) => s.selected));
    };

    return (
        <>
            {/* Category Dropdown */}
            <div className={`flex justify-center mb-4 ${currentLocale === 'ar' ? 'ml-10' : 'mr-10'}`}>
                <div className="relative" ref={categoryRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#80ce97] rounded-md text-[#0f4229] min-w-[150px]"
                        aria-expanded={openDropdown === 'category'}
                        aria-label={t('products.category')}
                    >
                        {getSelectedCount() > 0 ? (
                            <span className="truncate max-w-[100px]">{getSelectedNames().join(', ')}</span>
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
                                        onClick={() => clearFilter(category.id, sub.id)}
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