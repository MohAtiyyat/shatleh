export type Locale = "en" | "ar";

export interface Name {
    en: string;
    ar: string;
}

export interface Product {
    id: number;
    name_en: string;
    name_ar: string;
    price: string;
    image: string;
    description_en: string;
    description_ar: string;
    availability: boolean;
    sold_quantity: number;
    category_id?: number | null;
    category_en?: string | null;
    category_ar?: string | null;
    rating?: number;
}

export interface Category {
    id: number;
    name: Name;
    subcategories: Category[];
}

export interface Service {
    id: number;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    svg: string;
}

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
    image: string;
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
    name: Name;
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