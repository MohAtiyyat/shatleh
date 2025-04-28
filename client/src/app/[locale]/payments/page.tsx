'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Plus, Trash2, CreditCard } from 'lucide-react';
import Toast from '../../../../components/Toast';

interface PaymentMethod {
    id: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    isDefault?: boolean;
}

interface FormErrors {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

export default function PaymentsPage() {
    const t = useTranslations('payments');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [selectedPayment, setSelectedPayment] = useState<string>('pay1');
    console.log('Selected payment:', selectedPayment);
    const [showForm, setShowForm] = useState(false);
    const [editPayment, setEditPayment] = useState<PaymentMethod | null>(null);
    const [formCvv, setFormCvv] = useState<string>(''); // Separate state for CVV
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: 'pay1',
            cardNumber: '4242 4242 4242 4242',
            cardHolder: 'John Doe',
            expiryDate: '12/25',
            isDefault: true,
        },
        {
            id: 'pay2',
            cardNumber: '5555 5555 5555 4444',
            cardHolder: 'John Doe',
            expiryDate: '06/24',
        },
    ]);

    const cardNumberRef = useRef<HTMLInputElement>(null);
    const cardHolderRef = useRef<HTMLInputElement>(null);
    const expiryDateRef = useRef<HTMLInputElement>(null);
    const cvvRef = useRef<HTMLInputElement>(null);

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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
            setFormCvv(formattedValue);
            setFormErrors((prev) => ({ ...prev, cvv: undefined }));
            return;
        }

        setEditPayment((prev) => ({
            ...(prev || {
                id: '',
                cardNumber: '',
                cardHolder: '',
                expiryDate: '',
                isDefault: false,
            }),
            [name]: formattedValue,
        }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    // Validate form fields
    const validateForm = (payment: PaymentMethod, cvv: string): FormErrors => {
        const errors: FormErrors = {};

        if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(payment.cardNumber)) {
            errors.cardNumber = t('errors.invalidCardNumber');
        }
        if (!payment.cardHolder.trim()) {
            errors.cardHolder = t('errors.cardHolderRequired');
        }
        const expiryRegex = /^(0[1-9]|1[0-2])\/([2-9][0-9])$/;
        if (!expiryRegex.test(payment.expiryDate)) {
            errors.expiryDate = t('errors.invalidExpiryDate');
        } else {
            const [month, year] = payment.expiryDate.split('/').map(Number);
            const fullYear = 2000 + year;
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
                errors.expiryDate = t('errors.expiredCard');
            }
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            errors.cvv = t('errors.invalidCvv');
        }

        return errors;
    };

    const handleSelectPayment = (id: string) => {
        setSelectedPayment(id);
        setPaymentMethods(
            paymentMethods.map((method) => ({
                ...method,
                isDefault: method.id === id,
            })),
        );
        setToastMessage(t('defaultSet'));
        setShowToast(true);
    };

    const handleAddPayment = () => {
        setEditPayment(null);
        setFormCvv('');
        setMode('add');
        setShowForm(true);
        setFormErrors({});
    };

    const handleEditPayment = (payment: PaymentMethod) => {
        setEditPayment(payment);
        setFormCvv('');
        setMode('edit');
        setShowForm(true);
        setFormErrors({});
    };

    const handleDeletePayment = (id: string) => {
        if (paymentMethods.length <= 1) {
            setToastMessage(t('cannotDeleteLast'));
            setShowToast(true);
            return;
        }

        const newPaymentMethods = paymentMethods.filter((method_udx) => method_udx.id !== id);

        if (paymentMethods.find((method_udx) => method_udx.id === id)?.isDefault) {
            newPaymentMethods[0].isDefault = true;
            setSelectedPayment(newPaymentMethods[0].id);
        }

        setPaymentMethods(newPaymentMethods);
        setToastMessage(t('paymentDeleted'));
        setShowToast(true);
    };

    const handleSavePayment = () => {
        if (!editPayment) return;

        const errors = validateForm(editPayment, formCvv);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            // Focus the first invalid field
            if (errors.cardNumber) cardNumberRef.current?.focus();
            else if (errors.cardHolder) cardHolderRef.current?.focus();
            else if (errors.expiryDate) expiryDateRef.current?.focus();
            else if (errors.cvv) cvvRef.current?.focus();
            return;
        }

        if (mode === 'add') {
            setPaymentMethods([
                ...paymentMethods,
                {
                    ...editPayment,
                    id: `pay${paymentMethods.length + 1}`,
                    isDefault: paymentMethods.length === 0,
                },
            ]);
            setToastMessage(t('paymentAdded'));
        } else {
            setPaymentMethods(
                paymentMethods.map((method_udx) =>
                    method_udx.id === editPayment.id
                        ? { ...editPayment, isDefault: method_udx.isDefault }
                        : method_udx,
                ),
            );
            setToastMessage(t('paymentUpdated'));
        }
        setShowForm(false);
        setEditPayment(null);
        setFormCvv('');
        setMode('add');
        setShowToast(true);
    };

    const formatCardForDisplay = (cardNumber: string) => {
        if (!cardNumber) return '•••• •••• •••• ••••';
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length <= 4) return digits;
        return `•••• •••• •••• ${digits.slice(-4)}`;
    };

    return (
        <div
            className="min-h-screen bg-[var(--primary-bg)] flex flex-col"

        >
            <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-[7vh]">
                <motion.div
                    className="w-full max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                    <motion.h1
                        className="text-2xl font-semibold text-green-700 mb-6"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {t('paymentMethods')}
                    </motion.h1>

                    <div className="space-y-4 mb-6">
                        <AnimatePresence>
                            {paymentMethods.map((payment, index) => (
                                <motion.div
                                    key={payment.id}
                                    className="bg-green-100 rounded-lg p-4 shadow-sm"
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.4, 0, 0.2, 1],
                                        delay: index * 0.05,
                                    }}
                                    layout
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <motion.button
                                                className="w-6 h-6 flex items-center justify-center"
                                                onClick={() => handleSelectPayment(payment.id)}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                {payment.isDefault ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-5 h-5 rounded-full border-2 border-green-700 flex items-center justify-center"
                                                    >
                                                        <motion.div
                                                            className="w-2.5 h-2.5 bg-green-700 rounded-full"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                                                        />
                                                    </motion.div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                )}
                                            </motion.button>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="text-green-700" size={20} />
                                                <div>
                                                    <h3 className="font-medium text-green-700">
                                                        {formatCardForDisplay(payment.cardNumber)}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {payment.cardHolder} • {t('expiryDate')} {payment.expiryDate}
                                                        {payment.isDefault && (
                                                            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                                                                {t('default')}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <motion.button
                                                className="text-green-700 hover:text-green-800 hover:bg-green-200 px-3 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                                                onClick={() => handleEditPayment(payment)}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                <span className="inline-flex">{t('edit')}</span>
                                                <Edit size={16} className={currentLocale === 'ar' ? 'me-1' : 'ms-1'} />
                                            </motion.button>
                                            <motion.button
                                                className="text-red-700 hover:text-red-800 hover:bg-red-200 px-3 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                                                onClick={() => handleDeletePayment(payment.id)}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                <span className="inline-flex">{t('delete')}</span>
                                                <Trash2 size={16} className={currentLocale === 'ar' ? 'me-1' : 'ms-1'} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        className="flex flex-row items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-200 px-3 py-1 rounded-md whitespace-nowrap mb-6"
                        onClick={handleAddPayment}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <span className="inline-flex">{t('addPayment')}</span>
                        <Plus size={18} className={currentLocale === 'ar' ? 'me-1' : 'ms-1'} />
                    </motion.button>

                    {showForm && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-green-700 mb-4">
                                    {mode === 'add' ? t('addPayment') : t('editPayment')}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder={t('cardNumber')}
                                            value={editPayment?.cardNumber || ''}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
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
                                            value={editPayment?.cardHolder || ''}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cardHolder ? 'border-red-500' : 'border-gray-300'
                                                }`}
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
                                                value={editPayment?.expiryDate || ''}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                    }`}
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
                                                value={formCvv}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                                                    }`}
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
                            </div>

                            <div className="flex justify-end gap-3">
                                <motion.button
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormErrors({});
                                        setFormCvv('');
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {t('cancel')}
                                </motion.button>
                                <motion.button
                                    className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-md"
                                    onClick={handleSavePayment}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {mode === 'add' ? t('add') : t('save')}
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}