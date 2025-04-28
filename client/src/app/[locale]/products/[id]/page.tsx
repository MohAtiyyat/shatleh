"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingCart, ShoppingBag } from "lucide-react";
import { ProductTabs } from "../../../../../components/productsDetails/product-tabs";
import ProductCarousel from "../../../../../components/productsDetails/product-carousel";
import ExpandableDescription from "../../../../../components/productsDetails/expandable-description";
import CartSidebar from "../../../../../components/productsDetails/cart-sidebar";
import { useCartStore } from "../../../../../lib/store";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import Breadcrumb from "../../../../../components/breadcrumb";

// Mock products data
const mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: {
        en: "Calathea Plant",
        ar: "نبات كالاثيا",
    },
    description: {
        en: "Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet. consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit",
        ar: "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إلي.لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليلوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت",
    },
    price: "4.5JD",
    rating: 5,
    image:
        "https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category:
        i % 4 === 0 ? "Seeds" : i % 4 === 1 ? "Home Plants" : i % 4 === 2 ? "Fruit plants" : "Supplies",
    categoryAr:
        i % 4 === 0 ? "بذور" : i % 4 === 1 ? "نباتات منزلية" : i % 4 === 2 ? "نباتات مثمرة" : "مستلزمات",
    inStock: i % 3 !== 0,
    isTopSelling: i % 5 === 0,
}));

export default function ProductDetailsPage() {
    const t = useTranslations("");
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = pathname.split('/')[1] || 'ar';
    const productId = parseInt(params.id as string);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { items, addItem, updateQuantity, isLoading } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    // Find the product
    const product = mockProducts.find((p) => p.id === productId);

    // Get current quantity from cart
    const cartItem = items.find((item) => item.id === productId);
    const quantity = cartItem?.quantity || 0;

    // Handle quantity update
    const handleUpdateQuantity = async (newQuantity: number) => {
        if (!product) return;
        setIsAdding(true);
        try {
            await updateQuantity(product.id, newQuantity, currentLocale);
        } catch (error) {
            console.error("Error updating quantity:", error);
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
                    id: product.id,
                    name: product.name,
                    price: product.price || "0",
                    image: product.image,
                },
                currentLocale
            );
            setIsCartOpen(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    // Handle buy now
    const handleBuyNow = async () => {
        if (!product) return;
        setIsAdding(true);
        try {
            // Add item to cart if not already added
            if (quantity === 0) {
                await addItem(
                    {
                        id: product.id,
                        name: product.name,
                        price: product.price || "0",
                        image: product.image,
                    },
                    currentLocale
                );
            } else if (quantity !== cartItem?.quantity) {
                // Update quantity if changed
                await updateQuantity(product.id, quantity, currentLocale);
            }
            // Navigate to checkout
            router.push(`/${currentLocale}/checkout`);
        } catch (error) {
            console.error("Error during buy now:", error);
        } finally {
            setIsAdding(false);
        }
    };

    // Mock tab content
    const tabContent = [
        {
            id: "description",
            label: t("products.description", { defaultMessage: currentLocale === "en" ? "Description" : "الوصف" }),
            content: (
                <ExpandableDescription
                    shortDescription={product?.description[currentLocale as "en" | "ar"].split(".")[0] || ""}
                    fullDescription={
                        product?.description[currentLocale as "en" | "ar"] +
                        ". " +
                        (currentLocale === "en"
                            ? "This plant is perfect for indoor spaces, offering lush greenery and easy maintenance."
                            : "هذا النبات مثالي للمساحات الداخلية، يوفر خضرة مورقة وصيانة سهلة.")
                    }
                    moreText={t("products.readMore", { defaultMessage: currentLocale === "en" ? "More ..." : "المزيد ..." })}
                    lessText={t("products.readLess", { defaultMessage: currentLocale === "en" ? "Less" : "أقل" })}
                />
            ),
        },
        {
            id: "specification",
            label: t("products.specification", { defaultMessage: currentLocale === "en" ? "Specification" : "المواصفات" }),
            content: (
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">
                        {t("products.technicalSpecifications", {
                            defaultMessage: currentLocale === "en" ? "Technical Specifications" : "المواصفات الفنية",
                        })}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="flex gap-x-2">
                                <span className="font-medium">
                                    {t("products.size", { defaultMessage: currentLocale === "en" ? "Size" : "الحجم" })}:
                                </span>
                                <span>{currentLocale === "en" ? "Medium" : "متوسط"}</span>
                            </p>
                            <p className="flex gap-x-2">
                                <span className="font-medium">
                                    {t("products.type", { defaultMessage: currentLocale === "en" ? "Type" : "النوع" })}:
                                </span>
                                <span>{product ? currentLocale === "en" ? product.category : product.categoryAr : ""}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="flex gap-x-2">
                                <span className="font-medium">
                                    {t("products.care", { defaultMessage: currentLocale === "en" ? "Care Level" : "مستوى العناية" })}:
                                </span>
                                <span>{currentLocale === "en" ? "Low" : "منخفض"}</span>
                            </p>
                            <p className="flex gap-x-2">
                                <span className="font-medium">
                                    {t("products.light", { defaultMessage: currentLocale === "en" ? "Light" : "الإضاءة" })}:
                                </span>
                                <span>{currentLocale === "en" ? "Indirect" : "غير مباشر"}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "reviews",
            label: t("products.reviews", { defaultMessage: currentLocale === "en" ? "Reviews" : "التقييمات" }),
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border border-[#d0d5dd] rounded-lg p-4 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-[#d0d5dd] rounded-full flex items-center justify-center text-[#667085]">
                                    <span className="text-xs">AM</span>
                                </div>
                                <span className="font-medium">
                                    {currentLocale === "en" ? "Alex Morningstar" : "أليكس مورنينغستار"}
                                </span>
                                <div className="ml-auto flex">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star
                                            key={j}
                                            className={`w-4 h-4 ${j < 4 ? "fill-[#20c015] text-[#20c015]" : "text-[#d0d5dd]"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <h3 className="font-medium mb-1">
                                {currentLocale === "en" ? "Great Product!" : "منتج رائع!"}
                            </h3>
                            <p className="text-sm text-[#667085]">
                                {currentLocale === "en"
                                    ? "This plant is beautiful and easy to care for."
                                    : "هذا النبات جميل وسهل العناية به."}
                            </p>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    if (!product) {
        return (
            <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-[#0f4229]">{t("products.notFound")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#e8f5e9] overflow-hidden ${currentLocale === "ar" ? "rtl" : "ltr"}`}>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Product Details */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Image */}
                    <div className="md:w-1/2 lg:w-5/12">
                        <Breadcrumb pageName={"products"} product={product.name[currentLocale as "en" | "ar"]} />
                        <div className="rounded-lg overflow-hidden">
                            <Image
                                src={product.image || "/placeholder.svg?height=400&width=400"}
                                alt={product.name[currentLocale as "en" | "ar"] || "Product Image"}
                                width={400}
                                height={400}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="md:w-1/2 lg:w-7/12">
                        <h1 className="text-3xl font-medium text-[#026e78] mb-3">
                            {product.name[currentLocale as "en" | "ar"]}
                        </h1>
                        <p className="text-[#667085] mb-4">{product.description[currentLocale as "en" | "ar"].split(".")[0]}</p>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm">
                                {currentLocale === "en" ? product.category : product.categoryAr}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="flex mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < product.rating ? "fill-[#20c015] text-[#20c015]" : "text-[#d0d5dd]"}`}
                                />
                            ))}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <p className="text-[#667085] text-sm">{t("products.price")}</p>
                            <p className="text-3xl font-semibold text-[#026e78]">{product.price}</p>
                        </div>

                        {/* If product is out of stock */}
                        {product.inStock === false && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-[#038c8c] text-white px-3 py-1 rounded-full text-sm">
                                    {t("products.outOfStock")}
                                </span>
                            </div>
                        )}

                        {/* Quantity and Buttons */}
                        <div className="flex flex-wrap gap-4 items-center">
                            {quantity === 0 ? (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isLoading || product.inStock === false}
                                    className={`bg-white text-[#337a5b] px-4 py-2 rounded-md transition-colors flex items-center ${isAdding || isLoading || product.inStock === false ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-200"
                                        }`}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {t("products.addToCart")}
                                </button>
                            ) : (
                                <div className="flex items-center rounded-md overflow-hidden border border-[#d0d5dd]">
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity - 1)}
                                        disabled={isAdding || isLoading}
                                        className={`px-3 py-2 text-[#667085] ${isAdding || isLoading ? "opacity-70 cursor-wait" : ""}`}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center bg-transparent border-x border-[#d0d5dd]">{quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(quantity + 1)}
                                        disabled={isAdding || isLoading || product.inStock === false}
                                        className={`px-3 py-2 text-[#667085] ${isAdding || isLoading || product.inStock === false ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleBuyNow}
                                disabled={isAdding || isLoading || product.inStock === false}
                                className={`bg-[#8dfb9e] text-[#121619] px-6 py-2 rounded-full transition-colors flex items-center ${isAdding || isLoading || product.inStock === false ? "opacity-70 cursor-not-allowed" : "hover:bg-[#27eb00]"
                                    }`}
                                title={isAdding || isLoading ? t("products.processing") : ""}
                            >
                                {t("products.buyNow")}
                                <ShoppingCart className="w-4 h-4 mx-2" />
                            </button>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="border border-[#d0d5dd] text-[#667085] px-6 py-2 rounded-full hover:bg-white transition-colors flex items-center"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                {t("products.viewCart")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs and Reviews */}
            <div className="md:max-w-7xl mx-auto px-4 py-12">
                <ProductTabs tabs={tabContent} initialTab="description" />
            </div>

            {/* Suggested Products */}
            <div className="border-t border-[#d0d5dd] py-8   items-center justify-center bg-[#e8f5e9]">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-xl font-medium text-center mb-8 text-[#337a5b]">
                        {t("products.suggestedProducts")}
                    </h2>
                    <ProductCarousel products={mockProducts} />
                </div>
            </div>
        </div>
    );
}