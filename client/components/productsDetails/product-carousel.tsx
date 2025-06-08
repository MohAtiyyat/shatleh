'use client';

import { memo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ProductCard from '../products/product-card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Product } from '../../lib';

interface ProductCarouselProps {
    products: Product[];
}

function ProductCarousel({ products }: ProductCarouselProps) {
    const currentLocale = usePathname().split('/')[1] || 'ar';
    const isRtl = currentLocale === 'ar';
    const [slidesPerView, setSlidesPerView] = useState(4);
    const [isMobile, setIsMobile] = useState(true);

    // Adjust slides per view based on screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);

            if (window.innerWidth < 480) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 640) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 768) {
                setSlidesPerView(2);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(3);
            } else {
                setSlidesPerView(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, A11y]}
                spaceBetween={16}
                slidesPerView={slidesPerView}
                navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination',
                }}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: isMobile,
                }}
                loop={products.length > slidesPerView}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="w-full py-4"
                grabCursor={true}
                centeredSlides={false} // Disable centeredSlides to prevent overlap
                speed={1000}
                watchSlidesProgress
                updateOnWindowResize
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 8,
                        centeredSlides: false,
                    },
                    480: {
                        slidesPerView: 1,
                        spaceBetween: 12,
                        centeredSlides: false,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                        centeredSlides: false,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                        centeredSlides: false,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                        centeredSlides: false,
                    },
                    1280: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                        centeredSlides: false,
                    },
                }}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product.id} className="flex justify-center items-center mb-6">
                        <div className="w-full max-w-[280px] flex justify-center items-center">
                            <ProductCard
                                product={{ ...product, image: Array.isArray(product.image) ? product.image : [product.image] }}
                                index={index}
                                pageName="products"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-pagination flex justify-center mt-4"></div>

            <style jsx global>{`
                :root {
                    --swiper-navigation-color: #026e78;
                    --swiper-pagination-color: #026e78;
                    --swiper-pagination-bullet-inactive-color: #d0d5dd;
                }

                .swiper-button-prev,
                .swiper-button-next {
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    transition: background-color 0.3s;
                }

                .swiper-button-prev:hover,
                .swiper-button-next:hover {
                    background-color: rgba(255, 255, 255, 1);
                }

                .swiper-button-prev:after,
                .swiper-button-next:after {
                    font-size: 18px;
                }

                .swiper-slide {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: auto;
                    width: auto !important; /* Ensure slide width is controlled by content */
                }

                .swiper-slide > div {
                    width: 100%;
                    max-width: 280px; /* Match ProductCard width */
                }

                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background-color: #68f16c;
                    opacity: 0.5;
                }

                .swiper-pagination-bullet-active {
                    width: 16px;
                    height: 8px;
                    border-radius: 4px;
                    background-color: #337a5b;
                    opacity: 1;
                }

                /* Comprehensive media queries */
                @media (max-width: 479px) {
                    .swiper-slide > div {
                        max-width: 100%; /* Full width on very small screens */
                    }
                    .swiper-button-prev,
                    .swiper-button-next {
                        width: 28px;
                        height: 28px;
                    }
                    .swiper-button-prev:after,
                    .swiper-button-next:after {
                        font-size: 12px;
                    }
                    .swiper {
                        padding: 0 8px;
                    }
                }

                @media (min-width: 480px) and (max-width: 639px) {
                    .swiper-slide > div {
                        max-width: 300px; /* Slightly larger for small screens */
                    }
                    .swiper-button-prev,
                    .swiper-button-next {
                        width: 30px;
                        height: 30px;
                    }
                    .swiper-button-prev:after,
                    .swiper-button-next:after {
                        font-size: 14px;
                    }
                    .swiper {
                        padding: 0 10px;
                    }
                }

                @media (min-width: 640px) and (max-width: 767px) {
                    .swiper-slide > div {
                        max-width: 280px;
                    }
                    .swiper-button-prev,
                    .swiper-button-next {
                        width: 32px;
                        height: 32px;
                    }
                    .swiper-button-prev:after,
                    .swiper-button-next:after {
                        font-size: 16px;
                    }
                    .swiper {
                        padding: 0 12px;
                    }
                }

                @media (min-width: 768px) and (max-width: 1023px) {
                    .swiper-slide > div {
                        max-width: 280px;
                    }
                    .swiper-button-prev,
                    .swiper-button-next {
                        width: 36px;
                        height: 36px;
                    }
                    .swiper-button-prev:after,
                    .swiper-button-next:after {
                        font-size: 16px;
                    }
                    .swiper {
                        padding: 0 16px;
                    }
                }

                @media (min-width: 1024px) {
                    .swiper-slide > div {
                        max-width: 280px;
                    }
                    .swiper-button-prev,
                    .swiper-button-next {
                        width: 40px;
                        height: 40px;
                    }
                    .swiper-button-prev:after,
                    .swiper-button-next:after {
                        font-size: 18px;
                    }
                    .swiper {
                        padding: 0 16px;
                    }
                }
            `}</style>
        </div>
    );
}

export default memo(ProductCarousel);   