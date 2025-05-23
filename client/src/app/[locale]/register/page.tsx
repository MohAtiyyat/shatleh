'use client';

import { useState, useRef, useEffect } from 'react'; // Add useEffect
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { useAuth } from '../../../../lib/AuthContext';
import { register } from '../../../../lib/api';

export default function SignUp() {
    const t = useTranslations('signup');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth(); // Add isAuthenticated
    const currentLocale = pathname.split('/')[1] || 'ar';
    const redirectPath = searchParams.get('redirect') || '/';
    const phoneRef = useRef<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(`/${currentLocale}${redirectPath}`);
        }
    }, [isAuthenticated, router, currentLocale, redirectPath]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handlePhoneChange = (value: string) => {
        phoneRef.current = value;
        console.log('Phone input:', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordMismatch'));
            setLoading(false);
            return;
        }

        try {
            const phoneNumber = phoneRef.current
                ? parsePhoneNumberFromString(`+${phoneRef.current}`)
                : null;
            if (!phoneNumber || !phoneNumber.isValid()) {
                console.log('Invalid phone number:', phoneRef.current);
                setError(t('invalidPhone'));
                setLoading(false);
                return;
            }

            const full_phone_number = `+${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`;

            const dataToSend = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone_number: full_phone_number,
                language: currentLocale,
                ip_country_id: '12',
            };

            console.log('Data to send:', dataToSend);

            const response = await register(dataToSend);
            console.log('Response:', response);

            const { token, user } = response;

            if (!token || !user?.id) {
                throw new Error(t('signupFailed'));
            }

            await login(token, user.id);
            router.push(`/${currentLocale}${redirectPath}`);
        } catch (error) {
            console.error('Registration error:', error);
            const err = error instanceof Error ? error : new Error(t('signupFailed'));
            setError(
                err.message.includes('Network Error')
                    ? t('corsError')
                    : err.message || t('signupFailed')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow mx-auto px-4 py-10 flex justify-center max-w-7xl mb-40">
            <div className="w-full max-w-md rounded-3xl border-2 border-[#94f198] p-8 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--primary-bg)] backdrop-blur-md z-0"></div>
                <div className="relative z-10 mx-auto mb-4">
                    <h1 className="text-2xl font-bold text-center mb-1 text-[var(--text-primary)]">{t('title')}</h1>
                    <div className="w-24 h-1 bg-[#94f198] mx-auto mb-4"></div>
                    <p className="text-center text-gray-600 mb-8">{t('welcome')}</p>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-gray-700 mb-2">
                                    {t('firstName')}
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder={t('firstName')}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                    required
                                    autoComplete="given-name"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700 mb-2">
                                    {t('lastName')}
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder={t('lastName')}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                    required
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                {t('email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('email')}
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-gray-700 mb-2">
                                {t('phone')}
                            </label>
                            <div dir="ltr" className="relative">
                                <PhoneInput
                                    country={'jo'}
                                    value={phoneRef.current || ''}
                                    containerClass="w-full"
                                    onChange={handlePhoneChange}
                                    inputProps={{
                                        id: 'phone',
                                        required: true,
                                        className:
                                            'w-full pl-16 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]',
                                    }}
                                    buttonStyle={{
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        left: '0',
                                        top: '0',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    dropdownStyle={{
                                        zIndex: 1000,
                                        top: '100%',
                                        left: '0',
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                {t('password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder={t('password')}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                                {t('confirmPassword')}
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder={t('confirmPassword')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#94f198] hover:bg-[#7ad97e] text-black py-3 rounded-md font-medium uppercase transition-colors disabled:bg-gray-400"
                        >
                            {loading ? t('loading') : t('signup')}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                {t('haveAccount')}{' '}
                                <Link
                                    href={
                                        redirectPath
                                            ? `/${currentLocale}/login?redirect=${encodeURIComponent(redirectPath)}`
                                            : `/${currentLocale}/login`
                                    }
                                    className="font-bold text-[var(--text-primary)] hover:text-[var(--text-hover)]"
                                >
                                    {t('login')}
                                </Link>{' '}
                                {t('loginLinkText')}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}