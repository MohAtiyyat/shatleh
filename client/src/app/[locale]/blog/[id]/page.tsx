'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '../../../../../components/breadcrumb';
import { BlogPost } from '../../../../../lib/index';
import { fetchBlogPosts, fetchBookmarkedPosts, toggleBookmark, getAuthToken } from '../../../../../lib/api';
import { useProducts } from '../../../../../lib/ProductContext';
import Link from 'next/link';
import { useStickyFooter } from '../../../../../lib/useStickyFooter';
import BlogCard from '../../../../../components/post/blog-card';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon } from 'lucide-react';

export default function PostPage() {
  const t = useTranslations('education');
  const params = useParams();
  const pathname = usePathname();
  const currentLocale: 'en' | 'ar' = (pathname.split('/')[1] || 'ar') as 'en' | 'ar';
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<(BlogPost & { bookmarked?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isFooterVisible = useStickyFooter('footer');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError(t('error.postNotFound'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const postsData = await fetchBlogPosts();
        const selectedPost = postsData.find((p) => p.id.toString() === postId);
        if (!selectedPost) {
          setError(t('error.postNotFound'));
        } else {
          setPost(selectedPost);
          let related = postsData
            .filter(
              (p) =>
                p.id.toString() !== postId &&
                (p.category_id === selectedPost.category_id ||
                  (selectedPost.product_id && p.product_id === selectedPost.product_id))
            )
            .slice(0, 3);

          if (isAuthenticated) {
            const bookmarkedPosts = await fetchBookmarkedPosts();
            const bookmarkedIds = new Set(bookmarkedPosts.map((p) => p.id.toString()));
            related = related.map((p) => ({
              ...p,
              bookmarked: bookmarkedIds.has(p.id.toString()),
            }));
            setIsBookmarked(bookmarkedIds.has(postId));
          }

          setRelatedPosts(related);
        }
      } catch (err) {
        setError(t('error.fetchFailed'));
        console.error('Failed to fetch post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, currentLocale, t, isAuthenticated]);

  // Bookmark toggle handler
  const handleBookmarkToggle = async () => {
    if (!post || !isAuthenticated) return;

    try {
      const newBookmarkState = await toggleBookmark(post.id);
      setIsBookmarked(newBookmarkState);
      setError(null);

      setRelatedPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, bookmarked: newBookmarkState } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setError(t('error.bookmarkFailed', { defaultMessage: 'Failed to bookmark post' }));
    }
  };

  const { allProducts } = useProducts();
  const relatedCategory = post?.category_id;
  const relatedProducts = allProducts
    .filter((product) => product.categories && product.categories.length > 0 && product.categories[0].id === relatedCategory)
    .slice(0, 3);
  const postProduct = allProducts.find((product) => product.id === post?.product_id || 0);

  const buttonVariants = {
    idle: { scale: 1, rotate: 0, opacity: 1 },
    clicked: {
      scale: [1, 1.2, 0.9, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const SkeletonLoader = () => (
    <div className={`bg-[#e8f5e9] ${currentLocale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <h1 className="h-10 bg-gray-300 rounded w-3/4 mb-8 animate-pulse"></h1>
        <div className="mb-8">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        <div className="mb-6">
          <span className="h-6 bg-gray-300 rounded-full w-24 inline-block animate-pulse"></span>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 bg-gray-300 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="space-y-8">
                <div>
                  <h3 className="h-5 bg-gray-300 rounded w-32 mb-4 animate-pulse"></h3>
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="h-5 bg-gray-300 rounded w-32 mb-4 animate-pulse"></h3>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex gap-4 border-b border-gray-200 pb-4">
                        <div className="relative w-20 h-20 bg-gray-300 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="full-width mx-auto">
            <h3 className="h-5 bg-gray-300 rounded w-48 mb-4 animate-pulse"></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm h-[400px] animate-pulse">
                  <div className="h-56 w-full bg-gray-300"></div>
                  <div className="p-4 bg-gray-50 flex flex-col">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-5 bg-gray-300 rounded-full w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error || t('error.postNotFound')}</p>
        </div>
      </div>
    );
  }

  // Calculate the number of paragraphs for dynamic spacing
  const paragraphCount = (currentLocale === 'ar' ? post.content_ar : post.content_en)
    .split('\n')
    .filter((p) => p.trim()).length;

  return (
    <div className={`bg-[#e8f5e9] ${currentLocale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="mb-6">
          <Breadcrumb
            pageName="blog"
            product={currentLocale === 'ar' ? post.title_ar : post.title_en}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-[#1a5418] text-2xl sm:text-3xl md:text-4xl font-medium">
            {currentLocale === 'ar' ? post.title_ar : post.title_en}
          </h1>
          {isAuthenticated && (
            <div className="relative">
              <motion.button
                onClick={handleBookmarkToggle}
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                  isBookmarked
                    ? 'bg-[#038c8c] text-white'
                    : 'bg-white text-[#038c8c] border border-[#038c8c]'
                } hover:bg-[#026969] hover:text-white transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[#038c8c] focus:ring-offset-2 text-sm sm:text-base font-medium`}
                aria-label={
                  isBookmarked
                    ? t('removeBookmark', { defaultMessage: 'Remove bookmark from this post' })
                    : t('addBookmark', { defaultMessage: 'Bookmark this post' })
                }
                variants={buttonVariants}
                initial="idle"
                animate={isBookmarked ? 'clicked' : 'idle'}
                whileHover={{ scale: 1.05 }}
                whileFocus={{ scale: 1.05 }}
              >
                <BookmarkIcon
                  className="h-5 w-5"
                  fill={isBookmarked ? '#ffffff' : 'none'}
                  stroke={isBookmarked ? '#ffffff' : '#038c8c'}
                />
                <span className="hidden sm:inline">
                  {isBookmarked
                    ? t('removeBookmark', { defaultMessage: 'Remove Bookmark' })
                    : t('addBookmark', { defaultMessage: 'Bookmark' })}
                </span>
              </motion.button>
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="absolute left-0 right-0 mt-2 text-center text-red-600 text-xs sm:text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={post.image || '/7.svg'}
              alt={currentLocale === 'ar' ? post.title_ar : post.title_en}
              fill
              className="object-cover rounded-md"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>

        {post.category_en && post.category_ar && (
          <div className="mb-6">
            <span className="bg-[#038c8c] text-white px-4 py-2 rounded-full text-sm">
              {currentLocale === 'ar' ? post.category_ar : post.category_en}
            </span>
          </div>
        )}

        <div ref={contentRef} className="flex flex-col gap-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {(currentLocale === 'ar' ? post.content_ar : post.content_en)
                .split('\n')
                .filter((p) => p.trim())
                .map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-6 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}
            </div>

            {(post.product_id || relatedProducts.length > 0) && (
              <div className="lg:w-1/3">
                <div
                  className={`space-y-8 z-10 ${
                    isFooterVisible ? 'relative' : 'sticky top-20'
                  }`}
                >
                  {post.product_id && (
                    <div>
                      <h3 className="text-[#1a5418] uppercase text-sm font-medium mb-4">
                        {t('postProduct', { defaultMessage: 'Post Product' })}
                      </h3>
                      <Link href={`/${currentLocale}/products/${post.product_id}`} scroll={true}>
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={
                                (postProduct &&
                                  process.env.NEXT_PUBLIC_API_URL + postProduct.image[0]) ||
                                '/7.svg'
                              }
                              alt={
                                currentLocale === 'ar'
                                  ? post.product_ar || ''
                                  : post.product_en || ''
                              }
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="text-sm">
                              {currentLocale === 'ar' ? post.product_ar : post.product_en}
                            </p>
                            <p className="text-xs text-[#1a5418] uppercase font-medium">
                              {currentLocale === 'ar' ? post.category_ar : post.category_en}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {relatedProducts.length > 0 && (
                    <div>
                      <h3 className="text-[#1a5418] uppercase text-sm font-medium mb-4">
                        {t('relatedProducts', { defaultMessage: 'Related Products' })}
                      </h3>
                      <div className="space-y-4">
                        {relatedProducts.map((product, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4">
                            <Link
                              href={`/${currentLocale}/products/${product.id}`}
                              scroll={true}
                            >
                              <div className="flex gap-4">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                  <Image
                                    src={
                                      (process.env.NEXT_PUBLIC_API_URL + product.image[0]) ||
                                      '/7.svg'
                                    }
                                    alt={
                                      currentLocale === 'ar'
                                        ? product.name_ar
                                        : product.name_en
                                    }
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm">
                                    {currentLocale === 'ar'
                                      ? product.name_ar
                                      : product.name_en}
                                  </p>
                                  <p className="text-xs text-[#1a5418] uppercase font-medium">
                                    {currentLocale === 'ar'
                                      ? product.categories && product.categories[0].name_ar
                                      : product.categories && product.categories[0].name_en}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="full-width mx-auto"
            style={{
              marginTop: paragraphCount <= 3 ? '1rem' : '2rem',
            }}
          >
            <h3 className="text-[#1a5418] uppercase text-sm font-medium mb-4">
              {t('relatedArticles', {
                defaultMessage: 'Here are some related articles you may find interesting',
              })}
            </h3>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    post={relatedPost}
                    currentLocale={currentLocale}
                    setPosts={setRelatedPosts}
                    pageName="blog"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {t('noRelatedArticles', { defaultValue: 'No related articles found' })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}