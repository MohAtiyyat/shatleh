// lib/ProductContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllProducts } from './api';
import type { Product } from './index';

// Define the context type to include category IDs for filtering
interface ProductContextType {
    allProducts: Product[];
    isLoading: boolean;
    setCategoryIds: (categoryIds: number[]) => void;
}

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ProductProvider component to manage product data and category filtering
export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryIds, setCategoryIds] = useState<number[]>([]); // State for selected category IDs

    // Fetch products when categoryIds change
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            try {
                // Pass categoryIds to fetchAllProducts if any are selected, otherwise fetch all products
                const products = await fetchAllProducts(categoryIds.length > 0 ? categoryIds : undefined);
                setAllProducts(products);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProducts();
    }, [categoryIds]);

    return (
        <ProductContext.Provider value={{ allProducts, isLoading, setCategoryIds }}>
            {children}
        </ProductContext.Provider>
    );
};

// Hook to access the context
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};