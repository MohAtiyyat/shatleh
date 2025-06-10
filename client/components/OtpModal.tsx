'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { verifyOtp } from '../lib/api';
import { motion } from 'framer-motion';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
    contact: { phone_number?: string; email?: string };
    language: string;
    otpType?: string;
}

export default function OtpModal({ isOpen, onClose, onVerify, contact, otpType }: OtpModalProps) {
    const t = useTranslations('forgotPassword');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        if (!isOpen) return;

        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [isOpen, onClose]);

    const handleVerify = async () => {
        setError('');
        setLoading(true);

        try {
            const verifyData: { phone_number?: string; email?: string; otp: string; otp_type?: string } = {
                otp,
                ...contact,
                ...(otpType && { otp_type: otpType }),
            };
            await verifyOtp(verifyData);
            onVerify();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('otpVerificationFailed'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
            style={{ backdropFilter: 'blur(0.8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="bg-[var(--primary-bg)] rounded-lg p-6 max-w-md w-full mx-4 shadow-[var(--shadow-md)]">
                <h2 className="text-xl font-bold text-center mb-4 text-[var(--text-primary)]">
                    {t('enterOtp')}
                </h2>
                <p className="text-center text-gray-600 mb-4">
                    {t('otpSentTo')} {contact.phone_number || contact.email}
                </p>
                <p className="text-center text-gray-600 mb-4">
                    {t('timeRemaining')} {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t('otpPlaceholder')}
                    className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198] mb-4"
                    maxLength={4}
                    required
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md"
                        disabled={loading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleVerify}
                        className="bg-[#94f198] hover:bg-[#7ad97e] text-black py-2 px-4 rounded-md"
                        disabled={loading || !otp}
                    >
                        {loading ? t('verifying') : t('verify')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}