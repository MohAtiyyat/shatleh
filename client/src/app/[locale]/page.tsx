"use client"

import { usePathname } from "next/navigation"
import HeroSection from "../../../components/landingPage/hero-section"
import CategoriesSection from "../../../components/landingPage/categories-section"
import TopSellersSection from "../../../components/landingPage/top-sellers-section"
import ServicesSection from "../../../components/landingPage/services-section"
import BlogSection from "../../../components/landingPage/blog-section"
import CustomerReviewSection from "../../../components/landingPage/customer-review-section"
import type { Locale } from "../../../lib" 
import FeedbackForm from "../../../components/landingPage/feedback-form"

export default function Home() {
  const pathname = usePathname()
  const currentLocale = (pathname.split("/")[1] as Locale) || "ar"

  return (
    <main className="bg-[var(--primary-bg)] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <HeroSection currentLocale={currentLocale} />

      {/* Categories Section */}
      <CategoriesSection currentLocale={currentLocale} />

      {/* Top Sellers Section */}
      <TopSellersSection currentLocale={currentLocale} />

      {/* Services Section */}
      <ServicesSection currentLocale={currentLocale} />

      {/* Blog Section */}
      <BlogSection currentLocale={currentLocale} />

      {/* Customer Review Section */}
      <CustomerReviewSection currentLocale={currentLocale} />

      {/* Feedback Form Section */}
      <FeedbackForm currentLocale={currentLocale} />
    </main>
  )
}
