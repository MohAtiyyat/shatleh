'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface Address {
    id?: number;
    title: string;
    country_id: number;
    country_name?: string | null;
    city: string;
    address_line: string;
    is_default?: boolean;
}

interface Country {
    id: number;
    name: string;
}

interface AddressFormProps {
    onClose: () => void;
    onSave: (address: Omit<Address, 'id' | 'is_default' | 'country_name'>, mode: 'add' | 'edit') => void;
    initialAddress: Address | null;
    mode: 'add' | 'edit';
    setMode: (mode: 'add' | 'edit') => void;
}

export default function AddressForm({ onClose, onSave, initialAddress, mode }: AddressFormProps) {
    const t = useTranslations('addresses');
    const [formData, setFormData] = useState({
        title: initialAddress?.title || '',
        country_id: initialAddress?.country_id || 1, // Pre-select Jordan (ID: 1)
        city: initialAddress?.city || '',
        address_line: initialAddress?.address_line || '',
    });
    const [countries, setCountries] = useState<Country[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Fetch countries (mocked for now; replace with API call)
        const fetchCountries = async () => {
            try {
                // Replace with actual API call to fetch countries
                const mockCountries = [
                    { id: 1, name: 'Jordan' },
                    { id: 2, name: 'United States' },
                    // Add more as needed
                ];
                setCountries(mockCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = t('titleRequired');
        if (!formData.country_id) newErrors.country_id = t('countryRequired');
        if (!formData.city) newErrors.city = t('cityRequired');
        if (!formData.address_line) newErrors.address_line = t('addressLineRequired');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave(formData, mode);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-semibold text-green-700">
                {mode === 'add' ? t('addAddress') : t('editAddress')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 mb-1">
                        {t('title')}
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder={t('titlePlaceholder')}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="country_id" className="block text-gray-700 mb-1">
                        {t('country')}
                    </label>
                    <select
                        id="country_id"
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 bg-gray-100 cursor-not-allowed"
                        disabled
                    >
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    {errors.country_id && <p className="text-red-500 text-sm">{errors.country_id}</p>}
                </div>

                <div>
                    <label htmlFor="city" className="block text-gray-700 mb-1">
                        {t('city')}
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder={t('cityPlaceholder')}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="address_line" className="block text-gray-700 mb-1">
                        {t('addressLine')}
                    </label>
                    <input
                        type="text"
                        id="address_line"
                        name="address_line"
                        value={formData.address_line}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder={t('addressLinePlaceholder')}
                    />
                    {errors.address_line && <p className="text-red-500 text-sm">{errors.address_line}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <motion.button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('cancel')}
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {mode === 'add' ? t('save') : t('update')}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}