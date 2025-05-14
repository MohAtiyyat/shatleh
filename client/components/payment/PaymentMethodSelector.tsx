'use client';

import { useTranslations } from 'next-intl';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
    paymentMethod: 'credit-card' | 'cash';
    handlePaymentMethodChange: (method: 'credit-card' | 'cash') => void;
}

export default function PaymentMethodSelector({
    paymentMethod,
    handlePaymentMethodChange,
}: PaymentMethodSelectorProps) {
    const t = useTranslations('checkout');

    return (
        <div className="flex gap-4 mb-6">
            <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'credit-card' ? 'bg-[var(--secondary-bg)] text-[var(--text-white)]' : 'bg-[var(--primary-bg)] text-[var(--text-gray)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)]'}`}
                onClick={() => handlePaymentMethodChange('credit-card')}
                aria-pressed={paymentMethod === 'credit-card'}
            >
                <CreditCard className="h-4 w-4" />
                {t('creditCard')}
            </button>
            <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${paymentMethod === 'cash' ? 'bg-[var(--secondary-bg)] text-[var(--text-white)]' : 'bg-[var(--primary-bg)] text-[var(--text-gray)] hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)]'}`}
                onClick={() => handlePaymentMethodChange('cash')}
                aria-pressed={paymentMethod === 'cash'}
            >
                <span className="text-lg">$</span>
                {t('cashOnDelivery')}
            </button>
        </div>
    );
}