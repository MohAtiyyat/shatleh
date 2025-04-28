'use client';

import Link from 'next/link';
import { ChevronRight , ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Fragment, memo } from 'react';

type BreadcrumbProps = {
  pageName: string;
  product?: string;
};

export default memo (function Breadcrumb({ pageName ,product }: BreadcrumbProps) {
  const t = useTranslations('');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'ar';
  const translatedPageName = t(`pages.${pageName.toLocaleLowerCase()}`);
  if (currentLocale === 'ar') {
    return (
      <div className="flex items-center text-sm mb-2">
        <Link href="/" className="text-[#025162]">
          {t('home.title')}
        </Link>
        <ChevronLeft className="h-4 w-4 mx-1 text-[#80ce97]" />
        <Link href={`/${currentLocale}/${pageName}`} className="text-[#025162]">
        <span className="text-[#025162]">{translatedPageName}</span>
        </Link>
        {product && (
          <>
            <ChevronLeft className="h-4 w-4 mx-1 text-[#80ce97]" />
            <span className="text-[#025162]">{product}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm mb-2">
      <Link href="/" className="text-[#025162]">
        {t('home.title')}
      </Link>
      {pathname.split("/").map((path, index) => {
        if (index === 1 || index === 0 || !isNaN(parseInt(path))) {
          return null;
        }
        return (
          <Fragment key={path}>
            <ChevronRight className="h-4 w-4 mx-1 text-[#80ce97]" />
            <Link href={`/${path}`} className="text-[#025162]">
              <span className="text-[#025162]">{path}</span>
            </Link>
          </Fragment>
        );
      })}
      

      {product && (
        <>
        <ChevronRight className="h-4 w-4 mx-1 text-[#80ce97]" />
          <span className="text-[#025162]">{product}</span>
        </>
      )}
    </div>
  );
})