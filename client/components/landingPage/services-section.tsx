"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import type { Service, Locale } from "../../lib"

interface ServicesSectionProps {
    currentLocale: Locale
}

export default function ServicesSection({ currentLocale }: ServicesSectionProps) {
    const t = useTranslations()
    const servicesRef = useRef(null)
    const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" })

    const servicesVariants = {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

    const servicesData: Service[] = [
        {
            id: 1,
            title_en: "Tree and Plant Care",
            title_ar: "العناية بالأشجار والنباتات",
            description_en: "Full care services for trees and plants to help them grow healthy and beautiful.",
            description_ar: "خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.",
            svg: "/agri services.jpg",
        },
        {
            id: 2,
            title_en: "Agricultural Consultations",
            title_ar: "الاستشارات الزراعية",
            description_en: "Expert advice from agricultural engineers to improve plant care.",
            description_ar: "توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.",
            svg: "/educational content.webp",
        },
        {
            id: 3,
            title_en: "Garden Landscaping",
            title_ar: "تنسيق الحدائق",
            description_en: "Designing and organizing small gardens with high quality to improve their look and use space wisely.",
            description_ar: "تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.",
            svg: "/best plants.jpg",
        },
    ]

    return (
        <motion.section
            ref={servicesRef}
            className="max-w-6xl mx-auto p-4 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4 relative"
            initial="initial"
            animate={servicesInView ? "animate" : "initial"}
            variants={servicesVariants}
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
        >
            <h2 className="text-center text-4xl font-medium text-[var(--accent-color)] mb-3 relative drop-shadow-md">
                {t("header.services")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div>
                    <h3 className="text-3xl font-medium text-[var(--accent-color)] mb-4">
                        {t("home.choosePlantsTitle")}
                    </h3>
                </div>
                <div>
                    <p className="text-base text-gray-700">{t("home.choosePlantsDescription")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {servicesData.map((service) => (
                    <Link href={`/${currentLocale}/services`} key={service.id}>
                        <motion.div
                            className={`rounded-xl p-6 flex flex-col items-center h-full ${
                                service.id === 2 ? "bg-[var(--accent-color)] text-white" : "bg-white"
                            }`}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={service.svg || "/placeholder.svg"}
                                alt={currentLocale === "ar" ? service.title_ar : service.title_en}
                                width={400}
                                height={300}
                                className="w-full h-56 object-cover mb-4"
                            />
                            <h4
                                className={`text-xl font-medium mb-3 ${
                                    service.id === 2 ? "" : "text-[var(--accent-color)]"
                                }`}
                            >
                                {currentLocale === "ar" ? service.title_ar : service.title_en}
                            </h4>
                            <p
                                className={`text-center flex-1 ${service.id === 2 ? "" : "text-gray-700"}`}
                            >
                                {currentLocale === "ar" ? service.description_ar : service.description_en}
                            </p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.section>
    )
}