'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../lib/store';
import { useStickyFooter } from '../../lib/useStickyFooter';
import BillingForm from './BillingForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardDetailsForm from './CardDetailsForm';
import ConfirmButton from './ConfirmButton';

interface FormData {
  firstName: string;
  lastName: string;
  addressLine: string;
  city: string;
  country: string;
  phoneNumber: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'credit-card' | 'cash';
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function PaymentDetails() {
  const t = useTranslations('checkout');
  const pathname = usePathname();
  const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
  const { items } = useCartStore();
  const isFooterVisible = useStickyFooter('.footer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    addressLine: '',
    city: '',
    country: '',
    phoneNumber: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'credit-card',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Format card number (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle phone number change
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: 'credit-card' | 'cash') => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
    setFormErrors({});
  };

  return (
    <div
      className={`sticky-container p-6 sm:p-8 w-[95%] md:w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto lg:mx-7 min-h-[450px] sm:mx-auto md:mx-auto flex flex-col z-10 rounded-lg shadow-md ${isFooterVisible ? 'lg:sticky lg:top-25' : 'lg:sticky lg:top-25'}`}
      style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--secondary-bg)' }}
      role="region"
      aria-label={t('paymentDetails')}
    >
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('paymentDetails')}
      </h2>

      <PaymentMethodSelector
        paymentMethod={formData.paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />

      <BillingForm
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        handlePhoneChange={handlePhoneChange}
        currentLocale={currentLocale}
      />

      <CardDetailsForm
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        isVisible={formData.paymentMethod === 'credit-card'}
      />

      <ConfirmButton
        formData={formData}
        setFormErrors={setFormErrors}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        currentLocale={currentLocale}
        items={items}
      />
    </div>
  );
}