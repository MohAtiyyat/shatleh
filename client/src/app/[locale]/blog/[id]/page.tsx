'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '../../../../../components/breadcrumb';
import { BlogPost } from '../../../../../lib/index';
import { fetchBlogPosts } from '../../../../../lib/api';
import { useProducts } from '../../../../../lib/ProductContext';
import Link from 'next/link';
import { useStickyFooter } from '../../../../../lib/useStickyFooter';
import BlogCard from '../../../../../components/post/blog-card';

export default function PostPage() {
  const t = useTranslations('education');
  const params = useParams();
  const pathname = usePathname();
  const currentLocale: 'en' | 'ar' = (pathname.split('/')[1] || 'ar') as 'en' | 'ar';
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFooterVisible = useStickyFooter('footer');
  // Ref to track the main content container height
  const contentRef = useRef<HTMLDivElement>(null);

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
        const postsData = await fetchBlogPosts(currentLocale);
        const selectedPost = postsData.find((p) => p.id.toString() === postId);
        if (!selectedPost) {
          setError(t('error.postNotFound'));
        } else {
          setPost(selectedPost);
          const related = postsData
            .filter(
              (p) =>
                p.id.toString() !== postId &&
                (p.category_id === selectedPost.category_id ||
                  (selectedPost.product_id && p.product_id === selectedPost.product_id))
            )
            .slice(0, 3);
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
  }, [postId, currentLocale, t]);

  const { allProducts } = useProducts();
  const relatedCategory = post?.category_id;
  const relatedProducts = allProducts
    .filter((product) => product.category_id === relatedCategory)
    .slice(0, 3);
  const postProduct = allProducts.find((product) => product.id === post?.product_id || 0);

  // Skeleton Loader Component
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

        <h1 className="text-[#1a5418] text-3xl md:text-4xl font-medium mb-8">
          {currentLocale === 'ar' ? post.title_ar : post.title_en}
        </h1>

        <div className="mb-8">
          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={post.image || '/placeholder.svg'}
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
            <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm">
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
                  <p key={index} className="text-gray-700 mb-6 leading-relaxed">
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
                                  process.env.NEXT_PUBLIC_API_URL + "/" + postProduct.image[0]) ||
                                '/placeholder.svg'
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
                                      '/placeholder.svg'
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
                                      ? product.category_ar
                                      : product.category_en}
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
              marginTop: paragraphCount <= 3 ? '1rem' : '2rem', // Dynamic margin based on content length
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