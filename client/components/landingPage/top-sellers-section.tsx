"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import ProductCarousel from "./product-carousel"
import type { Product, Locale } from "../../lib" 

interface TopSellersSectionProps {
    currentLocale: Locale
}

export default function TopSellersSection({ currentLocale }: TopSellersSectionProps) {
    const t = useTranslations()
    const topSellersRef = useRef(null)
    const topSellersInView = useInView(topSellersRef, { once: true, margin: "-100px" })

    const topSellersVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    }

    const topSellersData: Product[] = [
        {
            id: 1,
            name: {
                en: t("topSellers.basil.title"),
                ar: t("topSellers.basil.title"),
            },
            description: {
                en: t("topSellers.basil.description"),
                ar: t("topSellers.basil.description"),
            },
            image: "/rayhan.webp",
            rating: 4.5,
            price: "3 JD",
            inStock: true,
        },
        {
            id: 2,
            name: {
                en: t("topSellers.lavender.title"),
                ar: t("topSellers.lavender.title"),
            },
            description: {
                en: t("topSellers.lavender.description"),
                ar: t("topSellers.lavender.description"),
            },
            image: "/lavander.webp",
            rating: 4.5,
            price: "5 JD",
            inStock: true,
        },
        {
            id: 3,
            name: {
                en: t("topSellers.carpet.title"),
                ar: t("topSellers.carpet.title"),
            },
            description: {
                en: t("topSellers.carpet.description"),
                ar: t("topSellers.carpet.description"),
            },
            image: "/sjadeh.webp",
            rating: 4.5,
            price: "3.5 JD",
            inStock: true,
        },
        {
            id: 4,
            name: {
                en: t("topSellers.damaskRose.title"),
                ar: t("topSellers.damaskRose.title"),
            },
            description: {
                en: t("topSellers.damaskRose.description"),
                ar: t("topSellers.damaskRose.description"),
            },
            image: "/jori.jpg",
            rating: 4.7,
            price: "5 JD",
            inStock: true,
        },
        {
            id: 5,
            name: {
                en: t("topSellers.mint.title"),
                ar: t("topSellers.mint.title"),
            },
            description: {
                en: t("topSellers.mint.description"),
                ar: t("topSellers.mint.description"),
            },
            image: "/na3nah.jpg",
            rating: 4.3,
            price: "1.5 JD",
            inStock: true,
        },
    ];

    return (
        <motion.section
            ref={topSellersRef}
            className="max-w-6xl mx-auto p-4 section-padding section-full-width rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4 relative"
            initial="initial"
            animate={topSellersInView ? "animate" : "initial"}
            variants={topSellersVariants}
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
        >
            <h2 className="text-center text-4xl font-medium text-[var(--accent-color)]  relative drop-shadow-md">
                {t("home.topSellers")}
            </h2>

            <ProductCarousel products={topSellersData} currentLocale={currentLocale} pageName="home" />
        </motion.section>
    )
}
