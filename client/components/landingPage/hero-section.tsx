"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import type { HeroSlide, Locale } from "../../lib"

interface HeroSectionProps {
    currentLocale: Locale
}

export default function HeroSection({ currentLocale }: HeroSectionProps) {
    const t = useTranslations()
    const [currentSlide, setCurrentSlide] = useState(0)

    const heroSlides: HeroSlide[] = [
        {
            image:
                "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            subtitle: t("hero.slide1.subtitle"),
            title: t("hero.slide1.title"),
            description: t("hero.slide1.description"),
        },
        {
            image:
                "https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            subtitle: t("hero.slide2.subtitle"),
            title: t("hero.slide2.title"),
            description: t("hero.slide2.description"),
        },
        {
            image:
                "https://images.unsplash.com/photo-1627920769541-daa658ed6b59?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            subtitle: t("hero.slide3.subtitle"),
            title: t("hero.slide3.title"),
            description: t("hero.slide3.description"),
        },
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [currentSlide])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }

    return (
        <section className="relative h-[90vh] w-full overflow-hidden" dir={currentLocale === "ar" ? "rtl" : "ltr"}>
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500"
                style={{
                    backgroundImage: `url('${heroSlides[currentSlide].image}')`,
                }}
            ></div>

            <motion.div
                className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={currentSlide}
            >
                <h3 className="text-2xl font-light mb-2">{heroSlides[currentSlide].subtitle}</h3>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl">{heroSlides[currentSlide].title}</h1>
                <p className="text-xl max-w-2xl opacity-90">{heroSlides[currentSlide].description}</p>

                <div className="mt-10 flex gap-4">
                    <Link href={`/${currentLocale}/products`}>
                        <button className="bg-[#337a5b] hover:bg-[#0f4229] text-white px-8 py-3 rounded-full transition-colors md:flex hidden ">
                            {t("home.shopNow")}
                        </button>
                    </Link>
                    <Link href={`/${currentLocale}/services`}>
                        <button className="md:flex hidden bg-[#a9f59d] hover:bg-[#8ed67d] text-[#0f4229]  px-8 py-3 rounded-full transition-colors">
                            {t("home.requestService")}
                        </button>
                    </Link>
                    <Link href={`/${currentLocale}/about-us`}>
                        <button className="md:flex hidden  border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-[#0f4229] transition-colors">
                            {t("home.learnMore")}
                        </button>
                    </Link>
                </div>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
                    ></button>
                ))}
            </div>
        </section>
    )
}

