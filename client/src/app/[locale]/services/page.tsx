'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import Toast from '../../../../components/Toast';
import { fetchServices, createServiceRequest, fetchAddresses } from '../../../../lib/api';

interface Service {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    image: string[] | null;
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

interface Errors {
    service?: string;
    address?: string;
    description?: string;
    file?: string;
}

export default function ServiceRequestForm() {
    const t = useTranslations('serviceRequest');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [services, setServices] = useState<Service[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedService, setSelectedService] = useState<number | ''>('');
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<number | ''>('');
    const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    const mockServicesData: Service[] = [
        {
            id: 1,
            name_en: 'Tree and Plant Care',
            name_ar: 'العناية بالأشجار والنباتات',
            description_en: 'Full care services for trees and plants to help them grow healthy and beautiful.',
            description_ar: 'خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.',
            image: ['/agri services.jpg'],
        },
        {
            id: 2,
            name_en: 'Agricultural Consultations',
            name_ar: 'الاستشارات الزراعية',
            description_en: 'Expert advice from agricultural engineers to improve plant care.',
            description_ar: 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
            image: ['/educational content.webp'],
        },
        {
            id: 3,
            name_en: 'Garden Landscaping',
            name_ar: 'تنسيق الحدائق',
            description_en: 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
            description_ar: 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
            image: ['/best plants.jpg'],
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            router.push(`/${currentLocale}/login?redirect=/services`);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const [servicesData, addressesData] = await Promise.all([
                    fetchServices(),
                    fetchAddresses(),
                ]);

                // Use mock data if no services are returned
                if (servicesData.length === 0) {
                    setServices(mockServicesData);
                } else {
                    setServices(servicesData);
                }
                setAddresses(addressesData);

                // Prefill service from query parameter or first service
                const serviceId = searchParams.get('service_id');
                if (serviceId && servicesData.some((s) => s.id === parseInt(serviceId))) {
                    setSelectedService(parseInt(serviceId));
                } else if (servicesData.length > 0) {
                    setSelectedService(servicesData[0].id);
                } else if (mockServicesData.length > 0) {
                    setSelectedService(mockServicesData[0].id);
                }

                // Prefill default address
                const defaultAddress = addressesData.find((addr) => addr.is_default);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress.id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setServices(mockServicesData); // Fallback to mock data
                setErrors({ service: t('errors.fetchFailed') });
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentLocale, router, t, searchParams]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 100 * 1024) {
                setErrors((prev) => ({ ...prev, file: t('errors.fileSize') }));
                return;
            }
            setFile(file);
            setErrors((prev) => ({ ...prev, file: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: Errors = {};
        if (!selectedService) newErrors.service = t('errors.serviceRequired');
        if (!selectedAddress) newErrors.address = t('errors.addressRequired');
        if (!description.trim()) newErrors.description = t('errors.descriptionRequired');
        setErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await createServiceRequest({
                service_id: selectedService as number,
                address_id: selectedAddress as number,
                description,
                image: file || undefined,
            });

            // Reset form
            setSelectedService(services.length > 0 ? services[0].id : '');
            setSelectedAddress(addresses.find((addr) => addr.is_default)?.id || '');
            setFile(null);
            setDescription('');
            setErrors({});
            setShowToast(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : t('errors.submitFailed');
            try {
                const parsedErrors = JSON.parse(message);
                setErrors(parsedErrors);
            } catch {
                setErrors({ service: message });
                setShowToast(true);
            }
        }
    };

    const getServiceName = (id: number | '') => {
        if (!id) return t('selectService');
        const service = services.find((option) => option.id === id);
        return service ? (currentLocale === 'ar' ? service.name_ar : service.name_en) : t('selectService');
    };

    const getAddressName = (id: number | '') => {
        if (!id) return t('selectAddress');
        const address = addresses.find((option) => option.id === id);
        return address
            ? `${address.title} - ${address.city}, ${address.country_name || address.country_id}`
            : t('selectAddress');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
    }

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--primary-bg)] rounded-3xl shadow-[var(--shadow-md)] p-8 w-full max-w-2xl"
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-[var(--text-primary)] mb-2">{t('serviceName')}</label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full px-4 py-3 border border-[var(--secondary-bg)] rounded-lg flex justify-between items-center text-[var(--text-primary)]"
                                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                            >
                                {getServiceName(selectedService)}
                                {serviceDropdownOpen ? (
                                    <ChevronUp className="h-4 w-4 text-[var(--text-gray)]" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-[var(--text-gray)]" />
                                )}
                            </button>
                            <AnimatePresence>
                                {serviceDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute z-10 w-full mt-1 border border-[var(--secondary-bg)] rounded-lg overflow-hidden bg-[var(--primary-bg)]"
                                    >
                                        {services.map((service, index) => (
                                            <motion.div
                                                key={service.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`px-4 py-3 cursor-pointer hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)] ${
                                                    service.id === selectedService
                                                        ? 'bg-[var(--accent-color)] text-[var(--text-white)]'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    setSelectedService(service.id);
                                                    setServiceDropdownOpen(false);
                                                    setErrors((prev) => ({ ...prev, service: undefined }));
                                                }}
                                            >
                                                {currentLocale === 'ar' ? service.name_ar : service.name_en}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-[var(--text-primary)] mb-2">{t('address')}</label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 border border-[var(--secondary-bg)] rounded-lg flex justify-between items-center text-[var(--text-primary)]"
                                    onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                                >
                                    {getAddressName(selectedAddress)}
                                    {addressDropdownOpen ? (
                                        <ChevronUp className="h-4 w-4 text-[var(--text-gray)]" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-[var(--text-gray)]" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {addressDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-10 w-full mt-1 border border-[var(--secondary-bg)] rounded-lg overflow-hidden bg-[var(--primary-bg)]"
                                    >
                                        {addresses.map((address, index) => (
                                            <motion.div
                                                key={address.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`px-4 py-3 cursor-pointer hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)] ${
                                                    address.id === selectedAddress
                                                        ? 'bg-[var(--accent-color)] text-[var(--text-white)]'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    setSelectedAddress(address.id);
                                                    setAddressDropdownOpen(false);
                                                    setErrors((prev) => ({ ...prev, address: undefined }));
                                                }}
                                            >
                                                {address.title} - {address.city}, {address.country_name || address.country_id}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6 p-4 border border-[var(--secondary-bg)] rounded-lg"
                    >
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-[var(--primary-bg)] flex items-center justify-center mr-4 rounded">
                                <svg
                                    className="w-8 h-8 text-[var(--text-gray)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-[var(--text-gray)] mb-2">{t('imageInstructions')}</p>
                                <div className="flex items-center">
                                    <label className="inline-block">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            className="px-4 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg hover:bg-[var(--focus-ring)] transition-colors"
                                            onClick={() => document.getElementById('fileInput')?.click()}
                                        >
                                            {t('uploadImage')}
                                        </motion.button>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <span className="mx-4 text-sm text-[var(--text-gray)]">
                                        {file
                                            ? file.name
                                            : currentLocale === 'ar'
                                            ? 'لم يتم اختيار صورة'
                                            : 'No image selected'}
                                    </span>
                                </div>
                                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <label className="block text-[var(--text-primary)] mb-2">{t('tellUsMore')}</label>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-full"
                        >
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t('descriptionPlaceholder')}
                                className="w-full min-h-[200px] resize-none border border-[var(--secondary-bg)] text-[var(--text-primary)] rounded-lg p-3 focus:ring-[var(--focus-ring)] focus:ring-2 outline-none"
                            />
                        </motion.div>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </motion.div>

                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-8 py-3 bg-[var(--accent-color)] text-[var(--text-white)] rounded-full hover:bg-[var(--footer-accent)] transition-colors w-full max-w-xs"
                        >
                            {currentLocale === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
            <Toast
                message={currentLocale === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request submitted successfully'}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}
