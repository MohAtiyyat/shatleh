export type Locale = "en" | "ar";

export interface Name {
    en: string;
    ar: string;
}

export interface Product {
    id: number;
    name_en: string;
    name_ar: string;
    price: string; // Backend returns price as string
    image: string; // Fixed: Removed invalid union type
    description_en: string;
    description_ar: string;
    availability: boolean; // Fixed: Changed from number to boolean to match backend
    sold_quantity: number;
    category_id?: number | null;
    category_en?: string | null;
    category_ar?: string | null;
    rating?: number;
}

export interface Category {
    id: number;
    name: Name;
    subcategories: Category[]; // Allows nested subcategories
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
    title: Name;
    description: Name;
    date: Name;
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