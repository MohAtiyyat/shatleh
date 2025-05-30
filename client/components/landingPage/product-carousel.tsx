"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination } from "swiper/modules"
import { SwiperOptions,  } from "swiper/types"
import ProductCard from "../products/product-card"
import type { Product, Locale } from "../../lib"

// Import Swiper styles
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import Link from "next/link"

interface ProductCarouselProps {
    products: Product[]
    currentLocale: Locale
    pageName: string
}

export default function ProductCarousel({ products, currentLocale, pageName }: ProductCarouselProps) {
    const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'large'>('medium')

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth
            if (width <= 768) {
                setScreenSize('small')
            } else if (width <= 1024) {
                setScreenSize('medium')
            } else {
                setScreenSize('large')
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => {
            window.removeEventListener('resize', checkScreenSize)
        }
    }, [])

    const getSwiperParams = (): SwiperOptions => {
        // Define overlap (positive stretch for overlapping slides, matching CategoryCarousel)
        const overlap = screenSize === 'small' ? 50 : screenSize === 'medium' ? 30 : 150

        return {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            initialSlide: Math.floor(2),
            coverflowEffect: {
                rotate: 0, // Match CategoryCarousel
                stretch: overlap,
                depth: 100,
                modifier: 2,
                slideShadows: false,
            },
            pagination: { clickable: true }
        }
    }

    return (
        <div className="relative py-4 mt-2 max-w-full overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <Swiper
                    {...getSwiperParams()}
                    modules={[EffectCoverflow, Pagination]}
                    className="swiper-container"
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={product.id} className="swiper-slide" style={{ width: '280px' }}>

                            <ProductCard product={product} index={index} pageName={pageName} />

                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex justify-center">
                    <Link href="/products">
                        <button className="bg-[#337a5b] hover:bg-[#0f4229] text-white px-8 py-3 rounded-full transition-colors md:flex hidden ">
                            {currentLocale === "ar" ? "استعرض جميع المنتجات" : "View All Products"}
                        </button>   
                    </Link>
                </div>
            </div>
  

            <style jsx global>{`
                .swiper-container {
                    padding: 30px 0;
                    overflow: visible;
                    width: 100%;
                    max-width: 100%;
                }
                
                .swiper-slide {
                    transition: all 0.3s ease;
                    opacity: 0.7;
                }
                
                .swiper-slide-active {
                    opacity: 1;
                    z-index: 10;
                }
                
                .swiper-slide-prev, 
                .swiper-slide-next {
                    opacity: 0.8;
                    z-index: 5;
                }
                
                .swiper-pagination {
                    position: relative;
                    margin-top: 20px;
                }
                
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: var(--accent-color);
                    opacity: 0.3;
                }
                
                .swiper-pagination-bullet-active {
                    opacity: 1;
                }
            `}</style>
        </div>
    )
}