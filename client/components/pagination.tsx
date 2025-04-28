'use client';

import { useTranslations } from 'next-intl';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const t = useTranslations('');

    return (
        <div className="flex justify-center mt-10 space-x-2">
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#80ce97] rounded-md text-[#0f4229] hover:bg-[#80ce97]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('pagination.prev')}
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`px-4 py-2 border rounded-md ${currentPage === index + 1
                            ? 'bg-[#0f4229] border-[#0f4229] text-white'
                            : 'border-[#80ce97] text-[#0f4229] hover:bg-[#80ce97]/10'
                        }`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[#80ce97] rounded-md text-[#0f4229] hover:bg-[#80ce97]/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {t('pagination.next')}
            </button>
        </div>
    );
}