'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookmarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BlogPost } from '../../lib';
import { toggleBookmark } from '../../lib/api';
import { useRouter } from 'next/navigation';

interface BlogCardProps {
  post: BlogPost & { bookmarked?: boolean };
  currentLocale: 'en' | 'ar';
  setPosts?: React.Dispatch<React.SetStateAction<(BlogPost & { bookmarked?: boolean })[]>>;
  pageName?: string;
}

export default function BlogCard({ post, currentLocale, setPosts, pageName }: BlogCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const title = currentLocale === 'ar' ? post.title_ar : post.title_en;
  const content = currentLocale === 'ar' ? post.content_ar : post.content_en;
  const category = currentLocale === 'ar' ? post.category_ar : post.category_en;
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newBookmarkStatus = await toggleBookmark(post.id);
      if (setPosts) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === post.id ? { ...p, bookmarked: newBookmarkStatus } : p
          )
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && (error.message.includes('Authentication required') || error.message.includes('No authentication token found'))) {
        router.push(`/${currentLocale}/login?redirect=/${pageName}`);
      } else {
        console.error('Bookmark error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      translateY: -10,
      boxShadow: '0 12px 24px rgba(0,0,0,0.2), 0 0 0 2px rgba(13, 148, 136, 0.3)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1, rotate: 0 },
    clicked: {
      scale: [1, 1.2, 0.9, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  const readMoreVariants = {
    initial: { x: 0, opacity: 1 },
    hover: {
      x: currentLocale === 'ar' ? -5 : 5,
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <Link href={`/${currentLocale}/blog/${post.id}`} scroll={true}>
      <motion.div
        id={`blog-post-${post.id}`}
        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 relative"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src={post.image || '/placeholder.svg'}
              width={400}
              height={300}
              alt={title}
              className="w-full h-56 object-cover"
            />
          </motion.div>
          <motion.button
            onClick={handleBookmarkToggle}
            disabled={isLoading}
            className={`absolute top-2 ${currentLocale === 'ar' ? 'left-2' : 'right-2'} p-2 rounded-full ${
              post.bookmarked ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'
            } hover:bg-teal-600 hover:text-white transition-colors shadow-sm`}
            aria-label={
              post.bookmarked
                ? t('education.removeBookmark', { default: 'Remove from Bookmarks' })
                : t('education.addBookmark', { default: 'Add to Bookmarks' })
            }
            variants={buttonVariants}
            initial="idle"
            animate={isLoading ? 'clicked' : 'idle'}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <BookmarkIcon className="h-5 w-5" />
          </motion.button>
        </div>
        <motion.div
          className="p-4 bg-green-50 min-h-[200px] flex flex-col justify-between"
          initial="initial"
          animate="animate"
        >
          <motion.h3
            className="text-xl font-medium text-teal-600 mb-2"
            custom={0}
            variants={contentVariants}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-700 mb-4 line-clamp-3"
            custom={1}
            variants={contentVariants}
          >
            {content}
          </motion.p>
          <motion.div
            className="flex justify-between items-center"
            custom={2}
            variants={contentVariants}
          >
            <span className="text-sm text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
              {category}
            </span>
            <motion.div
              className="text-sm text-teal-600 flex items-center font-medium"
              variants={readMoreVariants}
              initial="initial"
              whileHover="hover"
            >
              {t('home.readMore', { default: 'Read more' })}
              <ArrowRight
                className={`w-4 h-4 ${currentLocale === 'ar' ? 'mr-1' : 'ml-1'}`}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}