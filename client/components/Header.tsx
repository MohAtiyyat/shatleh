'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Languages } from 'lucide-react';
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
    const [profile, setProfile] = useState<Profile | null>(null);
    const currentLocale = pathname.split('/')[1] || 'en';
    const { items, syncWithBackend } = useCartStore();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);

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
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
            if (
                langMenuRef.current &&
                !langMenuRef.current.contains(event.target as Node)
            ) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
    const toggleLangMenu = () => setLangMenuOpen(!langMenuOpen);

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

    const navItems = [
        { label: t('header.products'), href: `/${currentLocale}/products` },
        { label: t('header.blog'), href: `/${currentLocale}/blog` },
        { label: t('header.services'), href: `/${currentLocale}/services` },
        { label: t('header.about'), href: `/${currentLocale}/about-us` },
    ];

    const languageOptions = [
        { locale: 'en', label: 'EN', icon: '/flags/GB.png' },
        { locale: 'ar', label: 'العربية', icon: '/flags/SA.png' },
    ];

    const getInitials = () => {
        if (!profile) return '';
        const firstInitial = profile.first_name.charAt(0).toUpperCase();
        const lastInitial = profile.last_name.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <header className="w-full text-text-primary h-[10vh] shadow-md transition-all duration-300 ease-in-out animate-header md:px-6 sm:px-6 sticky z-50 top-0 bg-[var(--primary-bg)]">
            <div className="px-4 flex justify-between items-center h-full relative">
                <div className="flex items-center space-x-6">
                    <Link href={`/${currentLocale}`}>
                        <Image
                            src="/header logo.svg"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="w-35 h-35 object-contain mt-4"
                            priority
                        />
                    </Link>
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hover:text-text-hover transition-colors flex items-center whitespace-nowrap"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Language + Cart + User */}
                <div className="flex flex-row items-center space-x-4">
                    {/* Language dropdown */}
                    <div className="relative" ref={langMenuRef}>
                        <button
                            onClick={toggleLangMenu}
                            className="flex items-center gap-1 hover:text-text-hover px-3 py-1 rounded-md transition-colors"
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
                            <div className={`absolute ${currentLocale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-32 bg-white text-text-primary rounded-md shadow-lg z-50`}>
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.locale}
                                        onClick={() => switchLanguage(option.locale)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 transition-colors"
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

                    {/* Cart icon */}
                    <div className="relative">
                        <Link href={`/${currentLocale}/cart`} className="md:flex hidden mx-4">
                            <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
                            <span className="absolute -top-2 left-7 w-5 h-5 bg-red-400 text-white rounded-full flex items-center justify-center border-2 text-xs">
                                {cartQuantity}
                            </span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    {isAuthenticated && (
                        <div className="relative" ref={userMenuRef} dir="ltr">
                            <button onClick={toggleUserMenu} className="focus:outline-none">
                                {profile && profile.photo ? (
                                    <Image
                                        width={40}
                                        height={40}
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${profile.photo}`}
                                        alt="User profile"
                                        className="w-10 h-10 rounded-full border-2 border-accent"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full border-2 border-accent bg-gray-200 flex items-center justify-center text-text-primary font-semibold">
                                        {getInitials()}
                                    </div>
                                )}
                            </button>
                            {userMenuOpen && (
                                <div className={`absolute ${currentLocale === 'ar' ? 'left-2' : 'right-2'} z-50 mt-2 w-48 bg-white text-text-primary rounded-md shadow-lg`}>
                                    <Link href={`/${currentLocale}/account`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('user.account')}
                                    </Link>
                                    <Link href={`/${currentLocale}/address`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('user.address')}
                                    </Link>
                                    <Link href={`/${currentLocale}/service-requests`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('user.serviceRequests')}
                                    </Link>
                                    <Link href={`/${currentLocale}/orders`} className="block px-4 py-2 hover:bg-gray-100" onClick={toggleUserMenu}>
                                        {t('user.myOrders')}
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                        {t('user.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Login/Register */}
                    {!isAuthenticated && (
                        <>
                            <Link href={`/${currentLocale}/login`} className="hidden md:flex items-center whitespace-nowrap">
                                {t('header.login')}
                            </Link>
                            <Link href={`/${currentLocale}/register`} className="hidden md:flex items-center whitespace-nowrap">
                                {t('header.signup')}
                            </Link>
                        </>
                    )}

                    {/* Mobile menu toggle */}
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

            {/* Mobile Nav */}
            {isOpen && (
                <nav className="md:hidden bg-[var(--primary-bg)] border-t border-accent absolute top-[10vh] left-0 w-full px-4 py-4 shadow-md">
                    <div className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href} className="nav-item flex flex-row items-center whitespace-nowrap" onClick={toggleMenu}>
                                {item.label}
                            </Link>
                        ))}
                        <div className="relative py-2 nav-item">
                            <Link href={`/${currentLocale}/cart`} className="md:hidden flex mx-4">
                                <ShoppingCart className="w-6 h-6 text-text-primary hover:text-text-hover transition-colors" />
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