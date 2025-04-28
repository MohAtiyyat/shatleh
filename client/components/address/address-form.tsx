'use client';

import type React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Address } from '../../lib/adress'; 

interface AddressFormProps {
    onClose: () => void;
    onSave: (address: Address, mode: 'add' | 'edit') => void;
    initialAddress?: Address | null;
    mode: 'add' | 'edit';
    setMode: (mode: 'add' | 'edit') => void;
}

export default function AddressForm({ onClose, onSave, initialAddress, mode, setMode }: AddressFormProps) {
    const t = useTranslations('addresses');
    const [formData, setFormData] = useState<Address>(
        initialAddress || {
            city: '',
            floor: '',
            street: '',
            aptNo: '',
            buildingNo: '',
            zipCode: '',
        },
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, mode);
    };

    const handleSwitchToAdd = () => {
        setMode('add');
        setFormData({
            city: '',
            floor: '',
            street: '',
            aptNo: '',
            buildingNo: '',
            zipCode: '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <input
                    type="text"
                    name="city"
                    placeholder={t('form.city')}
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="floor"
                    placeholder={t('form.floor')}
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="street"
                    placeholder={t('form.street')}
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="aptNo"
                    placeholder={t('form.aptNo')}
                    value={formData.aptNo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="buildingNo"
                    placeholder={t('form.buildingNo')}
                    value={formData.buildingNo}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div>
                <input
                    type="text"
                    name="zipCode"
                    placeholder={t('form.zipCode')}
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-[#a8e6c1] bg-[#e6f5eb] focus:outline-none focus:ring-2 focus:ring-[#a8e6c1]"
                />
            </div>

            <div className="col-span-1 md:col-span-2 mt-4 flex flex-row gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-[#a8e6c1] text-gray-800 py-3 rounded-md hover:bg-[#8fdcad] transition-colors flex flex-row items-center justify-center whitespace-nowrap"
                >
                    <span className="inline-flex">{t('form.confirm')}</span>
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors flex flex-row items-center justify-center whitespace-nowrap"
                >
                    <span className="inline-flex">{t('form.cancel')}</span>
                </button>
                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleSwitchToAdd}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors flex flex-row items-center justify-center whitespace-nowrap"
                    >
                        <span className="inline-flex">{t('form.switchToAdd')}</span>
                    </button>
                )}
            </div>
        </form>
    );
}