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

            if (mobile) {
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
        <div className="product-carousel-container w-full relative top-5">
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
                    delay: 4000, // Increased delay for better UX
                    disableOnInteraction: true,
                    pauseOnMouseEnter: isMobile,
                }}
                loop={products.length > slidesPerView} // Only loop if enough products
                dir={isRtl ? 'rtl' : 'ltr'}
                className="w-full py-4"
                grabCursor={true}
                centeredSlides={isMobile}
                speed={1000}
                watchSlidesProgress
                updateOnWindowResize
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        centeredSlides: true,
                    },
                    480: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                        centeredSlides: true,
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
                }}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product.id} className="flex justify-center items-center mb-6">
                        <div className="w-full h-full flex justify-center items-center">
                            <ProductCard product={product} index={index} pageName="products" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-pagination flex justify-center"></div>

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
        }

        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 18px;
        }

        @media (max-width: 640px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 30px;
            height: 30px;
          }

          .swiper-button-prev:after,
          .swiper-button-next:after {
            font-size: 14px;
          }
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          height: auto;
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #68f16c;
        }

        .swiper-pagination-bullet-active {
          margin-top: 7px;
          width: 16px;
          border-radius: 4px;
          background-color: #337a5b;
        }
      `}</style>
        </div>
    );
}

export default memo(ProductCarousel);