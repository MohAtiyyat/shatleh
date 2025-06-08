'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fetchBlogPosts } from '../../lib/api';
import type { BlogPost, Locale } from '../../lib';

interface BlogSectionProps {
  currentLocale: Locale;
}

export default function BlogSection({ currentLocale }: BlogSectionProps) {
  const t = useTranslations();
  const blogRef = useRef(null);
  const blogInView = useInView(blogRef, { once: true, margin: '-100px' });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
  };

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postsData = await fetchBlogPosts();
        setPosts(postsData.slice(0, 3));
      } catch (err) {
        setError(t('error.fetchFailed'));
        console.error('Failed to fetch blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [currentLocale, t]);

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm h-[400px] animate-pulse">
      <div className="h-56 w-full bg-gray-300"></div>
      <div className="p-4 bg-[var(--primary-bg)] flex flex-col">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-5 bg-gray-300 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.section
      ref={blogRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-10 rounded-3xl bg-gradient-to-tr from-[var(--primary-bg)] to-[rgba(34,139,34,0.15)] border border-[rgba(34,139,34,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={blogInView ? 'animate' : 'initial'}
      variants={blogVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      id="blog-section"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/bg4.svg')" }}
      ></div>

      <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-color)] mb-8 relative">
        {t('home.interestingBlog')}
        <span className="absolute inset-0 -z-10 bg-[var(--accent-color)] opacity-10 rounded-full filter blur-xl" />
      </h2>

      {error && (
        <motion.p
          className="text-center text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {error}
        </motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          : posts.map((post) => (
              <Link
                key={post.id}
                href={`/${currentLocale}/blog/${post.id}`}
                scroll={true}
              >
                <motion.div
                  id={`blog-post-${post.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={post.image || '/placeholder.svg'}
                    width={400}
                    height={300}
                    alt={currentLocale === 'ar' ? post.title_ar : post.title_en}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4 bg-[var(--primary-bg)] min-h-full">
                    <h3 className="text-xl font-medium text-[var(--accent-color)] mb-2">
                      {currentLocale === 'ar' ? post.title_ar : post.title_en}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      {currentLocale === 'ar' ? post.content_ar.slice(0, 200) + ' ...' : post.content_en.slice(0, 200) + ' ...'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-[var(--accent-color)] flex items-center font-medium">
                        {t('home.readMore')}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={currentLocale === 'ar' ? 'mr-1' : 'ml-1'}
                        >
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d={currentLocale === 'ar' ? 'M12 5L5 12L12 19' : 'M12 5L19 12L12 19'}
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
            {t('home.morePosts')}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={currentLocale === 'ar' ? 'mr-2 inline-block' : 'ml-2 inline-block'}
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={currentLocale === 'ar' ? 'M12 5L5 12L12 19' : 'M12 5L19 12L12 19'}
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
  );
}