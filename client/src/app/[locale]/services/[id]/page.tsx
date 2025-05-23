'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import ServicePageSkeleton from '../../../../../components/service/ServicePageSkeleton';
import SuccessPopup from '../../../../../components/service/SuccessPopup';
import { fetchServices, createServiceRequest, fetchAddresses } from '../../../../../lib/api';
import { useAuth } from '../../../../../lib/AuthContext';

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
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
  address?: string;
  details?: string;
  file?: string;
  customer_id?: string;
  submit?: string;
}

export default function ServiceDetailPage() {
  const t = useTranslations('serviceRequest');
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const { userId } = useAuth();
  const currentLocale: 'en' | 'ar' = pathname.split('/')[1] === 'en' ? 'en' : 'ar';
  const [service, setService] = useState<Service | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | ''>('');
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const mockServicesData: Service[] = [
    {
      id: 1,
      name_en: 'Tree and Plant Care',
      name_ar: 'العناية بالأشجار والنباتات',
      description_en: 'Full care services for trees and plants to help them grow healthy and beautiful.',
      description_ar: 'خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.',
      image: '/agri services.jpg',
    },
    {
      id: 2,
      name_en: 'Agricultural Consultations',
      name_ar: 'الاستشارات الزراعية',
      description_en: 'Expert advice from agricultural engineers to improve plant care.',
      description_ar: 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
      image: '/educational content.webp',
    },
    {
      id: 3,
      name_en: 'Garden Landscaping',
      name_ar: 'تنسيق الحدائق',
      description_en: 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
      description_ar: 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
      image: '/best plants.jpg',
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (!token || !storedUserId) {
      router.push(`/${currentLocale}/login?redirect=/service/${id}`);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesData, addressesData] = await Promise.all([
          fetchServices(),
          fetchAddresses(),
        ]);

        const serviceId = parseInt(id as string);
        const foundService = servicesData.find((s) => s.id === serviceId) || mockServicesData.find((s) => s.id === serviceId);
        if (!foundService) {
          router.push(`/${currentLocale}/services`);
          return;
        }
        setService(foundService);
        setAddresses(addressesData);

        const defaultAddress = addressesData.find((addr) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        const serviceId = parseInt(id as string);
        const foundService = mockServicesData.find((s) => s.id === serviceId);
        if (foundService) {
          setService(foundService);
        } else {
          router.push(`/${currentLocale}/services`);
        }
        setErrors((prev) => ({ ...prev, submit: t('errors.fetchFailed') }));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLocale, router, t, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: t('errors.fileSize') }));
        return;
      }
      setFile(file);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!selectedAddress) newErrors.address = t('errors.addressRequired');
    if (!details.trim()) newErrors.details = t('errors.detailsRequired');
    if (!userId) newErrors.customer_id = t('errors.customerRequired');
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      await createServiceRequest({
        service_id: service!.id,
        address_id: selectedAddress as number,
        customer_id: userId!,
        details,
        image: file || undefined,
      });

      setSelectedAddress(addresses.find((addr) => addr.is_default)?.id || '');
      setFile(null);
      setDetails('');
      setErrors({});
      setShowSuccessPopup(true);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsedErrors = JSON.parse(error.message);
          if (parsedErrors.errors && parsedErrors.errors.details) {
            setErrors((prev) => ({
              ...prev,
              details: parsedErrors.errors.details[0],
            }));
            return;
          }
          if (parsedErrors.errors) {
            const errorFields = Object.keys(parsedErrors.errors);
            if (errorFields.includes('address_id')) {
              setErrors((prev) => ({
                ...prev,
                address: t('errors.addressRequired'),
              }));
              return;
            } else if (errorFields.includes('customer_id')) {
              setErrors((prev) => ({
                ...prev,
                customer_id: t('errors.customerRequired'),
              }));
              return;
            } else if (errorFields.includes('image')) {
              setErrors((prev) => ({
                ...prev,
                file: t('errors.fileSize'),
              }));
              return;
            } else {
              setErrors((prev) => ({
                ...prev,
                submit: parsedErrors.errors[errorFields[0]][0],
              }));
              return;
            }
          } else if (parsedErrors.message.includes('customer_id')) {
            setErrors((prev) => ({
              ...prev,
              customer_id: t('errors.customerRequired'),
            }));
            return;
          }
          setErrors((prev) => ({
            ...prev,
            submit: parsedErrors.message || error.message,
          }));
        } catch {
          if (error.message.includes('details')) {
            setErrors((prev) => ({
              ...prev,
              details: t('errors.detailsRequired'),
            }));
          } else if (error.message.includes('customer_id')) {
            setErrors((prev) => ({
              ...prev,
              customer_id: t('errors.customerRequired'),
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              submit: error.message || t('errors.submitFailed'),
            }));
          }
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: t('errors.submitFailed'),
        }));
      }
    }
  };

  const getAddressName = (id: number | '') => {
    if (!id) return t('selectAddress');
    const address = addresses.find((option) => option.id === id);
    return address
      ? `${address.title} - ${address.city}, ${address.country_name || address.country_id}`
      : t('selectAddress');
  };

  if (loading) {
    return <ServicePageSkeleton />;
  }

  if (!service) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-12" dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Service Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={service.image ? `${process.env.NEXT_PUBLIC_API_URL}${service.image}` : '/placeholder.svg'}
              alt={currentLocale === 'ar' ? service.name_ar : service.name_en}
              width={400}
              height={300}
              className="w-full md:w-1/2 h-64 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--accent-color)] mb-4">
                {currentLocale === 'ar' ? service.name_ar : service.name_en}
              </h1>
              <p className="text-gray-600">
                {currentLocale === 'ar' ? service.description_ar : service.description_en}
              </p>
            </div>
          </div>
        </div>

        {/* Service Request Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-6">
            {t('requestService')}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[var(--text-primary)] mb-2">{t('serviceName')}</label>
              <div className="w-full px-4 py-3 border border-[var(--secondary-bg)] rounded-lg text-[var(--text-primary)] bg-gray-100">
                {currentLocale === 'ar' ? service.name_ar : service.name_en}
              </div>
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
                              address.id === selectedAddress ? 'bg-[var(--accent-color)] text-[var(--text-white)]' : ''
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
                      {file ? file.name : currentLocale === 'ar' ? 'لم يتم اختيار صورة' : 'No image selected'}
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
                  value={details}
                  onChange={(e) => {
                    setDetails(e.target.value);
                    setErrors((prev) => ({ ...prev, details: undefined }));
                  }}
                  placeholder={t('detailsPlaceholder')}
                  className="w-full min-h-[200px] resize-none border border-[var(--secondary-bg)] text-[var(--text-primary)] rounded-lg p-3 focus:ring-[var(--focus-ring)] focus:ring-2 outline-none"
                  required
                />
              </motion.div>
              {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
            </motion.div>

            {errors.submit && (
              <p className="text-red-500 text-sm mb-4 text-center">{errors.submit}</p>
            )}
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

        <AnimatePresence>
          {showSuccessPopup && (
            <SuccessPopup
              onClose={() => setShowSuccessPopup(false)}
              currentLocale={currentLocale}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}