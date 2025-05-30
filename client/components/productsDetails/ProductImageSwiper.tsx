'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProductImagesCarouselProps {
  images: string[];
  productName: string;
  locale: string;
}

export default function ProductImagesCarousel({ images, productName, locale }: ProductImagesCarouselProps) {
  const t = useTranslations('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}${images[currentImageIndex]}`}
          alt={`${productName} - ${currentImageIndex + 1}`}
          width={700}
          height={400}
          className="w-full h-full object-contain"
          priority
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors hover:cursor-pointer"
              aria-label={t('products.previousImage')}
            >
              <ChevronLeft className="w-6 h-6 text-[#026e78]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors hover:cursor-pointer"
              aria-label={t('products.nextImage')}
            >
              <ChevronRight className="w-6 h-6 text-[#026e78] hover:cursor-pointer" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                currentImageIndex === index ? 'border-[#026e78]' : 'border-transparent'
              } hover:cursor-pointer`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                alt={`${productName} - ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}