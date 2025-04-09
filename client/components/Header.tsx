'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const isAuthenticated = true;
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [language, setLanguage] = useState('');
    const currentLocale = pathname.split('/')[1] || 'en';

    useEffect(() => {
        setLanguage(currentLocale);
    }, [currentLocale]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

    const switchLanguage = (locale: string) => {
        const newPath = pathname.replace(/^\/(en|ar)/, `/${locale}`);
        router.push(newPath);
    };

    const navItems = [
        { label: t('header.products'), href: `/${currentLocale}/products` },
        { label: t('header.blog'), href: `/${currentLocale}/blog` },
        { label: t('header.services'), href: `/${currentLocale}/services` },
        { label: t('header.about'), href: `/${currentLocale}/about` },
    ];

    return (
        <header className="container-fluid w-full bg-primary text-text-primary border-b border-accent shadow-md transition-all duration-300 ease-in-out animate-header md:px-6 sm:px-0">
            <div className="container-fluid  px-2 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href={`/${currentLocale}`} className="text-4xl font-bold tracking-tight hover:text-text-hover transition-colors">
                        {t('title')}
                    </Link>
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href} className="nav-item hover:text-text-hover transition-colors" onClick={() => setIsOpen(false)}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-row items-center space-x-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <button
                            className={`lang-toggle animate-lang ${language === 'en' ? 'lang-toggle-active' : ''} hover:text-text-hover cursor-pointer`}
                            onClick={() => switchLanguage('en')}
                        >
                            <span>EN</span>
                        </button>
                        <span className="mx-2 text-gray-500">|</span>
                        <button
                            className={`lang-toggle animate-lang ${language === 'ar' ? 'lang-toggle-active' : ''} hover:text-text-hover cursor-pointer`}
                            onClick={() => switchLanguage('ar')}
                        >
                            <span>AR</span>
                        </button>
                    </label>
                    <div className='relative'>
                        <Link href={`/${currentLocale}/cart`} className="md:flex hidden mx-4">
                            <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
                            <span className='absolute -top-2 left-7 w-5 h-5 bg-accent text-white  rounded-full flex items-center justify-center bg-red-400 border-2  p-2 text-xs'>2</span>
                        </Link>
                    </div>

                    {isAuthenticated && (
                        <div className="relative" dir="ltr">
                            <button onClick={toggleUserMenu} className="focus:outline-none">
                                <img
                                    src="/static/images/avatar/2.jpg"
                                    alt="User"
                                    className="w-10 h-10 rounded-full border-2 border-accent"
                                />
                            </button>
                            {userMenuOpen && (
                                <div className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} mt-2 w-48 bg-white text-text-primary rounded-md shadow-lg`}>
                                    <Link href={`/${currentLocale}/account`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('profile.account')}
                                    </Link>
                                    <Link href={`/${currentLocale}/address`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('profile.address')}
                                    </Link>
                                    <Link href={`/${currentLocale}/payments`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('profile.payments')}
                                    </Link>
                                    <Link href={`/${currentLocale}/orders`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('profile.myOrders')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            toggleUserMenu();
                                            // Add logout logic here
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        {t('profile.signOut')}
                                    </button>

                                </div>
                            )}
                        </div>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link href={`/${currentLocale}/login`} className="nav-item hidden md:flex">
                                {t('header.login')}
                            </Link>
                            <Link href={`/${currentLocale}/register`} className="nav-item hidden md:flex">
                                {t('header.signup')}
                            </Link>
                        </>
                    )}
                    <button className="md:hidden focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <nav className="md:hidden px-4 py-4 bg-primary">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href} className="nav-item" onClick={toggleMenu}>
                                {item.label}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                <Link href={`/${currentLocale}/orders`} className="nav-item" onClick={toggleMenu}>
                                    {t('profile.myOrders')}
                                </Link>
                                <button
                                    onClick={() => {
                                        toggleMenu();
                                        // Add logout logic here
                                    }}
                                    className={`nav-item ${language === 'ar' ? "text-right" : "text-left"} `}
                                >
                                    {t('profile.signOut')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href={`/${currentLocale}/login`} className="nav-item" onClick={toggleMenu}>
                                    {t('header.login')}
                                </Link>
                                <Link href={`/${currentLocale}/register`} className="nav-item" onClick={toggleMenu}>
                                    {t('header.signup')}

                                </Link>
                            </>
                        )}
                        <div className='relative  py-2 nav-item'>
                            <Link href={`/${currentLocale}/cart`} className="md:hidden flex mx-4">
                                <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
                                <span className={`absolute -top-0 ${language === 'ar' ? 'right-1' : 'left-7'} w-5 h-5 bg-accent text-white  rounded-full flex items-center justify-center bg-red-400 border-2  p-2 text-xs`}>2</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;