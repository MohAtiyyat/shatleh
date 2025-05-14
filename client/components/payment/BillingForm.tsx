'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface FormData {
    isGift: boolean;
    giftFirstName: string;
    giftLastName: string;
    giftPhoneNumber: string;
}

interface FormErrors {
    giftFirstName?: string;
    giftLastName?: string;
    giftPhoneNumber?: string;
}

interface BillingDetailsProps {
    userData: UserData;
    addresses: Address[];
    defaultAddressId: number | null;
    formData: FormData;
    formErrors: FormErrors;
    handleGiftInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGiftPhoneChange: (value: string) => void;
    handleGiftToggle: () => void;
    currentLocale: 'en' | 'ar';
}

export default function BillingDetails({
    userData,
    addresses,
    defaultAddressId,
    formData,
    formErrors,
    handleGiftInputChange,
    handleGiftPhoneChange,
    handleGiftToggle,
    currentLocale,
}: BillingDetailsProps) {
    const t = useTranslations('checkout');
    const phoneRef = useRef<string | null>(userData.phone_number);
    const giftPhoneRef = useRef<string | null>(formData.giftPhoneNumber);
    const defaultAddress = addresses.find((addr) => addr.id === defaultAddressId) || null;

    return (
        <div className="space-y-6" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                {t('billingDetails')}
            </h3>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div>
                    <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('firstName')}</label>
                    <input
                        type="text"
                        name="first_name"
                        value={userData.first_name}
                        disabled
                        className="w-full rounded-lg border px-4 py-3 text-sm bg-gray-100 cursor-not-allowed border-[var(--secondary-bg)]"
                        aria-label={t('firstName')}
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('lastName')}</label>
                    <input
                        type="text"
                        name="last_name"
                        value={userData.last_name}
                        disabled
                        className="w-full rounded-lg border px-4 py-3 text-sm bg-gray-100 cursor-not-allowed border-[var(--secondary-bg)]"
                        aria-label={t('lastName')}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
            >
                <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('phoneNumber')}</label>
                <div dir="ltr">
                    <PhoneInput
                        country={'jo'}
                        value={phoneRef.current || ''}
                        disabled
                        containerClass="w-full"
                        inputProps={{
                            name: 'phone_number',
                            className: 'w-full pl-16 py-3 rounded-lg border text-sm bg-gray-100 cursor-not-allowed border-[var(--secondary-bg)]',
                        }}
                        buttonStyle={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            padding: '8px',
                            cursor: 'not-allowed',
                            left: '0',
                            top: '0',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        dropdownStyle={{
                            display: 'none',
                        }}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
            >
                <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('address')}</label>
                <div className="flex items-center gap-2">
                    <select
                        name="address"
                        value={defaultAddressId || ''}
                        onChange={() => { }} // Prevent changes since only one option
                        className="w-full rounded-lg border px-4 py-3 text-sm border-[var(--secondary-bg)]"
                        aria-label={t('address')}
                    >
                        {defaultAddress ? (
                            <option value={defaultAddress.id}>
                                {defaultAddress.title} - {defaultAddress.city}, {defaultAddress.country_name || defaultAddress.country_id}
                            </option>
                        ) : (
                            <option value="">{t('selectAddress')}</option>
                        )}
                    </select>
                    <Link href={`/${currentLocale}/address`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="p-2 text-[var(--text-gray)] hover:text-[var(--accent-color)]"
                            title={t('manageAddresses')}
                        >
                            <Settings className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </div>
                {!defaultAddressId && (
                    <p className="text-red-500 text-sm mt-1">
                        {t('incompleteAddress')}.{' '}
                        <Link
                            href={`/${currentLocale}/profile`}
                            className="underline"
                            style={{ color: 'var(--accent-color)' }}
                        >
                            {t('updateProfile')}
                        </Link>
                    </p>
                )}
            </motion.div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isGift"
                    checked={formData.isGift}
                    onChange={handleGiftToggle}
                    className="h-4 w-4"
                />
                <label htmlFor="isGift" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t('isGift')}
                </label>
            </div>

            {formData.isGift && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4 mt-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="giftFirstName"
                                placeholder={t('giftFirstName')}
                                value={formData.giftFirstName}
                                onChange={handleGiftInputChange}
                                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.giftFirstName ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                                aria-invalid={!!formErrors.giftFirstName}
                                aria-describedby={formErrors.giftFirstName ? 'giftFirstName-error' : undefined}
                            />
                            {formErrors.giftFirstName && (
                                <p className="text-red-500 text-xs mt-1" id="giftFirstName-error">
                                    {formErrors.giftFirstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="giftLastName"
                                placeholder={t('giftLastName')}
                                value={formData.giftLastName}
                                onChange={handleGiftInputChange}
                                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.giftLastName ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                                aria-invalid={!!formErrors.giftLastName}
                                aria-describedby={formErrors.giftLastName ? 'giftLastName-error' : undefined}
                            />
                            {formErrors.giftLastName && (
                                <p className="text-red-500 text-xs mt-1" id="giftLastName-error">
                                    {formErrors.giftLastName}
                                </p>
                            )}
                        </div>
                    </div>
                    <div dir="ltr">
                        <PhoneInput
                            country={'jo'}
                            value={giftPhoneRef.current || ''}
                            onChange={(value) => {
                                giftPhoneRef.current = value;
                                handleGiftPhoneChange(value);
                            }}
                            containerClass="w-full"
                            inputProps={{
                                name: 'giftPhoneNumber',
                                required: true,
                                className: `w-full pl-16 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.giftPhoneNumber ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`,
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
                        {formErrors.giftPhoneNumber && (
                            <p className="text-red-500 text-xs mt-1" id="giftPhoneNumber-error">
                                {formErrors.giftPhoneNumber}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}