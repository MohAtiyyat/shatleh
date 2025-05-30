'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, Minus, Plus, ShoppingCart, ShoppingBag } from 'lucide-react';
import ProductCarousel from '../../../../../components/productsDetails/product-carousel';
import CartSidebar from '../../../../../components/productsDetails/cart-sidebar';
import ProductDetailsSkeleton from '../../../../../components/productsDetails/product-details-skeleton';
import { useCartStore } from '../../../../../lib/store';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Breadcrumb from '../../../../../components/breadcrumb';
import { useProducts } from '../../../../../lib/ProductContext';
import { useAuth } from '../../../../../lib/AuthContext';
import { formatPrice, getRelatedProducts } from '../../../../../lib/utils';
import { fetchCategories, fetchProductReviews } from '../../../../../lib/api';
import { Category, Review } from '../../../../../lib/index';
import ExpandableDescription from '../../../../../components/productsDetails/expandable-description';
import { ProductTabs } from '../../../../../components/productsDetails/product-tabs';
import ProductImagesCarousel from '../../../../../components/productsDetails/ProductImageSwiper';

export default function ProductDetailsPage() {
    const t = useTranslations('');
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const productId = parseInt(params.id as string);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { items, addItem, updateQuantity, isLoading: isCartLoading } = useCartStore();
    const { allProducts, isLoading } = useProducts();
    const { userId } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [isReviewsLoading, setIsReviewsLoading] = useState(true);

    // Find the product
    const product = allProducts.find((p) => p.id === productId);

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            setIsCategoriesLoading(true);
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Find category and subcategory for the product
    useEffect(() => {
        if (product && product.categories && product.categories.length > 0 && categories.length > 0) {
            let foundCategory = '';
            let foundSubcategory = '';

            // Iterate over product.categories to find primary category and subcategory
            product.categories.forEach((productCat) => {
                // Find matching category or subcategory in fetched categories
                for (const category of categories) {
                    // Check if the product category is a primary category
                    if (category.id === productCat.id && productCat.parent_id === null) {
                        foundCategory = currentLocale === 'ar' ? category.name.ar : category.name.en;
                    }
                    // Check if the product category is a subcategory
                    const subcategory = category.subcategories.find((sub) => sub.id === productCat.id && productCat.parent_id !== null);
                    if (subcategory) {
                        foundCategory = currentLocale === 'ar' ? category.name.ar : category.name.en;
                        foundSubcategory = currentLocale === 'ar' ? subcategory.name.ar : subcategory.name.en;
                    }
                }
            });

            setCategoryName(foundCategory);
            setSubcategoryName(foundSubcategory);
        } else {
            setCategoryName('');
            setSubcategoryName('');
        }
    }, [product, categories, currentLocale]);

    // Fetch reviews on mount
    useEffect(() => {
        const loadReviews = async () => {
            setIsReviewsLoading(true);
            try {
                const { reviews, averageRating } = await fetchProductReviews(productId);
                setReviews(reviews);
                setAverageRating(averageRating);
            } catch (error) {
                console.error('Failed to load reviews:', error);
                setReviews([]);
                setAverageRating(0);
            } finally {
                setIsReviewsLoading(false);
            }
        };
        if (productId) {
            loadReviews();
        }
    }, [productId]);

    // Handle quantity update
    const handleUpdateQuantity = async (newQuantity: number) => {
        if (!product) return;
        setIsAdding(true);
        try {
            await updateQuantity(product.id, newQuantity, userId, currentLocale);
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setIsAdding(false);
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
            await addItem(
                {
                    product_id: product.id,
                    name_en: product.name_en,
                    name_ar: product.name_ar,
                    description_en: product.description_en,
                    description_ar: product.description_ar,
                    price: product.price,
                    image: product.image[0],
                },
                userId,
                currentLocale
            );
            setIsCartOpen(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    // Handle buy now
    const handleBuyNow = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
            const cartItem = items.find((item) => item.product_id === product.id);
            if (!cartItem) {
                await addItem(
                    {
                        product_id: product.id,
                        name_en: product.name_en,
                        name_ar: product.name_ar,
                        description_en: product.description_en,
                        description_ar: product.description_ar,
                        price: product.price,
                        image: product.image[0],
                    },
                    userId,
                    currentLocale
                );
            } else if (cartItem.quantity !== quantity) {
                await updateQuantity(product.id, quantity, userId, currentLocale);
            }
            router.push(`/${currentLocale}/checkout`);
        } catch (error) {
            console.error('Error during buy now:', error);
        } finally {
            setIsAdding(false);
        }
    };




    // Split description into lines
    const description = product && (currentLocale === 'en' ? product.description_en : product.description_ar) || '';
    const descriptionLines = description.split('\n').filter(line => line.trim());
    const shortDescription = descriptionLines.slice(0, 3).join('\n');
    const showReadMore = descriptionLines.length > 5;

    // Memoize related products
    const relatedProducts = useMemo(() => {
        return product ? getRelatedProducts(product, allProducts, categories) : [];
    }, [product, allProducts, categories]);

    // Tab content
    const tabContent = [
        {
            id: 'description',
            label: t('products.description', { defaultMessage: currentLocale === 'en' ? 'Description' : 'الوصف' }),
            content: (
                <div className="text-[#667085]">
                    {showReadMore ? (
                        <ExpandableDescription
                            shortDescription={shortDescription}
                            fullDescription={description}
                            moreText={t('products.readMore', { defaultMessage: currentLocale === 'en' ? 'More ...' : 'المزيد ...' })}
                            lessText={t('products.readLess', { defaultMessage: currentLocale === 'en' ? 'Less' : 'أقل' })}
                        />
                    ) : (
                        <p>{description}</p>
                    )}
                </div>
            ),
        },
        {
            id: 'reviews',
            label: t('products.reviews', { defaultMessage: currentLocale === 'en' ? 'Reviews' : 'التقييمات' }),
            content: (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-medium text-[#026e78]">
                                {averageRating.toFixed(1)} / 5
                            </span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-[#20c015] text-[#20c015]' : 'text-[#d0d5dd]'}`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                    {isReviewsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="border border-[#d0d5dd] rounded-lg p-4 bg-white animate-pulse">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-[#d0d5dd] rounded-full"></div>
                                        <div className="h-4 bg-[#d0d5dd] w-1/3 rounded"></div>
                                        <div className="ml-auto flex gap-1">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <div key={j} className="w-4 h-4 bg-[#d0d5dd] rounded"></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-4 bg-[#d0d5dd] w-1/2 rounded mb-2"></div>
                                    <div className="h-3 bg-[#d0d5dd] w-full rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-[#667085]">{t('products.noReviews')}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-[#d0d5dd] rounded-lg p-4 bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-[#d0d5dd] rounded-full flex items-center justify-center text-[#667085]">
                                            <span className="text-xs">{review.customer_name[0]}</span>
                                        </div>
                                        <span className="font-medium">{review.customer_name}</span>
                                        <div className="ml-auto flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-[#20c015] text-[#20c015]' : 'text-[#d0d5dd]'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#667085]">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
    ];

    // Get current quantity from cart
    const cartItem = items.find((item) => item.product_id === productId);
    const quantity = cartItem?.quantity || 0;

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-[#0f4229]">{t('products.notFound')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#e8f5e9] overflow-hidden ${currentLocale === 'ar' ? 'rtl' : 'ltr'}`}>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2 lg:w-5/12">
                        <Breadcrumb pageName={'products'} product={currentLocale === 'en' ? product.name_en : product.name_ar} />
                        <ProductImagesCarousel
                        images={Array.isArray(product.image) ? product.image : [product.image]}
                        productName={currentLocale === 'en' ? product.name_en : product.name_ar}
                        locale={currentLocale}
                        />
                    </div>

                    <div className="md:w-1/2 lg:w-7/12 mt-6">
                        <h1 className="text-3xl font-medium text-[#026e78] mb-3">{currentLocale === 'en' ? product.name_en : product.name_ar}</h1>
                        <p className="text-[#667085] mb-4">{(currentLocale === 'en' ? product.description_en : product.description_ar).split('.')[0]}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {isCategoriesLoading ? (
                                <>
                                    <div className="bg-gray-200 h-6 w-24 rounded-full animate-pulse"></div>
                                    <div className="bg-gray-200 h-6 w-32 rounded-full animate-pulse ml-2"></div>
                                </>
                            ) : (
                                <>
                                    {categoryName ? (
                                        <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm w-fit">
                                            {categoryName}
                                        </span>
                                    ) : (
                                        <span className="text-[#667085] text-sm">{t('products.noCategory')}</span>
                                    )}
                                    {subcategoryName && (
                                        <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm w-fit ml-2">
                                            {subcategoryName}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-[#20c015] text-[#20c015]' : 'text-[#d0d5dd]'}`}
                                />
                            ))}
                            <span className="ml-2 text-[#667085] text-sm">({averageRating.toFixed(1)})</span>
                        </div>

                        <div className="mb-6">
                            <p className="text-[#667085] text-sm">{t('products.price')}</p>
                            <p className="text-3xl font-semibold text-[#026e78]">
                                {product.price && !isNaN(parseFloat(product.price))
                                    ? formatPrice(parseFloat(product.price), currentLocale)
                                    : t('products.contactForPrice')}
                            </p>
                        </div>

                        {!product.availability && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm">{t('products.outOfStock')}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 items-center">
                            {quantity === 0 ? (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isCartLoading || !product.availability}
                                    className={`bg-white text-[#337a5b] px-4 py-2 rounded-md transition-colors flex items-center ${isAdding || isCartLoading || !product.availability ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {t('products.addToCart')}
                                </button>
                            ) : (
                                <div className="flex items-center rounded-md overflow-hidden border border-[#d0d5dd]">
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity - 1)}
                                        disabled={isAdding || isCartLoading}
                                        className={`px-3 py-2 text-[#667085] ${isAdding || isCartLoading ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center bg-transparent border-x border-[#d0d5dd]">{quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity + 1)}
                                        disabled={isAdding || isCartLoading || !product.availability}
                                        className={`px-3 py-2 text-[#667085] ${isAdding || isCartLoading || !product.availability ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleBuyNow}
                                disabled={isAdding || isCartLoading || !product.availability}
                                className={`bg-[#8dfb9e] text-[#121619] px-6 py-2 rounded-full transition-colors flex items-center ${isAdding || isCartLoading || !product.availability ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#27eb00]'}`}
                                title={isAdding || isCartLoading ? t('products.processing') : ''}
                            >
                                {t('products.buyNow')}
                                <ShoppingCart className="w-4 h-4 mx-2" />
                            </button>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="border border-[#d0d5dd] text-[#667085] px-6 py-2 rounded-full hover:bg-white transition-colors flex items-center"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                {t('products.viewCart')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:max-w-7xl mx-auto px-4 py-7">
                <ProductTabs tabs={tabContent} initialTab="description" />
            </div>

            <div className="border-t border-[#d0d5dd] py-8 items-center justify-center bg-[#e8f5e9]">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-xl font-medium text-center mb-8 text-[#337a5b]">{t('products.suggestedProducts')}</h2>
                    <ProductCarousel products={relatedProducts} />
                </div>
            </div>
        </div>
    );
}