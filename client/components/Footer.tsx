"use client"

import Link from "next/link"
import { Mail, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Phone } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

const Footer = () => {
    const t = useTranslations("")
    const pathname = usePathname()
    const currentLocale = pathname.split("/")[1] || "en"

    // Mock data for blog posts
    const blogPostsData = {
        en: [
            {
                id: "post1",
                title: "How to Choose the Best Plants for Your Garden?",
                date: "January 20, 2023",
            },
            {
                id: "post2",
                title: "Common Mistakes in Plant Care and How to Avoid Them",
                date: "January 10, 2023",
            },
            {
                id: "post3",
                title: "Secrets of Indoor Plant Care Throughout the Year",
                date: "January 15, 2023",
            },
        ],
        ar: [
            {
                id: "post1",
                title: "كيف تختار أفضل النباتات لحديقتك؟",
                date: "20 يناير 2023",
            },
            {
                id: "post2",
                title: "أخطاء شائعة في العناية بالنباتات وكيفية تجنبها",
                date: "10 يناير 2023",
            },
            {
                id: "post3",
                title: "أسرار العناية بالنباتات الداخلية طوال السنة",
                date: "15 يناير 2023",
            },
        ],
    }

    // Select blog posts based on current locale and add dynamic href
    const blogPosts = blogPostsData[currentLocale as keyof typeof blogPostsData] || blogPostsData.en
    const blogPostsWithHref = blogPosts.map(post => ({
        ...post,
        href: `/${currentLocale}/blog/${post.id}`,
    }))

    // Navigation items to match header
    const navItems = [
        { label: t('footer.products'), href: `/${currentLocale}/products` },
        { label: t('footer.blog'), href: `/${currentLocale}/blog` },
        { label: t('footer.services'), href: `/${currentLocale}/services` },
        { label: t('footer.about'), href: `/${currentLocale}/about` },
    ]

    return (
        <footer className="bg-[var(--footer-bg)] text-white pt-10 relative md:px-6 sm:px-0 ">
            <div className="container mx-auto px-4">
                {/* Footer Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
                    {/* Contact Info */}
                    <div>
                        <h3 className="footer-title">{t("footer.contactInfo")}</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Mail className="w-5 h-5 mr-2 text-[var(--footer-accent)]" />
                                <p className="text-sm px-3">shatlehteam@gmail.com</p>
                            </div>
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 mr-2 text-[var(--footer-accent)]" />
                                <p className="text-sm px-3">0798827244</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="footer-title">{t("footer.quickLinks")}</h3>
                        <ul className="space-y-3">
                            {navItems.map((item) => (
                                <li key={item.label} className="flex items-center">
                                    <span className="text-[var(--footer-hover)] mr-2">•</span>
                                    <Link href={item.href} className="footer-link">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recent Articles */}
                    <div>
                        <h3 className="footer-title">{t("footer.recentPosts")}</h3>
                        <div className="space-y-4">
                            {blogPostsWithHref.map((post, index) => (
                                <Link key={index} href={post.href}>
                                    <div>
                                        <p className="text-sm mb-1">{post.title}</p>
                                        <p className="text-xs text-[#94f198] flex items-center">
                                            <span className="mr-1">{post.date}</span>
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* About Us */}
                    <div>
                        <h3 className="footer-title">{t("footer.aboutUs")}</h3>
                        <p className="text-sm mb-4">{t("footer.aboutUsDescription")}</p>
                        <div className="flex space-x-3">
                            <a href="#" className="footer-icon">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="footer-icon">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="footer-icon">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="footer-icon">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[var(--footer-accent)] py-4 text-center text-sm">
                    <p>
                        {currentLocale === "ar"
                            ? `© ${new Date().getFullYear()} منصة شتلة. جميع الحقوق محفوظة.`
                            : `© ${new Date().getFullYear()} Shatleh. All rights reserved.`}
                    </p>
                </div>
            </div>

            {/* Back to top button */}
            <div className="fixed bottom-6 right-6">
                <a href="#" className="footer-icon w-10 h-10">
                    <ArrowUp className="w-5 h-5" />
                </a>
            </div>
        </footer>
    )
}

export default Footer