'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            setIsAuthenticated(true);
            setUserId(storedUserId);
        }
    }, []);

    const login = async (token: string, userId: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setIsAuthenticated(true);
        setUserId(userId);
    };

    const logout = async () => {
        try {
            console.log('Logging out...');
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage for logout.');
                return;
            }
            console.log('Token found:', token);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            console.log('API URL:', apiUrl); // Debug log
            await axios.post(
                `${apiUrl}/api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.error('Logout API call failed:', error);
            throw new Error('Logout failed. Please try again later.');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUserId(null);
        router.push(`/${pathname.split('/')[1] || 'en'}/login`);
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

