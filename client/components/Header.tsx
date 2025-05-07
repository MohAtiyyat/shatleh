
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '../lib/store';
import { useAuth } from '../lib/AuthContext'; 

const Header = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [language, setLanguage] = useState('');
    const currentLocale = pathname.split('/')[1] || 'en';
    const { items, syncWithBackend } = useCartStore();

    const cartQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);

    useEffect(() => {
        setLanguage(currentLocale);
        syncWithBackend(currentLocale).catch((error) => {
            console.error('Failed to sync cart on locale change:', error);
        });
    }, [currentLocale, syncWithBackend]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

    const switchLanguage = () => {
        const newLocale = currentLocale === 'en' ? 'ar' : 'en';
        const newPath = pathname.replace(/^\/(en|ar)/, `/${newLocale}`);
        router.push(newPath);
    };

    const handleLogout = () => {
        logout();
        toggleUserMenu();
    };

    const navItems = [
        { label: t('header.products'), href: `/${currentLocale}/products` },
        { label: t('header.blog'), href: `/${currentLocale}/blog` },
        { label: t('header.services'), href: `/${currentLocale}/services` },
        { label: t('header.about'), href: `/${currentLocale}/about` },
    ];

    return (
        <header className="w-full text-text-primary h-[10vh] shadow-md transition-all duration-300 ease-in-out animate-header md:px-6 sm:px-6 sticky z-50 top-0 bg-[var(--primary-bg)]">
            <div className="px-4 flex justify-between items-center h-full">
                <div className="flex items-center space-x-6">
                    <Link href={`/${currentLocale}`} className="flex items-center">
                        <Image
                            src="/header logo.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                            className="w-30 h-30"
                            priority
                        />
                    </Link>
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="nav-item hover:text-text-hover transition-colors flex flex-row items-center whitespace-nowrap"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="inline-flex">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-row items-center space-x-4">
                    <button
                        className="lang-toggle animate-lang hover:text-text-hover cursor-pointer px-3 py-1 rounded-md transition-colors"
                        onClick={switchLanguage}
                    >
                        <span>{currentLocale === 'en' ? 'عربي' : 'English'}</span>
                    </button>
                    <div className="relative">
                        <Link href={`/${currentLocale}/cart`} className="md:flex hidden mx-4">
                            <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
                            <span className="absolute -top-2 left-7 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center bg-red-400 border-2 p-2 text-xs">
                                {cartQuantity}
                            </span>
                        </Link>
                    </div>

                    {isAuthenticated && (
                        <div className="relative" dir="ltr">
                            <button onClick={toggleUserMenu} className="focus:outline-none">
                                <Image
                                    width={10}
                                    height={10}
                                    src="https://images.pexels.com/photos/3198639/pexels-photo-3198639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="User"
                                    className="w-10 h-10 rounded-full border-2 border-accent"
                                />
                            </button>
                            {userMenuOpen && (
                                <div className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} z-50 mt-2 w-48 bg-white text-text-primary rounded-md shadow-lg`}>
                                    <Link
                                        href={`/${currentLocale}/account`}
                                        className="block px-4 py-2 hover:bg-gray-100 items-center whitespace-nowrap"
                                        onClick={toggleUserMenu}
                                    >
                                        <span className="inline-flex">{t('user.account')}</span>
                                    </Link>
                                    <Link
                                        href={`/${currentLocale}/address`}
                                        className="block px-4 py-2 hover:bg-gray-100 items-center whitespace-nowrap"
                                        onClick={toggleUserMenu}
                                    >
                                        <span className="inline-flex">{t('user.address')}</span>
                                    </Link>
                                    <Link
                                        href={`/${currentLocale}/payments`}
                                        className="block px-4 py-2 hover:bg-gray-100 items-center whitespace-nowrap"
                                        onClick={toggleUserMenu}
                                    >
                                        <span className="inline-flex">{t('user.payments')}</span>
                                    </Link>
                                    <Link
                                        href={`/${currentLocale}/orders`}
                                        className="block px-4 py-2 hover:bg-gray-100 items-center whitespace-nowrap"
                                        onClick={toggleUserMenu}
                                    >
                                        <span className="inline-flex">{t('user.myOrders')}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 items-center whitespace-nowrap"
                                    >
                                        <span className="inline-flex">{t('user.logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link
                                href={`/${currentLocale}/login`}
                                className="nav-item hidden md:flex items-center whitespace-nowrap"
                            >
                                <span className="inline-flex">{t('header.login')}</span>
                            </Link>
                            <Link
                                href={`/${currentLocale}/register`}
                                className="nav-item hidden md:flex items-center whitespace-nowrap"
                            >
                                <span className="inline-flex">{t('header.signup')}</span>
                            </Link>
                        </>
                    )}
                    <button
                        className={`md:hidden focus:outline-none ${currentLocale === 'ar' ? ' pr-3' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
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
                <nav className="md:hidden bg-[var(--primary-bg)] border-t border-accent absolute top-[10vh] left-0 w-full px-4 py-4 shadow-md">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="nav-item flex flex-row items-center whitespace-nowrap"
                                onClick={toggleMenu}
                            >
                                <span className="inline-flex">{item.label}</span>
                            </Link>
                        ))}
                        <div className="relative py-2 nav-item">
                            <Link href={`/${currentLocale}/cart`} className="md:hidden flex mx-4">
                                <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
                                <span
                                    className={`absolute -top-0 ${language === 'ar' ? 'right-1' : 'left-7'} w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center bg-red-400 border-2 p-2 text-xs`}
                                >
                                    {cartQuantity}
                                </span>
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;