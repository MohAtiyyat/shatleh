'use client';

import { useState, useEffect } from 'react'; // Add useEffect
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../lib/AuthContext';
import { login } from '../../../../lib/api';

export default function Login() {
    const t = useTranslations('login');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login: authLogin, isAuthenticated } = useAuth(); // Add isAuthenticated
    const currentLocale = pathname.split('/')[1] || 'ar';
    const redirectPath = searchParams.get('redirect') || '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(`/${currentLocale}${redirectPath}`);
        }
    }, [isAuthenticated, router, currentLocale, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({
                email,
                password,
                language: currentLocale,
            });

            const { token, user } = response;

            if (!token || !user?.id) {
                throw new Error(t('loginFailed'));
            }

            await authLogin(token, user.id);
            router.push(`/${currentLocale}${redirectPath}`);
        } catch (error) {
            console.error('Login error:', error);
            const err = error instanceof Error ? error : new Error(t('loginFailed'));
            setError(
                err.message.includes('Network Error')
                    ? t('corsError')
                    : err.message || t('loginFailed')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow mx-auto px-4 py-10 flex justify-center max-w-7xl mb-40">
            <div className="w-full max-w-md rounded-3xl border-2 border-[#94f198] p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10 mx-auto mb-4">
                    <h1 className="text-2xl font-bold text-center mb-1">{t('title')}</h1>
                    <div className="w-24 h-1 bg-[#94f198] mx-auto mb-4"></div>
                    <p className="text-center text-gray-600 mb-8">{t('welcome')}</p>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                {t('email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                {t('password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198]"
                                required
                            />
                        </div>

                        <div className="text-right mb-6">
                            <Link
                                href={`/${currentLocale}/forgot-password`}
                                className="text-sm text-gray-600 hover:text-[#539407]"
                            >
                                {t('forgotPassword')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#94f198] hover:bg-[#7ad97e] text-black py-3 rounded-md font-medium uppercase transition-colors disabled:bg-gray-400"
                        >
                            {loading ? t('loading') : t('login')}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                {t('noAccount')}{' '}
                                <Link
                                    href={
                                        redirectPath
                                            ? `/${currentLocale}/register?redirect=${encodeURIComponent(redirectPath)}`
                                            : `/${currentLocale}/register`
                                    }
                                    className="font-bold text-[var(--text-primary)] hover:text-[var(--text-hover)]"
                                >
                                    {t('signup')}
                                </Link>{' '}
                                {t('signupLinkText')}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}