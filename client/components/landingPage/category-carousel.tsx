    "use client"

    import { useState, useEffect } from "react"
    import Image from "next/image"
    import Link from "next/link"
    import { Swiper, SwiperSlide } from "swiper/react"
    import { EffectCoverflow, Pagination } from "swiper/modules"
    import type { Category, Locale } from "../../lib"
    import { SwiperOptions,  } from "swiper/types"

    import "swiper/css"
    import "swiper/css/effect-coverflow"
    import "swiper/css/pagination"
    import "swiper/css/navigation"

    interface CategoryCarouselProps {
        categories: Category[]
        currentLocale: Locale
    }

    export default function CategoryCarousel({ categories, currentLocale }: CategoryCarouselProps) {
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

        const handleCategoryClick = (category: string) => {
            localStorage.setItem("selectedCategory", category)
        }

        const getSwiperParams = (): SwiperOptions => {
            // Define overlap (negative stretch for overlapping slides)
            const overlap = screenSize === 'small' ? 50 : screenSize === 'medium' ? 30 : 150 // Fixed: Use negative values for overlap

            return {
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                initialSlide: 2,
                coverflowEffect: {
                    rotate: 0,
                    stretch: overlap,
                    depth: 100,
                    modifier: 2,
                    slideShadows: false,
                },
                pagination: { clickable: true },
            }
        }

        return (
            <div className="relative py-4 mt-8 max-w-full overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <Swiper
                        {...getSwiperParams()}
                        modules={[EffectCoverflow, Pagination]}
                        className="swiper-container"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index} className="swiper-slide" style={{ width: '280px' }}>
                                <Link
                                    href={`/${currentLocale}/products`}
                                    onClick={() => handleCategoryClick(category.name[currentLocale])}
                                >
                                    <div
                                        className={`bg-[var(--accent-color)] rounded-xl p-6 flex flex-col items-center text-white h-[400px] mx-auto w-[260px] transform transition-all duration-300 hover:scale-105 hover:shadow-lg `}
                                    >
                                        <Image
                                            className="flex-1 flex items-center justify-center mb-8"
                                            width={200}
                                            height={200}
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.name[currentLocale]}
                                        />
                                        <div className="text-center">
                                            <p className="text-lg">{category.name[currentLocale]}</p>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

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