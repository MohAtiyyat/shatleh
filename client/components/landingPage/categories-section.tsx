"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import CategoryCarousel from "./category-carousel"
import type { Category, Locale } from "../../lib"

interface CategoriesSectionProps {
    currentLocale: Locale
}

export default function CategoriesSection({ currentLocale }: CategoriesSectionProps) {
    const t = useTranslations()
    const categoriesRef = useRef(null)
    const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" })

    const categoriesVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

    // Hardcoded array with category data for both locales
    const categoriesData = [
        {
            id: Math.random(),
            title: {
                en: "Plants",
                ar: "نباتات",
            },
            svg: "/5.svg",
        },
        {
            id: Math.random(),
            title: {
                en: "Seeds",
                ar: "بذور",
            },
            svg: "/4.svg",
        },
        {
            id: Math.random(),
            title: {
                en: "Pesticides",
                ar: "مبيدات",
            },
            svg: "/7.svg",
        },
        {
            id: Math.random(),
            title: {
                en: "Fertilizers",
                ar: "أسمدة",
            },
            svg: "/6.svg",
        },
        {
            id: Math.random(),
            title: {
                en: "Agricultural Equipment",
                ar: "مستلزمات زراعية",
            },
            svg: "/10.svg",
        },
    ]

    // Map array to Category type based on currentLocale
        const categories: Category[] = categoriesData.map((item) => ({
        id: item.id,
        name: {
            en: item.title.en,
            ar: item.title.ar,
        },
        subcategories: [],
        image: item.svg,
    }));

    return (
        <motion.section
            ref={categoriesRef}
            className="max-w-6xl mx-auto p-4 section-padding rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4 relative overflow-hidden"
            initial="initial"
            animate={categoriesInView ? "animate" : "initial"}
            variants={categoriesVariants}
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
        >
            <h2 className="text-center text-4xl font-medium text-[var(--accent-color)] relative drop-shadow-md">
                {t("categories.categories")}
            </h2>
            <div className="relative overflow-hidden">
                <CategoryCarousel categories={categories} currentLocale={currentLocale} />
            </div>
        </motion.section>
    )
}