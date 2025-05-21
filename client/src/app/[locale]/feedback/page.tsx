'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Breadcrumb from '../../../../components/breadcrumb';
import type { Locale } from '../../../../lib';

interface FeedbackFormProps {
  params: Promise<{ locale: string }>;
}

export default function FeedbackForm({ params }: FeedbackFormProps) {
  const resolvedParams = React.use(params);
  const t = useTranslations('');
  const currentLocale = resolvedParams.locale as Locale;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    needHelp: '',
    feedback: '',
    featureFeedback: '',
    suggestions: '',
    satisfaction: '',
    additionalSuggestions: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    experience: false,
    needHelp: false,
    feedback: false,
    featureFeedback: false,
    suggestions: false,
    satisfaction: false,
    additionalSuggestions: false,
  });

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      experience: !formData.experience,
      needHelp: !formData.needHelp,
      feedback: !formData.feedback,
      featureFeedback: !formData.featureFeedback,
      suggestions: !formData.suggestions,
      satisfaction: !formData.satisfaction,
      additionalSuggestions: false,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formUrl =
        'https://docs.google.com/forms/d/e/1FAIpQLSf4zsVO4468ogW_nh-cbSzN3gXDxwKBLpoRei8IImrLc1JAyw/formResponse';
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('entry.736307909', formData.name);
      formDataToSubmit.append('entry.1466858497', formData.email);
      formDataToSubmit.append('entry.1938240328', formData.experience);
      formDataToSubmit.append('entry.1229575452', formData.needHelp);
      formDataToSubmit.append('entry.646278731', formData.feedback);
      formDataToSubmit.append('entry.641872685', formData.satisfaction);
      formDataToSubmit.append('entry.284077144', formData.featureFeedback);
      formDataToSubmit.append('entry.128112743', formData.suggestions);
      if (formData.additionalSuggestions) {
        formDataToSubmit.append('entry.976075094', formData.additionalSuggestions);
      }

      await fetch(formUrl, {
        method: 'POST',
        body: formDataToSubmit,
        mode: 'no-cors',
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        experience: '',
        needHelp: '',
        feedback: '',
        featureFeedback: '',
        suggestions: '',
        satisfaction: '',
        additionalSuggestions: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const sectionVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const headingVariants = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 120 },
    },
  };

  const formVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    error: {
      borderColor: '#ef4444',
      x: [0, -5, 5, -5, 0],
      transition: { duration: 0.3, x: { repeat: 1, duration: 0.5 } },
    },
  };

  const radioVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.2 } },
    selected: { scale: 1.15, transition: { duration: 0.2, type: 'spring', stiffness: 200 } },
  };

  const buttonVariants = {
    initial: { scale: 1, background: 'linear-gradient(to right, #337a5b, #43bb67)' },
    hover: {
      scale: 1.05,
      background: 'linear-gradient(to right, #0f4229, #2a7f44)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const successVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
    exit: { opacity: 0, scale: 0.8, rotate: 10, transition: { duration: 0.3 } },
  };

  const errorVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-[#e8f5e9] overflow-hidden">
      <main className="container mx-auto px-4 py-2">
        <div className="mb-4 mx-8">
          <Breadcrumb pageName="feedback" />
        </div>

        <motion.section
          ref={sectionRef}
          id="feedback"
          className="max-w-6xl mx-auto p-6 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4"
          dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
          variants={sectionVariants}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          <motion.h2
            className="text-center md:text-4xl sm:text-3xl font-medium text-[var(--accent-color)] mb-10 relative drop-shadow-md"
            variants={headingVariants}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
          >
            {t('feedback.title') || (currentLocale === 'ar' ? 'شاركنا رأيك' : 'Share Your Feedback')}
          </motion.h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                variants={successVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-[#337a5b] text-white p-6 rounded-xl text-center shadow-lg"
              >
                <h3 className="text-xl font-medium mb-2">
                  {t('feedback.thankYou') || (currentLocale === 'ar' ? 'شكراً لك!' : 'Thank you!')}
                </h3>
                <p>
                  {t('feedback.successMessage') ||
                    (currentLocale === 'ar'
                      ? 'تم استلام ملاحظاتك بنجاح. نقدر مشاركتك معنا.'
                      : 'Your feedback has been successfully submitted. We appreciate your input.')}
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={formVariants}
                initial="initial"
                animate={isInView ? 'animate' : 'initial'}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('feedback.name') || (currentLocale === 'ar' ? 'الاسم' : 'Name')}
                      <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      variants={inputVariants}
                      initial="initial"
                      animate={errors.name ? 'error' : 'animate'}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ borderColor: '#337a5b' }}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          className="text-red-500 text-xs mt-1"
                          variants={errorVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {t('feedback.nameError') ||
                            (currentLocale === 'ar' ? 'الاسم مطلوب' : 'Name is required')}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('feedback.email') || (currentLocale === 'ar' ? 'الايميل' : 'Email')}
                      <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      variants={inputVariants}
                      initial="initial"
                      animate={errors.email ? 'error' : 'animate'}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ borderColor: '#337a5b' }}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          className="text-red-500 text-xs mt-1"
                          variants={errorVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {t('feedback.emailError') ||
                            (currentLocale === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Valid email is required')}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.experience') ||
                      (currentLocale === 'ar'
                        ? 'ما رأيك في فترة تصفحك بشكل عام؟'
                        : 'How was your browsing experience overall?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <motion.select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 hover:border-[#337a5b] appearance-none shadow-sm ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23337a5b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: currentLocale === 'ar' ? 'left 0.75rem center' : 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: currentLocale === 'ar' ? '2rem' : '2.5rem',
                      paddingLeft: currentLocale === 'ar' ? '2.5rem' : '1rem',
                    }}
                    required
                    variants={inputVariants}
                    initial="initial"
                    animate={errors.experience ? 'error' : 'animate'}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ borderColor: '#337a5b' }}
                  >
                    <option value="" disabled>
                      {t('feedback.selectRating') ||
                        (currentLocale === 'ar' ? 'اختر تقييمك' : 'Select your rating')}
                    </option>
                    <option value="ممتازة">{currentLocale === 'ar' ? 'ممتازة' : 'Excellent'}</option>
                    <option value="جيدة">{currentLocale === 'ar' ? 'جيدة' : 'Good'}</option>
                    <option value="مقبولة">{currentLocale === 'ar' ? 'مقبولة' : 'Average'}</option>
                    <option value="غير واضحة">{currentLocale === 'ar' ? 'غير واضحة' : 'Not Clear'}</option>
                    <option value="ضعيفة">{currentLocale === 'ar' ? 'ضعيفة' : 'Poor'}</option>
                  </motion.select>
                  <AnimatePresence>
                    {errors.experience && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.ratingError') ||
                          (currentLocale === 'ar' ? 'التقييم مطلوب' : 'Rating is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.marketNeed') ||
                      (currentLocale === 'ar'
                        ? 'هل تعتقد أن المنصة تلبي حاجة حقيقية في السوق؟'
                        : 'Do you think the platform meets a real need in the market?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    {['نعم', 'لا', 'غير متأكد'].map((value) => (
                      <motion.label
                        key={value}
                        className="inline-flex items-center cursor-pointer"
                        variants={radioVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={formData.needHelp === value ? 'selected' : 'initial'}
                      >
                        <input
                          type="radio"
                          name="needHelp"
                          value={value}
                          checked={formData.needHelp === value}
                          onChange={handleChange}
                          className="hidden"
                          required
                        />
                        <span
                          className={`w-5 h-5 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            formData.needHelp === value
                              ? 'border-[#337a5b] bg-[#337a5b]'
                              : errors.needHelp
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.needHelp === value && (
                            <span className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </span>
                        <span>
                          {currentLocale === 'ar'
                            ? value
                            : value === 'نعم'
                            ? 'Yes'
                            : value === 'لا'
                            ? 'No'
                            : 'Not sure'}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                  <AnimatePresence>
                    {errors.needHelp && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.selectionError') ||
                          (currentLocale === 'ar' ? 'الاختيار مطلوب' : 'Selection is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.applicability') ||
                      (currentLocale === 'ar'
                        ? 'هل ترى أن الفكرة قابلة للتطبيق على أرض الواقع؟'
                        : 'Do you think the idea is applicable in reality?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    {['نعم', 'لا'].map((value) => (
                      <motion.label
                        key={value}
                        className="inline-flex items-center cursor-pointer"
                        variants={radioVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        animate={formData.feedback === value ? 'selected' : 'initial'}
                      >
                        <input
                          type="radio"
                          name="feedback"
                          value={value}
                          checked={formData.feedback === value}
                          onChange={handleChange}
                          className="hidden"
                          required
                        />
                        <span
                          className={`w-5 h-5 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            formData.feedback === value
                              ? 'border-[#337a5b] bg-[#337a5b]'
                              : errors.feedback
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.feedback === value && (
                            <span className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </span>
                        <span>
                          {currentLocale === 'ar' ? value : value === 'نعم' ? 'Yes' : 'No'}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                  <AnimatePresence>
                    {errors.feedback && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.selectionError') ||
                          (currentLocale === 'ar' ? 'الاختيار مطلوب' : 'Selection is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="featureFeedback" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.featureFeedback') ||
                      (currentLocale === 'ar'
                        ? 'ما أكثر شيء أعجبك في المنصة؟'
                        : 'What did you like most about the platform?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <motion.textarea
                    id="featureFeedback"
                    name="featureFeedback"
                    value={formData.featureFeedback}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 ${
                      errors.featureFeedback ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    variants={inputVariants}
                    initial="initial"
                    animate={errors.featureFeedback ? 'error' : 'animate'}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ borderColor: '#337a5b' }}
                  />
                  <AnimatePresence>
                    {errors.featureFeedback && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.fieldError') ||
                          (currentLocale === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.satisfaction') ||
                      (currentLocale === 'ar'
                        ? 'كم تقيّم تصميم الواجهة وتجربة الاستخدام؟'
                        : 'How would you rate the UI design and user experience?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <motion.select
                    id="satisfaction"
                    name="satisfaction"
                    value={formData.satisfaction}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 hover:border-[#337a5b] appearance-none shadow-sm ${
                      errors.satisfaction ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23337a5b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: currentLocale === 'ar' ? 'left 0.75rem center' : 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: currentLocale === 'ar' ? '2rem' : '2.5rem',
                      paddingLeft: currentLocale === 'ar' ? '2.5rem' : '1rem',
                    }}
                    required
                    variants={inputVariants}
                    initial="initial"
                    animate={errors.satisfaction ? 'error' : 'animate'}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ borderColor: '#337a5b' }}
                  >
                    <option value="" disabled>
                      {t('feedback.selectRating') ||
                        (currentLocale === 'ar' ? 'اختر تقييمك' : 'Select your rating')}
                    </option>
                    <option value="5">5 - {currentLocale === 'ar' ? 'ممتاز' : 'Excellent'}</option>
                    <option value="4">4 - {currentLocale === 'ar' ? 'جيد جدًا' : 'Very Good'}</option>
                    <option value="3">3 - {currentLocale === 'ar' ? 'جيد' : 'Good'}</option>
                    <option value="2">2 - {currentLocale === 'ar' ? 'مقبول' : 'Fair'}</option>
                    <option value="1">1 - {currentLocale === 'ar' ? 'ضعيف' : 'Poor'}</option>
                  </motion.select>
                  <AnimatePresence>
                    {errors.satisfaction && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.ratingError') ||
                          (currentLocale === 'ar' ? 'التقييم مطلوب' : 'Rating is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.suggestions') ||
                      (currentLocale === 'ar'
                        ? 'ما هو الشيء الذي ترى أنه يحتاج إلى تحسين؟'
                        : 'What do you think needs improvement?')}
                    <span className="text-red-500">*</span>
                  </label>
                  <motion.textarea
                    id="suggestions"
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200 ${
                      errors.suggestions ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    variants={inputVariants}
                    initial="initial"
                    animate={errors.suggestions ? 'error' : 'animate'}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ borderColor: '#337a5b' }}
                  />
                  <AnimatePresence>
                    {errors.suggestions && (
                      <motion.p
                        className="text-red-500 text-xs mt-1"
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {t('feedback.fieldError') ||
                          (currentLocale === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required')}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="additionalSuggestions" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('feedback.additionalSuggestions') ||
                      (currentLocale === 'ar'
                        ? 'هل لديك أي اقتراحات أو أفكار تضيف قيمة؟'
                        : 'Do you have any suggestions or ideas that add value?')}
                  </label>
                  <motion.textarea
                    id="additionalSuggestions"
                    name="additionalSuggestions"
                    value={formData.additionalSuggestions}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#337a5b] transition-all duration-200"
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ borderColor: '#337a5b' }}
                  />
                </div>

                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-[#337a5b] to-[#43bb67] text-white rounded-full flex items-center space-x-2 rtl:space-x-reverse shadow-lg disabled:opacity-70"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {t('feedback.submitting') ||
                            (currentLocale === 'ar' ? 'جاري الإرسال...' : 'Submitting...')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {t('feedback.submit') || (currentLocale === 'ar' ? 'إرسال' : 'Submit')}
                        </span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}