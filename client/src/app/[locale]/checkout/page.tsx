'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '../../../../lib/store';
import { fetchProfile, fetchAddresses } from '../../../../lib/api';
import LoadingState from '../../../../components/checkout/LoadingState';
import ErrorState from '../../../../components/checkout/ErrorState';
import EmptyCartState from '../../../../components/checkout/EmptyCartState';
import CheckoutContent from '../../../../components/checkout/CheckoutContent';
import CheckoutHeader from '../../../../components/checkout/CheckoutHeader';

interface UserData {
    first_name: string;
    last_name: string;
    phone_number: string;
}

interface Address {
    id: number;
    title: string;
    country_id: number;
    country_name: string | null;
    city: string;
    address_line: string;
    is_default: boolean;
}

export default function CheckoutPage() {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const { items, syncWithBackend, isLoading, error } = useCartStore();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState<string | null>(null);

    // Authentication and data fetching
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (!token || !storedUserId) {
            router.push(`/${currentLocale}/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const [profile, addressData] = await Promise.all([
                    fetchProfile(),
                    fetchAddresses(),
                ]);
                setUserData({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone_number: profile.phone_number,
                });
                setAddresses(addressData);
                const defaultAddr = addressData.find((addr) => addr.is_default);
                setDefaultAddressId(defaultAddr ? defaultAddr.id : null);
                if (storedUserId) {
                    await syncWithBackend(storedUserId, currentLocale);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentLocale, router, pathname, syncWithBackend]);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--primary-bg)' }}
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <main className="container mx-auto max-w-full sm:max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <CheckoutHeader currentLocale={currentLocale} />

                {loading || !userData ? (
                    <LoadingState currentLocale={currentLocale} />
                ) : isLoading ? (
                    <LoadingState currentLocale={currentLocale} />
                ) : error ? (
                    <ErrorState error={error} currentLocale={currentLocale} />
                ) : items.length === 0 ? (
                    <EmptyCartState currentLocale={currentLocale} />
                ) : (
                    <CheckoutContent
                        userData={userData}
                        addresses={addresses}
                        setAddresses={setAddresses} // Pass setAddresses
                        defaultAddressId={defaultAddressId}
                        setDefaultAddressId={setDefaultAddressId}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        couponApplied={couponApplied}
                        setCouponApplied={setCouponApplied}
                        couponDiscount={couponDiscount}
                        setCouponDiscount={setCouponDiscount}
                        couponError={couponError}
                        setCouponError={setCouponError}
                        currentLocale={currentLocale}
                    />
                )}
            </main>
        </div>
    );
}