
export interface LocalizedString {
  en: string;
  ar: string;
}



export interface CartItem {
  id: number;
  product_id?: number;
  name: LocalizedString;
  description: LocalizedString;
  price: string;
  image: string;
  quantity: number;
}

export interface FilterOption {
  id: number;
  name: LocalizedString;
  selected: boolean;
  count?: number;
  stars?: number;
}

export interface Filters {
  categories: FilterOption[];
  availability: FilterOption[];
  ratings: FilterOption[];
  bestSelling: boolean;
}

export interface Name {
  en: string;
  ar: string;
}

export interface Category {
  id: number;
  name: Name;
  subcategories: Category[];
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
  category_id?: number;
  category_en?: string;
  category_ar?: string;
  rating?: number;
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
  count: number;
  stars: number;
  selected: boolean;
}

export interface FiltersState {
  categories: FilterCategory[];
  availability: FilterRating[];
  ratings: FilterRating[];
  bestSelling: boolean;
}