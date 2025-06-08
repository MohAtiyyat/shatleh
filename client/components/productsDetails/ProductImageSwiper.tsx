'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImagesCarouselProps {
  images: string[];
  productName: string;
  locale: string;
}

export default function ProductImagesCarousel({ images, productName }: ProductImagesCarouselProps) {
  const t = useTranslations('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute w-full h-full"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${images[currentImageIndex]}`}
              alt={`${productName} - ${currentImageIndex + 1}`}
              width={700}
              height={400}
              className="w-full h-full object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors hover:cursor-pointer"
              aria-label={t('products.previousImage')}
            >
              <ChevronLeft className="w-6 h-6 text-[#026e78]" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors hover:cursor-pointer"
              aria-label={t('products.nextImage')}
            >
              <ChevronRight className="w-6 h-6 text-[#026e78] hover:cursor-pointer" />
            </motion.button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                currentImageIndex === index ? 'border-[#026e78] opacity-100' : 'border-transparent opacity-80'
              } hover:cursor-pointer`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                alt={`${productName} - ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
