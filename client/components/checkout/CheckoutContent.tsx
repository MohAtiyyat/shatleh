'use client';

import OrderSummary from '../payment/OrderSummary';
import PaymentDetails from '../payment/PaymentDetails';
import { UserData, Address } from '../../lib';

interface CheckoutContentProps {
    userData: UserData;
    addresses: Address[];
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>; // Added prop
    defaultAddressId: number | null;
    setDefaultAddressId: (id: number | null) => void;
    couponCode: string;
    setCouponCode: (code: string) => void;
    couponApplied: boolean;
    setCouponApplied: (applied: boolean) => void;
    couponDiscount: number;
    setCouponDiscount: (discount: number) => void;
    couponError: string | null;
    setCouponError: (error: string | null) => void;
    currentLocale: 'en' | 'ar';
}

export default function CheckoutContent({
    userData,
    addresses,
    setAddresses, // Added to props
    defaultAddressId,
    setDefaultAddressId,
    couponCode,
    setCouponCode,
    couponApplied,
    setCouponApplied,
    couponDiscount,
    setCouponDiscount,
    couponError,
    setCouponError,
    currentLocale,
}: CheckoutContentProps) {
    return (
        <div
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* Order Summary */}
            <div className="lg:col-span-2 sm:py-6 lg:py-0 order-1 lg:order-2">
                <OrderSummary couponApplied={couponApplied} couponDiscount={couponDiscount} />
            </div>
            {/* Payment Details */}
            <div className="lg:col-span-3 order-2 lg:order-1">
                <PaymentDetails
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
            </div>
        </div>
    );
}