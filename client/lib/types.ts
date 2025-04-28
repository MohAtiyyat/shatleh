
export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Product {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  price: string;
  rating: number;
  image: string;
  category: string;
  categoryAr: string;
  inStock: boolean;
  isTopSelling?: boolean;
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
