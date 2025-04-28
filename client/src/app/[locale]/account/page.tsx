'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Toast from '../../../../components/Toast';
import Image from 'next/image';

const userProfile = {
    id: '1',
    firstName: { en: 'Sadeq', ar: 'صادق' },
    lastName: { en: 'Mohamed', ar: 'محمد' },
    userName: { en: 'sadeq.mohamed', ar: 'صادق.محمد' },
    email: 'sadeq@example.com',
    phoneNumber: '+962123456789',
    location: 'downtown',
    timeZone: 'utc+3',
};

const locationOptions = [
    { id: 'downtown', en: 'Downtown Nursery', ar: 'مشاتل وسط المدينة' },
    { id: 'suburb', en: 'Suburban Greenhouse', ar: 'الدفيئة الضواحي' },
    { id: 'rural', en: 'Rural Farm', ar: 'المزرعة الريفية' },
];

const timeZoneOptions = [
    { id: 'utc+3', en: 'Eastern European Time (EET, UTC +3)', ar: 'التوقيت الأوروبي الشرقي (EET، UTC +3)' },
    { id: 'utc-5', en: 'Eastern Standard Time (EST, UTC -5)', ar: 'التوقيت الشرقي القياسي (EST، UTC -5)' },
    { id: 'utc+0', en: 'Greenwich Mean Time (GMT, UTC +0)', ar: 'توقيت غرينتش (GMT، UTC +0)' },
];

interface FormData {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    location: string;
    timeZone: string;
    currentPassword: string;
    newPassword: string;
    photo: File | null;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    timeZone?: string;
    currentPassword?: string;
    newPassword?: string;
    photo?: string;
}

export default function ProfilePage() {
    const t = useTranslations('profile');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [formData, setFormData] = useState<FormData>({
        firstName: userProfile.firstName[currentLocale],
        lastName: userProfile.lastName[currentLocale],
        userName: userProfile.userName[currentLocale],
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
        location: userProfile.location,
        timeZone: userProfile.timeZone,
        currentPassword: '',
        newPassword: '',
        photo: null,
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const phoneRef = useRef<string | null>(formData.phoneNumber);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePhoneChange = (value: string) => {
        phoneRef.current = value;
        setFormData((prev) => ({ ...prev, phoneNumber: value }));
        setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 100 * 1024) {
                setFormErrors((prev) => ({ ...prev, photo: t('errors.submitFailed') }));
                return;
            }
            setFormData((prev) => ({ ...prev, photo: file }));
            setFormErrors((prev) => ({ ...prev, photo: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = t('errors.firstNameRequired');
        if (!formData.lastName.trim()) newErrors.lastName = t('errors.lastNameRequired');
        if (!formData.userName.trim()) newErrors.userName = t('errors.userNameRequired');
        if (!formData.email.trim()) {
            newErrors.email = t('errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('errors.emailInvalid');
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('errors.phoneNumberRequired');
        if (!formData.location) newErrors.location = t('errors.locationRequired');
        if (!formData.timeZone) newErrors.timeZone = t('errors.timeZoneRequired');
        if (formData.currentPassword || formData.newPassword) {
            if (!formData.currentPassword) newErrors.currentPassword = t('errors.currentPasswordRequired');
            if (!formData.newPassword) newErrors.newPassword = t('errors.newPasswordRequired');
            else if (formData.newPassword.length < 8) newErrors.newPassword = t('errors.newPasswordLength');
        }
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log(formData);

        // Reset password fields and photo, keep other data
        setFormData((prev) => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            photo: null,
        }));
        setFormErrors({});
        setShowToast(true);
    };

    // const getLocationName = (id: string) => {
    //     const location = locationOptions.find((option) => option.id === id);
    //     return location ? (currentLocale === 'ar' ? location.ar : location.en) : t('selectLocation');
    // };

    const getTimeZoneName = (id: string) => {
        const timeZone = timeZoneOptions.find((option) => option.id === id);
        return timeZone ? (currentLocale === 'ar' ? timeZone.ar : timeZone.en) : t('selectTimeZone');
    };

    return (
        <div className="flex justify-center  items-center min-h-[calc(100vh-10vh)] bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--primary-bg)] rounded-3xl shadow-[var(--shadow-md)] p-8 w-full max-w-2xl"
            >
                <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)] text-center">{t('title')}</h1>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row items-center gap-6 mb-8"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--secondary-bg)]   ">
                                <Image
                                    width={128}
                                    height={128}
                                    src={formData.photo ? URL.createObjectURL(formData.photo) : '/placeholder.svg?height=128&width=128'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-start">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {formData.firstName} {formData.lastName}
                            </h2>
                            <p className="text-[var(--text-gray)]">{formData.userName}</p>
                            <p className="text-sm text-[var(--text-gray)]">{getTimeZoneName(formData.timeZone)}</p>
                            <div className="flex gap-3 mt-4 justify-center md:justify-start">
                                <label className="inline-block">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-white)] rounded-lg hover:bg-[var(--footer-accent)] transition-colors"
                                        onClick={() => document.getElementById('photoInput')?.click()}
                                    >
                                        {t('uploadPhoto')}
                                    </motion.button>
                                    <input
                                        id="photoInput"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="px-4 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--focus-ring)] transition-colors"
                                    onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                                >
                                    {t('deletePhoto')}
                                </motion.button>
                            </div>
                            {formErrors.photo && <p className="text-red-500 text-sm mt-2">{formErrors.photo}</p>}
                        </div>
                    </motion.div>

                    <hr className="my-6 border-[var(--secondary-bg)]" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    >
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder={currentLocale === 'ar' ? 'مثال: صادق' : 'Ex: Sadeq'}
                                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.firstName ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                    }`}
                                aria-invalid={!!formErrors.firstName}
                                aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                            />
                            {formErrors.firstName && (
                                <p className="text-red-500 text-sm mt-1" id="firstName-error">
                                    {formErrors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder={currentLocale === 'ar' ? 'مثال: محمد' : 'Ex: Mohamed'}
                                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.lastName ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                    }`}
                                aria-invalid={!!formErrors.lastName}
                                aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                            />
                            {formErrors.lastName && (
                                <p className="text-red-500 text-sm mt-1" id="lastName-error">
                                    {formErrors.lastName}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('userName')}</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder={'Ex: sadeq.mohamed'}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.userName ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                }`}
                            aria-invalid={!!formErrors.userName}
                            aria-describedby={formErrors.userName ? 'userName-error' : undefined}
                        />
                        {formErrors.userName && (
                            <p className="text-red-500 text-sm mt-1" id="userName-error">
                                {formErrors.userName}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                    >
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('email')}</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.email ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                        }`}
                                    aria-invalid={!!formErrors.email}
                                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                                />
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-gray)] w-5 h-5"
                                />
                            </div>
                            {formErrors.email && (
                                <p className="text-red-500 text-sm mt-1" id="email-error">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>
                        <div dir="ltr">
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('phoneNumber')}</label>
                            <PhoneInput
                                country={'jo'}
                                value={phoneRef.current || ''}
                                onChange={handlePhoneChange}
                                containerClass="w-full"
                                inputProps={{
                                    name: 'phoneNumber',
                                    required: true,
                                    className: `w-full pl-16 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.phoneNumber ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                        }`,
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
                                <p className="text-red-500 text-sm mt-1" id="phoneNumber-error">
                                    {formErrors.phoneNumber}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <hr className="my-6 border-[var(--secondary-bg)]" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-6"
                    >
                        <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('location')}</label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.location ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                }`}
                            aria-invalid={!!formErrors.location}
                            aria-describedby={formErrors.location ? 'location-error' : undefined}
                        >
                            <option value="">{t('selectLocation')}</option>
                            {locationOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {currentLocale === 'ar' ? option.ar : option.en}
                                </option>
                            ))}
                        </select>
                        {formErrors.location && (
                            <p className="text-red-500 text-sm mt-1" id="location-error">
                                {formErrors.location}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mb-6"
                    >
                        <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('timeZone')}</label>
                        <select
                            name="timeZone"
                            value={formData.timeZone}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.timeZone ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                }`}
                            aria-invalid={!!formErrors.timeZone}
                            aria-describedby={formErrors.timeZone ? 'timeZone-error' : undefined}
                        >
                            <option value="">{t('selectTimeZone')}</option>
                            {timeZoneOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {currentLocale === 'ar' ? option.ar : option.en}
                                </option>
                            ))}
                        </select>
                        {formErrors.timeZone && (
                            <p className="text-red-500 text-sm mt-1" id="timeZone-error">
                                {formErrors.timeZone}
                            </p>
                        )}
                    </motion.div>

                    <hr className="my-6 border-[var(--secondary-bg)]" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
                    >
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('currentPassword')}</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.currentPassword ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                        }`}
                                    aria-invalid={!!formErrors.currentPassword}
                                    aria-describedby={formErrors.currentPassword ? 'currentPassword-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-gray)]"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formErrors.currentPassword && (
                                <p className="text-red-500 text-sm mt-1" id="currentPassword-error">
                                    {formErrors.currentPassword}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('newPassword')}</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.newPassword ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                        }`}
                                    aria-invalid={!!formErrors.newPassword}
                                    aria-describedby={formErrors.newPassword ? 'newPassword-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-gray)]"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formErrors.newPassword && (
                                <p className="text-red-500 text-sm mt-1" id="newPassword-error">
                                    {formErrors.newPassword}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-end gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="px-4 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--focus-ring)] transition-colors"
                            onClick={() => setFormData({
                                firstName: userProfile.firstName[currentLocale],
                                lastName: userProfile.lastName[currentLocale],
                                userName: userProfile.userName[currentLocale],
                                email: userProfile.email,
                                phoneNumber: userProfile.phoneNumber,
                                location: userProfile.location,
                                timeZone: userProfile.timeZone,
                                currentPassword: '',
                                newPassword: '',
                                photo: null,
                            })}
                        >
                            {t('cancel')}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-4 py-2 bg-[var(--accent-color)] text-[var(--text-white)] rounded-lg hover:bg-[var(--footer-accent)] transition-colors"
                        >
                            {t('saveChanges')}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
            <Toast
                message={t('successMessage')}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}