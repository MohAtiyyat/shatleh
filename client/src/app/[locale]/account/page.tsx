'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Settings } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Toast from '../../../../components/Toast';
import Image from 'next/image';
import { fetchProfile, updateProfile, fetchAddresses, setDefaultAddress } from '../../../../lib/api';
import UserSkeleton from '../../../../components/profile/UserSkeleton';

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
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    current_password: string;
    new_password: string;
    photo: File | string | null;
    remove_photo: boolean;
}

interface FormErrors {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    current_password?: string;
    new_password?: string;
    photo?: string;
    address?: string;
}

export default function ProfilePage() {
    const t = useTranslations('profile');
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        current_password: '',
        new_password: '',
        photo: null,
        remove_photo: false,
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null);
    const phoneRef = useRef<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (!token || !storedUserId) {
            router.push(`/${currentLocale}/login?redirect=/account`);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const [profile, addressData] = await Promise.all([
                    fetchProfile(),
                    fetchAddresses(),
                ]);
                setFormData({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    phone_number: profile.phone_number,
                    current_password: '',
                    new_password: '',
                    photo: profile.photo,
                    remove_photo: false,
                });
                phoneRef.current = profile.phone_number;
                setAddresses(addressData);
                const defaultAddress = addressData.find((addr) => addr.is_default);
                setDefaultAddressId(defaultAddress ? defaultAddress.id : null);
            } catch (error: unknown) {
                console.error('Error fetching data:', error);
                setToastMessage(t('errors.fetchFailed'));
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentLocale, router, t]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePhoneChange = (value: string) => {
        phoneRef.current = value;
        setFormData((prev) => ({ ...prev, phone_number: value }));
        setFormErrors((prev) => ({ ...prev, phone_number: undefined }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, photo: file, remove_photo: false }));
            setFormErrors((prev) => ({ ...prev, photo: undefined }));
        }
    };

    const handleAddressChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addressId = parseInt(e.target.value);
        if (!addressId) {
            setFormErrors((prev) => ({ ...prev, address: t('errors.addressRequired') }));
            return;
        }
        try {
            await setDefaultAddress(addressId);
            setAddresses(
                addresses.map((addr) => ({
                    ...addr,
                    is_default: addr.id === addressId,
                }))
            );
            setDefaultAddressId(addressId);
            setToastMessage(t('addressUpdated'));
            setShowToast(true);
            setFormErrors((prev) => ({ ...prev, address: undefined }));
        } catch (error: unknown) {
            console.error('Error setting default address:', error);
            setFormErrors((prev) => ({ ...prev, address: t('errors.addressChangeFailed') }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.first_name.trim()) newErrors.first_name = t('errors.firstNameRequired');
        if (!formData.last_name.trim()) newErrors.last_name = t('errors.lastNameRequired');
        if (!formData.email.trim()) {
            newErrors.email = t('errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('errors.emailInvalid');
        }
        if (!formData.phone_number.trim()) newErrors.phone_number = t('errors.phoneNumberRequired');
        if (formData.current_password || formData.new_password) {
            if (!formData.current_password) newErrors.current_password = t('errors.currentPasswordRequired');
            if (!formData.new_password) newErrors.new_password = t('errors.newPasswordRequired');
            else if (formData.new_password.length < 8) newErrors.new_password = t('errors.newPasswordLength');
        }
        if (!defaultAddressId) newErrors.address = t('errors.addressRequired');
        if (formData.photo instanceof File && formData.photo.size > 2 * 1024 * 1024) {
            newErrors.photo = t('errors.photoSize');
        }
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const submitData = new FormData();
        submitData.append('first_name', formData.first_name);
        submitData.append('last_name', formData.last_name);
        submitData.append('email', formData.email);
        submitData.append('phone_number', formData.phone_number);
        if (formData.current_password) submitData.append('current_password', formData.current_password);
        if (formData.new_password) submitData.append('new_password', formData.new_password);
        if (formData.remove_photo) submitData.append('remove_photo', 'true');
        if (formData.photo instanceof File) submitData.append('photo', formData.photo);

        try {
            const updatedProfile = await updateProfile(submitData);
            setFormData({
                first_name: updatedProfile.first_name,
                last_name: updatedProfile.last_name,
                email: updatedProfile.email,
                phone_number: updatedProfile.phone_number,
                current_password: '',
                new_password: '',
                photo: updatedProfile.photo,
                remove_photo: false,
            });
            phoneRef.current = updatedProfile.phone_number;
            setToastMessage(t('successMessage'));
            setShowToast(true);
            setFormErrors({});
        } catch (error) {
            const message = error instanceof Error ? error.message : t('errors.submitFailed');
            try {
                const parsedErrors = JSON.parse(message);
                setFormErrors(parsedErrors);
            } catch {
                setToastMessage(message);
                setShowToast(true);
            }
        }
    };

    if (loading) {
        return <UserSkeleton />;
    }

    return (
        <div
            className="flex justify-center items-center min-h-[calc(100vh-10vh)] bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
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
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--secondary-bg)]">
                                <Image
                                    width={128}
                                    height={128}
                                    src={
                                        formData.photo instanceof File
                                            ? URL.createObjectURL(formData.photo)
                                            : formData.photo
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${formData.photo}`
                                                : '/placeholder.svg?height=128&width=128'
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-start">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {formData.first_name} {formData.last_name}
                            </h2>
                            <p className="text-[var(--text-gray)]">{formData.email}</p>
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
                                    onClick={() => setFormData((prev) => ({ ...prev, photo: null, remove_photo: true }))}
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
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                placeholder={currentLocale === 'ar' ? 'مثال: صادق' : 'Ex: Sadeq'}
                                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.first_name ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                    }`}
                                aria-invalid={!!formErrors.first_name}
                                aria-describedby={formErrors.first_name ? 'firstName-error' : undefined}
                            />
                            {formErrors.first_name && (
                                <p className="text-red-500 text-sm mt-1" id="firstName-error">
                                    {formErrors.first_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-[var(--text-primary)]">{t('lastName')}</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                placeholder={currentLocale === 'ar' ? 'مثال: محمد' : 'Ex: Mohamed'}
                                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.last_name ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                    }`}
                                aria-invalid={!!formErrors.last_name}
                                aria-describedby={formErrors.last_name ? 'lastName-error' : undefined}
                            />
                            {formErrors.last_name && (
                                <p className="text-red-500 text-sm mt-1" id="lastName-error">
                                    {formErrors.last_name}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
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
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-gray)] w-5 h-5" />
                            </div>
                            {formErrors.email && (
                                <p className="text-red-500 text-sm mt-1" id="email-error">
                                    {formErrors.email
                                        ? Array.isArray(formErrors.email)
                                            ? formErrors.email[0]
                                            : formErrors.email
                                        : ''}
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
                                    name: 'phone_number',
                                    required: true,
                                    className: `w-full pl-16 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.phone_number ? 'border-red-500' : 'border-[var(--secondary-bg)]'
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
                            {formErrors.phone_number && (
                                <p className="text-red-500 text-sm mt-1" id="phoneNumber-error">
                                    {formErrors.phone_number}
                                </p>
                            )}
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
                                onChange={handleAddressChange}
                                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${formErrors.address ? 'border-red-500' : 'border-[var(--secondary-bg)]'
                                    }`}
                                aria-invalid={!!formErrors.address}
                                aria-describedby={formErrors.address ? 'address-error' : undefined}
                            >
                                <option value="">{t('selectAddress')}</option>
                                {addresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {address.title} - {address.city}, {address.country_name || address.country_id}
                                    </option>
                                ))}
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
                        {formErrors.address && (
                            <p className="text-red-500 text-sm mt-1" id="address-error">
                                {formErrors.address}
                            </p>
                        )}
                    </motion.div>




                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-end gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="px-4 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--focus-ring)] transition-colors"
                            onClick={async () => {
                                try {
                                    const profile = await fetchProfile();
                                    setFormData({
                                        first_name: profile.first_name,
                                        last_name: profile.last_name,
                                        email: profile.email,
                                        phone_number: profile.phone_number,
                                        current_password: '',
                                        new_password: '',
                                        photo: profile.photo,
                                        remove_photo: false,
                                    });
                                    phoneRef.current = profile.phone_number;
                                    setFormErrors({});
                                } catch (error: unknown) {
                                    console.error('Error fetching profile:', error);
                                    setToastMessage(t('errors.fetchFailed'));
                                    setShowToast(true);
                                }
                            }}
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
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}