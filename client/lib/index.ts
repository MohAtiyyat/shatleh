// lib/index.ts
export type Locale = "en" | "ar";
export interface BlogPost {
    id: number;
    title_en: string;
    title_ar: string;
    content_en: string;
    content_ar: string;
    category_id?: number;
    category_en?: string;
    category_ar?: string;
    product_id?: number;
    product_en?: string;
    product_ar?: string;
    product_image?: string;
    image: string;
}
export interface PostFilterCategory {
    id: number;
    name: Name;
    selected: boolean;
}

export interface PostFiltersState {
    categories: PostFilterCategory[];
}
export interface CustomerReview {
    name: string;
    review: string;
    image: string;
    rating: number;
}

export interface HeroSlide {
    image: string;
    subtitle: string;
    title: string;
    description: string;
}

export interface CartItem {
    id: number;
    product_id?: number;
    name_en: string;
    name_ar: string;
    description: Name;
    price: string;
    image: string;
    quantity: number;
}

export interface BackendCartItem {
    id: number;
    product_id: number;
    customer_id: string;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    price: number | string;
    image: string;
    quantity: number;
}

export interface FilterCategory {
    id: number;
    name: Name;
    selected: boolean;
    subcategories: {
        id: number;
        name: Name;
        selected: boolean;
    }[];
}

export interface FilterRating {
    id: number;
    name: Name;
    stars: number;
    selected: boolean;
}

export interface FiltersState {
    categories: FilterCategory[];
    availability: FilterRating[];
    ratings: FilterRating[];
    bestSelling: boolean;
}

export interface Review {
    id: number;
    rating: number;
    text: string;
    customer_name: string;
    created_at: string;
}

export interface Name {
    en: string;
    ar: string;
}

export interface Product {
    id: number;
    name_en: string;
    name_ar: string;
    price: string;
    image: string | string[];
    description_en: string;
    description_ar: string;
    availability: boolean;
    sold_quantity?: number;
    categories: {
        id: number;
        name_en: string;
        name_ar: string;
        parent_id: number | null;
    }[];
    rating?: number;
}

export interface Category {
    id: number;
    name: Name;
    image: string;
    subcategories: Category[];
}

export interface Service {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    image: string;
}

export interface FormErrors {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    giftFirstName?: string;
    giftLastName?: string;
    giftPhoneNumber?: string;
}

export interface UserData {
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface Address {
    id: number;
    title: string;
    country_id: number;
    country_name: string | null;
    city: string;
    address_line: string;
    is_default: boolean;
}

export interface FormData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    paymentMethod: 'credit-card' | 'cash';
    isGift: boolean;
    giftFirstName: string;
    giftLastName: string;
    giftPhoneNumber: string;
}

export interface FormErrors {
    giftFirstName?: string;
    giftLastName?: string;
    giftPhoneNumber?: string;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    address?: string;
    general?: string;
}

export interface OrderProduct {
    id: number;
    name: Name;
    price: string;
    quantity: number;
    image: string;
    categories: { id: number; name: string }[];
}

export interface OrderAddress {
    id: number;
    title: string;
    city: string;
    address_line: string;
}

export interface OrderCoupon {
    id: number;
    code: string;
}

export interface Order {
    id: number;
    order_code: string;
    total_price: number;
    status: string;
    order_date: string;
    products: OrderProduct[];
    address: OrderAddress | null;
    coupon: OrderCoupon | null;
}

export interface ServiceRequest {
    id: number;
    customer_id: string;
    service: Service;
    address: OrderAddress | null;
    details: string;
    image: string | null;
    status: string;
    created_at: string;
}