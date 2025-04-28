'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Plus, Trash2 } from 'lucide-react';
import AddressForm from '../../../../components/address/address-form';
import Toast from '../../../../components/Toast';
import { Address } from '../../../../lib/adress'; 

export default function AddressesPage() {
    const t = useTranslations('addresses');
    const pathname = usePathname();
    const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
    const [selectedAddress, setSelectedAddress] = useState<string>('addr1');
    console.log('Selected Address:', selectedAddress);
    const [showForm, setShowForm] = useState(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 'addr1',
            city: 'Santa Ana',
            floor: '2',
            street: '2972 Westheimer Rd',
            aptNo: '12',
            buildingNo: '45',
            zipCode: '85486',
            isDefault: true,
        },
        {
            id: 'addr2',
            city: 'Santa Ana',
            floor: '1',
            street: '2972 Westheimer Rd',
            aptNo: '5',
            buildingNo: '23',
            zipCode: '85486',
        },
    ]);

    const handleSelectAddress = (id: string) => {
        setSelectedAddress(id);
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            })),
        );
        setToastMessage(t('defaultSet'));
        setShowToast(true);
    };

    const handleAddAddress = () => {
        setEditAddress(null);
        setMode('add');
        setShowForm(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditAddress(address);
        setMode('edit');
        setShowForm(true);
    };

    const handleDeleteAddress = (id: string) => {
        if (addresses.find((addr) => addr.id === id)?.isDefault) {
            setToastMessage(t('cannotDeleteDefault'));
            setShowToast(true);
            return;
        }
        setAddresses(addresses.filter((addr) => addr.id !== id));
        setToastMessage(t('addressDeleted'));
        setShowToast(true);
    };

    const handleSaveAddress: (address: Address, mode: 'add' | 'edit') => void = (address, mode) => {
        if (mode === 'add') {
            setAddresses([...addresses, { ...address, id: `addr${addresses.length + 1}`, isDefault: false }]);
            setToastMessage(t('addressAdded'));
        } else {
            setAddresses(
                addresses.map((addr) => (addr.id === address.id ? { ...address, isDefault: addr.isDefault } : addr)),
            );
            setToastMessage(t('addressUpdated'));
        }
        setShowForm(false);
        setEditAddress(null);
        setMode('add');
        setShowToast(true);
    };

    return (
        <div
        className="min-h-screen bg-[var(--primary-bg)] flex flex-col"
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
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
                    {t('title')}
                </motion.h1>

                <div className="space-y-4 mb-6">
                    <AnimatePresence>
                        {addresses.map((address, index) => (
                            <motion.div
                                key={address.id}
                                className="bg-green-100 rounded-lg p-4 shadow-sm"
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: index * 0.05 }}
                                layout
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            className="w-6 h-6 flex items-center justify-center"
                                            onClick={() => handleSelectAddress(address.id!)}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            {address.isDefault ? (
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
                                        <div>
                                            <h3 className="font-medium text-green-700">{address.street}</h3>
                                            <p className="text-sm text-gray-600">
                                                {address.city}, {address.zipCode}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <motion.button
                                            className="text-green-700 hover:text-green-800 hover:bg-green-200 px-3 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                                            onClick={() => handleEditAddress(address)}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <span className="inline-flex">{t('edit')}</span>
                                            <Edit size={16} className="ms-1" />
                                        </motion.button>
                                        <motion.button
                                            className="text-red-700 hover:text-red-800 hover:bg-red-200 px-3 py-1 rounded-md flex flex-row items-center whitespace-nowrap"
                                            onClick={() => handleDeleteAddress(address.id!)}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <span className="inline-flex">{t('delete')}</span>
                                            <Trash2 size={16} className="ms-1" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <motion.button
                    className="flex flex-row items-center gap-2 text-green-700 hover:text-green-800 hover:bg-green-200 px-3 py-1 rounded-md whitespace-nowrap mb-6"
                    onClick={handleAddAddress}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                    <span className="inline-flex">{t('addAddress')}</span>
                    <Plus size={18} className="ms-1" />
                </motion.button>

                {showForm && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <AddressForm
                            onClose={() => setShowForm(false)}
                            onSave={handleSaveAddress}
                            initialAddress={editAddress}
                            mode={mode}
                            setMode={setMode}
                        />
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