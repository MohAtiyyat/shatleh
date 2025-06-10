'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { resetPassword } from '../lib/api';
import { motion } from 'framer-motion';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    contact: { email?: string };
}

export default function ResetPasswordModal({ isOpen, onClose, onSuccess, contact }: ResetPasswordModalProps) {
    const t = useTranslations('forgotPassword');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'));
            setLoading(false);
            return;
        }

        try {
            await resetPassword({
                email: contact.email,
                password,
                password_confirmation: confirmPassword,
            });
            onSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : t('passwordResetFailed'));
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
                    {t('resetPassword')}
                </h2>
                <p className="text-center text-gray-600 mb-4">{t('resetPasswordPrompt')}</p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('newPassword')}
                        className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198] mb-4"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmNewPassword')}
                        className="w-full px-4 py-3 rounded-md bg-gradient-to-tl from-[#c1ebc3] to-[#94f198] border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94f198] mb-4"
                        required
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md"
                            disabled={loading}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="bg-[#94f198] hover:bg-[#7ad97e] text-black py-2 px-4 rounded-md"
                            disabled={loading || !password || !confirmPassword}
                        >
                            {loading ? t('resetting') : t('reset')}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}