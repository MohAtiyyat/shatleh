'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import HeroSection from '../../../components/landingPage/hero-section';
import CategoriesSection from '../../../components/landingPage/categories-section';
import TopSellersSection from '../../../components/landingPage/top-sellers-section';
import ServicesSection from '../../../components/landingPage/services-section';
import BlogSection from '../../../components/landingPage/blog-section';
import CustomerReviewSection from '../../../components/landingPage/customer-review-section';
import RateOrderPopout from '../../../components/order/RateOrderPopout';
import { fetchUnratedOrders } from '../../../lib/api';
import type { Locale, Order } from '../../../lib';

export default function Home() {
  const pathname = usePathname();
  const currentLocale = (pathname.split('/')[1] as Locale) || 'ar';
  const [unratedOrders, setUnratedOrders] = useState<Order[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);

  useEffect(() => {
    const loadUnratedOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const orders = await fetchUnratedOrders(currentLocale);
        setUnratedOrders(orders.filter((o) => o.status === 'delivered'));
        if (orders.length > 0) {
          setIsPopoutOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch unrated orders:', error);
      }
    };
    loadUnratedOrders();
  }, [currentLocale]);

  const handleClosePopout = () => {
    setUnratedOrders((prev) => prev.filter((_, i) => i !== currentOrderIndex));
    if (currentOrderIndex < unratedOrders.length - 1) {
      setCurrentOrderIndex(currentOrderIndex);
    } else {
      setIsPopoutOpen(false);
      setCurrentOrderIndex(0);
    }
  };

  const handleSkipOrder = () => {
    handleClosePopout();
  };

  return (
    <main className="bg-[var(--primary-bg)] min-h-screen overflow-hidden">
      <HeroSection currentLocale={currentLocale} />
      <CategoriesSection currentLocale={currentLocale} />
      <TopSellersSection currentLocale={currentLocale} />
      <ServicesSection currentLocale={currentLocale} />
      <BlogSection currentLocale={currentLocale} />
      <CustomerReviewSection currentLocale={currentLocale} />
      <RateOrderPopout
        order={unratedOrders[currentOrderIndex] || null}
        isOpen={isPopoutOpen}
        onClose={handleClosePopout}
        onSkip={handleSkipOrder}
        locale={currentLocale}
      />
    </main>
  );
}