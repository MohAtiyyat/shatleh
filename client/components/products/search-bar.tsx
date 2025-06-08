'use client';

import type React from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
};

export default function SearchBar({ searchTerm, setSearchTerm, onSearch }: SearchBarProps) {
  const t = useTranslations('');

  const pathName = usePathname();
  const currentLocal  = pathName.split("/")[1]  || 'ar';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative sm:max-w-xl md:min-w-xl    mb-2 ">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('products.searchPlaceholder')}
        className="w-full py-3 px-4 pr-12 rounded-md border border-[#80ce97]/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#80ce97]"
      />
      <button
        onClick={onSearch}
        className={`absolute top-6 -translate-y-1/2 bg-[#80ce97] p-2 rounded-full ${currentLocal === "ar" ? "left-1" : "right-1"}   `}
      >
        <Search  className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}