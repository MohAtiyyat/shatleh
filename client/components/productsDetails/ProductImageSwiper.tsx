'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

interface ProductImageSwiperProps {
    images: string[];
    altText: string;
}

export default function ProductImageSwiper({ images, altText }: ProductImageSwiperProps) {
    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                loop={images.length > 1}
                className="rounded-lg overflow-hidden"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                            alt={`${altText} ${index + 1}`}
                            width={700}
                            height={400}
                            className="w-[700px] h-[400px] object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-button-prev !bg-white !w-10 !h-10 rounded-full after:!text-gray-500"></div>
            <div className="swiper-button-next !bg-white !w-10 !h-10 rounded-full after:!text-gray-500"></div>
        </div>
    );
}