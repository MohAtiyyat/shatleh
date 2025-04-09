'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const t = useTranslations('home');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    
    <div className="container mx-auto max-w-3xl px-4 py-12 text-center ">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {t('welcome') }{" "} { t('title') }
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('description')}
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          href={`/${currentLocale}/products`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {t('shopNow')}
        </Link>
        <Link
          href={`/${currentLocale}/service`}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t('requestService')}
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {t('welcome') }{" "} { t('title') }
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('description')}
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          href={`/${currentLocale}/products`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {t('shopNow')}
        </Link>
        <Link
          href={`/${currentLocale}/service`}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t('requestService')}
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {t('welcome') }{" "} { t('title') }
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('description')}
      </p>
      
    </div>
  );
}