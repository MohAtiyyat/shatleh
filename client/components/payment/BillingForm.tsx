'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface FormData {
    firstName: string;
    lastName: string;
    addressLine: string;
    city: string;
    country: string;
    phoneNumber: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    addressLine?: string;
    city?: string;
    country?: string;
    phoneNumber?: string;
}

const mockCountries = [
    { id: 1, name: { en: 'United States', ar: 'الولايات المتحدة الأمريكية' } },
    { id: 2, name: { en: 'Canada', ar: 'كندا' } },
    { id: 3, name: { en: 'United Kingdom', ar: 'المملكة المتحدة' } },
    { id: 4, name: { en: 'Australia', ar: 'أستراليا' } },
    { id: 5, name: { en: 'Jordan', ar: 'الأردن' } },
];

interface BillingFormProps {
    formData: FormData;
    formErrors: FormErrors;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handlePhoneChange: (value: string) => void;
    currentLocale: 'en' | 'ar';
}

export default function BillingForm({
    formData,
    formErrors,
    handleInputChange,
    handlePhoneChange,
    currentLocale,
}: BillingFormProps) {
    const t = useTranslations('checkout');
    const phoneRef = useRef<string | null>(formData.phoneNumber);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <input
                        type="text"
                        name="firstName"
                        placeholder={t('firstName')}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.firstName ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                        aria-invalid={!!formErrors.firstName}
                        aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                    />
                    {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1" id="firstName-error">
                            {formErrors.firstName}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        name="lastName"
                        placeholder={t('lastName')}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.lastName ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                        aria-invalid={!!formErrors.lastName}
                        aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                    />
                    {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1" id="lastName-error">
                            {formErrors.lastName}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <input
                    type="text"
                    name="addressLine"
                    placeholder={t('addressLine')}
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.addressLine ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                    aria-invalid={!!formErrors.addressLine}
                    aria-describedby={formErrors.addressLine ? 'addressLine-error' : undefined}
                />
                {formErrors.addressLine && (
                    <p className="text-red-500 text-xs mt-1" id="addressLine-error">
                        {formErrors.addressLine}
                    </p>
                )}
            </div>
            <div>
                <input
                    type="text"
                    name="city"
                    placeholder={t('city')}
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.city ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                    aria-invalid={!!formErrors.city}
                    aria-describedby={formErrors.city ? 'city-error' : undefined}
                />
                {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1" id="city-error">
                        {formErrors.city}
                    </p>
                )}
            </div>
            <div>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.country ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                    aria-invalid={!!formErrors.country}
                    aria-describedby={formErrors.country ? 'country-error' : undefined}
                >
                    <option value="" disabled>
                        {t('selectCountry')}
                    </option>
                    {mockCountries.map((country) => (
                        <option key={country.id} value={currentLocale === 'ar' ? country.name.ar : country.name.en}>
                            {currentLocale === 'ar' ? country.name.ar : country.name.en}
                        </option>
                    ))}
                </select>
                {formErrors.country && (
                    <p className="text-red-500 text-xs mt-1" id="country-error">
                        {formErrors.country}
                    </p>
                )}
            </div>
            <div dir="ltr">
                <PhoneInput
                    country={'jo'}
                    value={phoneRef.current || ''}
                    onChange={(value) => {
                        phoneRef.current = value;
                        handlePhoneChange(value);
                    }}
                    containerClass="w-full"
                    inputProps={{
                        name: 'phoneNumber',
                        required: true,
                        className: `w-full pl-16 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.phoneNumber ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`,
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
                {formErrors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1" id="phoneNumber-error">
                        {formErrors.phoneNumber}
                    </p>
                )}
            </div>
        </div>
    );
}