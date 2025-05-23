'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '../lib/store';
import { useAuth } from '../lib/AuthContext';
import { fetchProfile } from '../lib/api';

interface Profile {
    first_name: string;
    last_name: string;
    photo: string | null;
}

const Header = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, userId, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [authMenuOpen, setAuthMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const currentLocale = pathname.split('/')[1] || 'en';
    const { items, syncWithBackend } = useCartStore();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const authMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const cartQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);

    useEffect(() => {
        const loadProfile = async () => {
            if (isAuthenticated && userId) {
                try {
                    const profileData = await fetchProfile();
                    setProfile({
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        photo: profileData.photo
                    });
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
        };
        loadProfile();
    }, [isAuthenticated, userId]);

    useEffect(() => {
        if (userId) {
            syncWithBackend(userId, currentLocale).catch((error) => {
                console.error('Failed to sync cart on locale change:', error);
            });
        }
    }, [currentLocale, syncWithBackend, userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
            if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
                setAuthMenuOpen(false);
            }
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
    const toggleLangMenu = () => setLangMenuOpen(!langMenuOpen);
    const toggleAuthMenu = () => setAuthMenuOpen(!authMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const switchLanguage = (newLocale: string) => {
        const newPath = pathname.replace(/^\/(en|ar)/, `/${newLocale}`);
        router.push(newPath);
        setLangMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUserMenuOpen(false);
            setProfile(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            localStorage.setItem('searchQuery', searchQuery);
            router.push(`/search?q=${searchQuery}`);
            setSearchQuery('');
            setIsSearchOpen(false);
            searchInputRef.current?.blur();
        }
    };

    const navItems = [
        { label: t('header.home'), path: '/' },
        { label: t('header.products'), path: 'products' },
        { label: t('header.blog'), path: 'blog' },
        { label: t('header.services'), path: 'services' },
        { label: t('header.about'), path: 'about-us' },
        { label: t('header.feedback'), path: 'feedback' }
    ];

    const languageOptions = [
        { locale: 'en', label: 'EN', icon: '/flags/GB.png' },
        { locale: 'ar', label: 'العربية', icon: '/flags/SA.png' },
    ];


    const isActiveNavItem = (path: string) => {
        const basePath = `/${currentLocale}/${path}`;
        return pathname === basePath || pathname.startsWith(`${basePath}/`);
    };

    return (
        <header className="w-full text-text-primary h-[10vh] shadow-md transition-all duration-300 ease-in-out md:px-6 sm:px-6 sticky z-50 top-0 bg-[var(--primary-bg)]">
            <div className="px-10 flex justify-between items-center h-full relative">
                <div className="flex items-center space-x-1">
                    <Link href={`/${currentLocale}`} className="overflow-hidden">
                        <Image
                            src="/logo shatleh.svg"
                            alt="Logo"
                            width={35}
                            height={35}
                            className="w-30 h-30 object-cover mt-4"
                            priority
                        />
                    </Link>
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={`/${currentLocale}/${item.path}`}
                                className="relative text-sm font-medium transition-all duration-200 ease-in-out hover:font-semibold hover:px-1"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className={` text-nowrap ${isActiveNavItem(item.path) ? 'text-accent' : 'hover:text-accent'}`}>
                                    {item.label}
                                </span>
                                {isActiveNavItem(item.path) && (
                                    <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-accent animate-underline border-b-2" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-row items-center space-x-3">
                    <div className="hidden md:flex items-center relative">
                        <button
                            onClick={toggleSearch}
                            className="text-text-primary hover:text-accent focus:outline-none hover:cursor-pointer px-2 py-1"
                            aria-label={t('header.searchButton')}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <form
                            onSubmit={handleSearch}
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isSearchOpen ? 'w-32 lg:w-48 opacity-100' : 'w-0 opacity-0'
                            }`}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('header.search')}
                                className="w-full px-3 py-1.5 text-sm text-text-primary bg-[var(--primary-bg)] border border-gray-300 rounded-sm focus:outline-green-600 hover:bg-gray-100 transition-all duration-200"
                                aria-label={t('header.search')}
                            />
                        </form>
                    </div>

                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={toggleLangMenu}
                            className="flex items-center gap-1 hover:text-accent hover:cursor-pointer px-2 py-1 transition-all duration-200 ease-in-out"
                        >
                            <Image
                                src={languageOptions.find(opt => opt.locale === currentLocale)?.icon || '/flags/GB.png'}
                                alt={`${currentLocale} flag`}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full"
                            />
                            <span>{languageOptions.find(opt => opt.locale === currentLocale)?.label}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {langMenuOpen && (
                            <div className={`absolute ${currentLocale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 bg-[var(--primary-bg)] text-text-primary rounded-sm shadow-lg z-50`}>
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.locale}
                                        onClick={() => switchLanguage(option.locale)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-200 hover:text-accent hover:cursor-pointer transition-all duration-200"
                                    >
                                        <Image
                                            src={option.icon}
                                            alt={`${option.locale} flag`}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 rounded-full"
                                        />
                                        <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <Link href={`/${currentLocale}/cart`} className="md:flex hidden mx-3">
                            <ShoppingCart className="w-6 h-6 text-text-primary hover:text-accent transition-all duration-200 ease-in-out hover:font-semibold hover:px-1" />
                            <span className="absolute -top-2 left-7 w-5 h-5 bg-red-400 text-white rounded-full flex items-center justify-center border-2 text-xs">
                                {cartQuantity}
                            </span>
                        </Link>
                    </div>

                    {isAuthenticated && (
                        <div className="relative" ref={userMenuRef} dir="ltr">
                            <button onClick={toggleUserMenu} className="focus:outline-none hover:cursor-pointer">
                                {profile && profile.photo ? (
                                    <Image
                                        width={40}
                                        height={40}
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${profile.photo}`}
                                        alt="User profile"
                                        className="w-10 h-10 rounded-full hover:scale-105 transition-all duration-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full border bg-[var(--primary-bg)] flex items-center justify-center text-text-primary font-medium hover:scale-105 transition-all duration-200">
                                        <Image 
                                        src="/user.svg" 
                                        alt="User profile" 
                                        width={40} height={40}
                                        className="w-10 h-10 rounded-full hover:scale-105 transition-all duration-200"
                                        />
                                    </div>
                                )}
                            </button>
                            {userMenuOpen && (
                                <div className={`absolute ${currentLocale === 'ar' ? 'left-2' : 'right-2'} z-50 mt-2 w-48 bg-[var(--primary-bg)] text-text-primary rounded-sm shadow-lg`}>
                                    <Link href={`/${currentLocale}/account`} className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200" onClick={toggleUserMenu}>
                                        {t('user.account')}
                                    </Link>
                                    <Link href={`/${currentLocale}/address`} className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200" onClick={toggleUserMenu}>
                                        {t('user.address')}
                                    </Link>
                                    <Link href={`/${currentLocale}/service-requests`} className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200" onClick={toggleUserMenu}>
                                        {t('user.serviceRequests')}
                                    </Link>
                                    <Link href={`/${currentLocale}/orders`} className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200" onClick={toggleUserMenu}>
                                        {t('user.myOrders')}
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200">
                                        {t('user.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="relative" ref={authMenuRef}>
                            <button
                                onClick={toggleAuthMenu}
                                className="hidden md:flex items-center px-3 py-1.5 text-text-primary hover:bg-accent hover:text-[var(--text-gray)] transition-all duration-200 text-sm font-medium"
                            >
                                {t('header.account')}
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {authMenuOpen && (
                                <div className={`absolute ${currentLocale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 bg-[var(--primary-bg)] text-text-primary rounded-sm shadow-lg z-50`}>
                                    <Link
                                        href={`/${currentLocale}/login`}
                                        className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200"
                                        onClick={toggleAuthMenu}
                                    >
                                        {t('header.login')}
                                    </Link>
                                    <Link
                                        href={`/${currentLocale}/register`}
                                        className="block px-4 py-2 hover:bg-gray-200 hover:text-accent transition-all duration-200"
                                        onClick={toggleAuthMenu}
                                    >
                                        {t('header.signup')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <button className={`md:hidden focus:outline-none ${currentLocale === 'ar' ? ' pr-3' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
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
                    <div className="flex flex-col space-y-3">
                        {/* Search Bar (Mobile) */}
                        <form onSubmit={handleSearch} className="flex items-center relative">
                            <div className="relative w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('header.search')}
                                    className="w-full px-3 py-1.5 pr-8 text-sm text-text-primary bg-[var(--primary-bg)] border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent hover:bg-gray-100 transition-all duration-200"
                                    aria-label={t('header.search')}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-primary hover:text-accent"
                                    aria-label={t('header.searchButton')}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={`/${currentLocale}/${item.path}`}
                                className="relative py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:font-semibold hover:px-1"
                                onClick={toggleMenu}
                            >
                                <span className={`${isActiveNavItem(item.path) ? 'text-accent' : 'hover:text-accent'}`}>
                                    {item.label}
                                </span>
                                {isActiveNavItem(item.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-underline" />
                                )}
                            </Link>
                        ))}
                        {!isAuthenticated && (
                            <div className="flex flex-col space-y-2 pt-2">
                                <Link
                                    href={`/${currentLocale}/login`}
                                    className="px-4 py-2 text-text-primary transition-all duration-200 text-sm font-medium text-center"
                                    onClick={toggleMenu}
                                >
                                    {t('header.login')}
                                </Link>
                                <Link
                                    href={`/${currentLocale}/register`}
                                    className="px-4 py-2 text-gray-900 bg-accent hover:bg-opacity-80 transition-all duration-200 text-sm font-medium text-center"
                                    onClick={toggleMenu}
                                >
                                    {t('header.signup')}
                                </Link>
                            </div>
                        )}
                        <div className="relative py-2">
                            <Link href={`/${currentLocale}/cart`} className="md:hidden flex mx-4">
                                <ShoppingCart className="w-6 h-6 text-text-primary hover:text-accent transition-all duration-200 ease-in-out hover:font-semibold hover:px-1" />
                                <span className={`absolute -top-0 ${currentLocale === 'ar' ? 'right-1' : 'left-7'} w-5 h-5 bg-red-400 text-white rounded-full flex items-center justify-center border-2 text-xs`}>
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