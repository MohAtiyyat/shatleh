export interface Product {
    id: number
    name: {
        en: string
        ar: string
    }
    description: {
        en: string
        ar: string
    }
    price?: string
    rating: number
    image: string
    category?: string
    categoryAr?: string
    inStock?: boolean
    isTopSelling?: boolean
}

export interface Category {
    id: number;
    title: {
        en: string;
        ar: string;
    };
    svg: string;
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
    id: number
    title: {
        en: string
        ar: string
    }
    description: {
        en: string
        ar: string
    }
    date: {
        en: string
        ar: string
    }
    image: string
}

export interface CustomerReview {
    name: string
    review: string
    image: string
    rating: number
}

export interface HeroSlide {
    image: string
    subtitle: string
    title: string
    description: string
}

export type Locale = "en" | "ar"
