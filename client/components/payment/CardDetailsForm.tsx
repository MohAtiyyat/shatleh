'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';

interface FormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

interface CardDetailsFormProps {
  formData: FormData;
  formErrors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVisible: boolean;
}

export default function CardDetailsForm({
  formData,
  formErrors,
  handleInputChange,
  isVisible,
}: CardDetailsFormProps) {
  const t = useTranslations('checkout');
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardHolderRef = useRef<HTMLInputElement>(null);
  const expiryDateRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="space-y-4 mt-6">
          <div>
            <input
              type="text"
              name="cardNumber"
              placeholder={t('cardNumber')}
              value={formData.cardNumber}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cardNumber ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
              maxLength={19}
              aria-invalid={!!formErrors.cardNumber}
              aria-describedby={formErrors.cardNumber ? 'cardNumber-error' : undefined}
              ref={cardNumberRef}
            />
            {formErrors.cardNumber && (
              <p className="text-red-500 text-xs mt-1" id="cardNumber-error">
                {formErrors.cardNumber}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="cardHolder"
              placeholder={t('cardHolder')}
              value={formData.cardHolder}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cardHolder ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
              aria-invalid={!!formErrors.cardHolder}
              aria-describedby={formErrors.cardHolder ? 'cardHolder-error' : undefined}
              ref={cardHolderRef}
            />
            {formErrors.cardHolder && (
              <p className="text-red-500 text-xs mt-1" id="cardHolder-error">
                {formErrors.cardHolder}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.expiryDate ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                maxLength={7}
                aria-invalid={!!formErrors.expiryDate}
                aria-describedby={formErrors.expiryDate ? 'expiryDate-error' : undefined}
                ref={expiryDateRef}
              />
              {formErrors.expiryDate && (
                <p className="text-red-500 text-xs mt-1" id="expiryDate-error">
                  {formErrors.expiryDate}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="cvv"
                placeholder={t('cvv')}
                value={formData.cvv}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cvv ? 'border-red-500' : 'border-[var(--secondary-bg)]'}`}
                maxLength={4}
                aria-invalid={!!formErrors.cvv}
                aria-describedby={formErrors.cvv ? 'cvv-error' : undefined}
                ref={cvvRef}
              />
              {formErrors.cvv && (
                <p className="text-red-500 text-xs mt-1" id="cvv-error">
                {formErrors.cvv}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}