"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import type { BlogPost, Locale } from "../../lib"

interface BlogSectionProps {
    currentLocale: Locale
}

export default function BlogSection({ currentLocale }: BlogSectionProps) {
    const t = useTranslations()
    const blogRef = useRef(null)
    const blogInView = useInView(blogRef, { once: true, margin: "-100px" })

    const blogVariants = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

    // Blog data with numeric IDs
    const blogData: BlogPost[] = [
        {
            id: 1,
            title_ar: "أفضل النباتات لحديقتك",
            title_en: "Best Plants for Your Garden",
            content_en: "Looking for perfect plants for your garden? Here are the best choices",
            content_ar: "هل تبحث عن نباتات مثالية لحديقتك؟ إليك أفضل الاختيارات",
            image: "/best plants.jpg",
        },
        {
            id: 2,
            title_ar: "أخطاء شائعة في العناية بالنباتات وكيفية تجنبها",
            title_en: "Common Mistakes in Plant Care and How to Avoid Them",
            content_en: "Are you making these mistakes? Learn how to improve your plant care",
            content_ar: "هل تقع في هذه الأخطاء؟ تعلم كيف تحسن رعاية نباتاتك",
            image: "/problemes.jpg",
        },
        {
            id: 3,
            title_en: "How to Maintain Your Indoor Plants in Summer and Winter",
            title_ar: "كيف تحافظ على نباتاتك الداخلية في الصيف والشتاء",
            content_en: "Indoor plants need special care in different seasons. Here are some tips",
            content_ar: "تحتاج النباتات الداخلية إلى رعاية خاصة في مواسم مختلفة. إليك بعض النصائح",
            image: "/secret care.jpg",
        },
    ]

    return (
        <motion.section
            ref={blogRef}
            className="max-w-6xl mx-auto p-4 rounded-3xl bg-[var(--primary-bg)] border border-[rgba(51,122,91,0.2)] my-4"
            initial="initial"
            animate={blogInView ? "animate" : "initial"}
            variants={blogVariants}
            dir={currentLocale === "ar" ? "rtl" : "ltr"}
            id="blog-section"
        >
            <h2 className="text-center md:text-4xl sm:text-3xl font-medium text-[var(--accent-color)] mb-10 relative drop-shadow-md">
                {t("home.interestingBlog")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {blogData.map((post) => (
                    <Link
                        key={post.id}
                        href={`/${currentLocale}/blog/${post.id}`}
                        scroll={true}
                    >
                        <motion.div
                            id={`blog-post-${post.id}`}
                            className="bg-white rounded-xl overflow-hidden shadow-sm"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={post.image || "/placeholder.svg"}
                                width={400}
                                height={300}
                                alt={currentLocale === "ar" ? post.title_ar : post.title_en}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4 bg-[var(--primary-bg)] min-h-full">
                                <h3 className="text-xl font-medium text-[var(--accent-color)] mb-2">
                                    {currentLocale === "ar" ? post.title_ar : post.title_en}
                                </h3>
                                <p className="text-sm text-gray-700 mb-4">{currentLocale === "ar" ? post.content_ar : post.content_en}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-[var(--accent-color)] flex items-center font-medium">
                                        {t("home.readMore")}
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={currentLocale === "ar" ? "mr-1" : "ml-1"}
                                        >
                                            <path
                                                d="M5 12H19"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d={currentLocale === "ar" ? "M12 5L5 12L12 19" : "M12 5L19 12L12 19"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Link href={`/${currentLocale}/blog`} scroll={true}>
                    <motion.button
                        className="px-6 py-3 bg-[var(--accent-color)] text-white rounded-full font-medium text-sm hover:cursor-pointer transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {t("home.morePosts")}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={currentLocale === "ar" ? "mr-2 inline-block" : "ml-2 inline-block"}
                        >
                            <path
                                d="M5 12H19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d={currentLocale === "ar" ? "M12 5L5 12L12 19" : "M12 5L19 12L12 19"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.button>
                </Link>
            </div>
        </motion.section>
    )
}