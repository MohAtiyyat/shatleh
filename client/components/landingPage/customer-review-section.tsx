"use client"

import { useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import type { Locale } from "../../lib"  

interface CustomerReviewSectionProps {
    currentLocale: Locale
}

export default function CustomerReviewSection({ currentLocale }: CustomerReviewSectionProps) {
    const t = useTranslations()
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

    // Animation variants for the section
    const sectionVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

    // Animation variants for the heading
    const headingVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }

    // Animation variants for the message
    const messageVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", type: "spring", stiffness: 100 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
    }

    return (
        <motion.section
            ref={sectionRef}
            className="max-w-6xl mx-auto p-6 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4"
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
            variants={sectionVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
        >
            <motion.h2
                className="text-center md:text-4xl sm:text-3xl font-medium text-[var(--accent-color)] mb-10 relative drop-shadow-md"
                variants={headingVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                {t("home.customerReview")}
            </motion.h2>

            <AnimatePresence>
                <motion.div
                    key="no-reviews"
                    className="text-center py-10 px-4"
                    variants={messageVariants}
                    initial="initial"
                    animate={isInView ? "animate" : "initial"}
                    exit="exit"
                >
                    <p className="text-2xl text-[var(--accent-color)]">
                        {currentLocale === "ar"
                            ? "حاليًا، ليس لدينا آراء عملاء متوفرة، ولكننا متحمسون للغاية للاستماع إلى آرائكم وتجاربكم حول خدماتنا في المستقبل"
                            : "Currently, we don't have customer reviews available, but we are very excited to hear your feedback and experiences with our services in the future."}
                    </p>
                </motion.div>
            </AnimatePresence>
        </motion.section>
    )
}