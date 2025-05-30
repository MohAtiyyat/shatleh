'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const t = useTranslations('');
    
    // Handle page change with scroll to top
    const handlePageChange = useCallback((page: number) => {
        onPageChange(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [onPageChange]);

    // Generate page numbers with ellipsis for large page counts
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav 
            className="flex flex-wrap justify-center mt-6 sm:mt-8 md:mt-10 gap-2 sm:gap-3 md:gap-4 px-4" 
            aria-label="Pagination"
        >
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-[#80ce97] rounded-md text-[#0f4229] hover:bg-[#80ce97]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px] sm:min-w-[100px]"
                aria-label={t('pagination.prev')}
            >
                {t('pagination.prev')}
            </button>

            {getPageNumbers().map((page, index) => (
                typeof page === 'string' ? (
                    <span 
                        key={`ellipsis-${index}`} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-[#0f4229] flex items-center"
                    >
                        {page}
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-md transition-colors duration-200 min-w-[40px] sm:min-w-[48px] ${
                            currentPage === page
                                ? 'bg-[#0f4229] border-[#0f4229] text-white'
                                : 'border-[#80ce97] text-[#0f4229] hover:bg-[#80ce97]/10'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-[#80ce97] rounded-md text-[#0f4229] hover:bg-[#80ce97]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px] sm:min-w-[100px]"
                aria-label={t('pagination.next')}
            >
                {t('pagination.next')}
            </button>
        </nav>
    );
}