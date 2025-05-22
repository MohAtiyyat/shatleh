'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logoutApi } from './api';
import { useCartStore } from '../lib/store';

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    login: (token: string, userId: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'en';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const tokenTimestamp = localStorage.getItem('tokenTimestamp');

        if (token && storedUserId && tokenTimestamp) {
            const tokenAgeInMs = Date.now() - parseInt(tokenTimestamp, 10);
            const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

            if (tokenAgeInMs > oneDayInMs) {
                // Token is older than 1 day, perform logout
                logout();
            } else {
                setIsAuthenticated(true);
                setUserId(storedUserId);
                // Sync cart on initial load for authenticated users
                import('../lib/store').then(({ useCartStore }) => {
                    useCartStore.getState().syncWithBackend(storedUserId, currentLocale);
                }).catch((error) => {
                    console.error('Error syncing cart on initial load:', error);
                });
            }
        }
    }, [currentLocale]);

    const login = async (token: string, userId: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('tokenTimestamp', Date.now().toString()); // Store current timestamp
        setIsAuthenticated(true);
        setUserId(userId);
        try {
            // Sync cart after login to merge local and database carts
            await import('../lib/store').then(({ useCartStore }) => {
                return useCartStore.getState().syncWithBackend(userId, currentLocale);
            });
        } catch (error) {
            console.error('Error syncing cart after login:', error);
            // Continue login even if cart sync fails to avoid blocking authentication
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found in localStorage for logout.');
            }
            await logoutApi(token);
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error);
            // Continue with logout even if API call fails
        }

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenTimestamp'); // Remove timestamp on logout
        setIsAuthenticated(false);
        setUserId(null);
        // Clear cart on logout
        useCartStore.getState().logout();
        router.push(`/${currentLocale}/login`);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};