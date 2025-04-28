'use client';

import type React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Toast from '../../../../components/Toast';

const serviceOptions = [
    { id: 'plant_garden', en: 'Plant My Garden', ar: 'زراعة حديقتي' },
    { id: 'problem_report', en: 'I Have A Problem', ar: 'لدي مشكلة' },
    { id: 'question', en: 'Ask Us A Question', ar: 'اسألنا سؤالاً' },
    { id: 'maintenance', en: 'Garden Maintenance', ar: 'صيانة الحديقة' },
];

const locationOptions = [
    { id: 'downtown', en: 'Downtown Nursery', ar: 'مشاتل وسط المدينة' },
    { id: 'suburb', en: 'Suburban Greenhouse', ar: 'الدفيئة الضواحي' },
    { id: 'rural', en: 'Rural Farm', ar: 'المزرعة الريفية' },
];

export default function ServiceRequestForm() {
    const t = useTranslations('serviceRequest');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [selectedService, setSelectedService] = useState('');
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ service?: string; location?: string; description?: string; file?: string }>({});
    const [showToast, setShowToast] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 100 * 1024) {
                setErrors((prev) => ({ ...prev, file: t('errors.submitFailed') }));
                return;
            }
            setFile(file);
            setErrors((prev) => ({ ...prev, file: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: { service?: string; location?: string; description?: string } = {};
        if (!selectedService) newErrors.service = t('errors.serviceRequired');
        if (!selectedLocation) newErrors.location = t('errors.locationRequired');
        if (!description.trim()) newErrors.description = t('errors.descriptionRequired');
        setErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log({
            selectedService,
            selectedLocation,
            file,
            description,
        });

        // Reset form
        setSelectedService('');
        setSelectedLocation('');
        setFile(null);
        setDescription('');
        setErrors({});
        setShowToast(true); // Show toast
    };

    const getServiceName = (id: string) => {
        const service = serviceOptions.find((option) => option.id === id);
        return service ? (currentLocale === 'ar' ? service.ar : service.en) : t('selectService');
    };

    const getLocationName = (id: string) => {
        const location = locationOptions.find((option) => option.id === id);
        return location ? (currentLocale === 'ar' ? location.ar : location.en) : t('selectLocation');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
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
                                        {serviceOptions.map((option, index) => (
                                            <motion.div
                                                key={option.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`px-4 py-3 cursor-pointer hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)] ${option.id === selectedService ? 'bg-[var(--accent-color)] text-[var(--text-white)]' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedService(option.id);
                                                    setServiceDropdownOpen(false);
                                                    setErrors((prev) => ({ ...prev, service: undefined }));
                                                }}
                                            >
                                                {currentLocale === 'ar' ? option.ar : option.en}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-[var(--text-primary)] mb-2">{t('location')}</label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full px-4 py-3 border border-[var(--secondary-bg)] rounded-lg flex justify-between items-center text-[var(--text-primary)]"
                                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                            >
                                {getLocationName(selectedLocation)}
                                {locationDropdownOpen ? (
                                    <ChevronUp className="h-4 w-4 text-[var(--text-gray)]" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-[var(--text-gray)]" />
                                )}
                            </button>
                            <AnimatePresence>
                                {locationDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute z-10 w-full mt-1 border border-[var(--secondary-bg)] rounded-lg overflow-hidden bg-[var(--primary-bg)]"
                                    >
                                        {locationOptions.map((option, index) => (
                                            <motion.div
                                                key={option.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`px-4 py-3 cursor-pointer hover:bg-[var(--secondary-bg)] hover:text-[var(--text-white)] ${option.id === selectedLocation ? 'bg-[var(--accent-color)] text-[var(--text-white)]' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedLocation(option.id);
                                                    setLocationDropdownOpen(false);
                                                    setErrors((prev) => ({ ...prev, location: undefined }));
                                                }}
                                            >
                                                {currentLocale === 'ar' ? option.ar : option.en}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                                        <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <span className="mx-4 text-sm text-[var(--text-gray)]">{file ? file.name : currentLocale === 'ar' ? 'لم يتم اختيار صورة' : 'No image selected'}</span>
                                </div>
                                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
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