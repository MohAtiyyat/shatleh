// lib/ProductContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllProducts } from './api';
import type { Product } from './index';

interface ProductContextType {
    allProducts: Product[];
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const products = await fetchAllProducts();
            setAllProducts(products);
            setIsLoading(false);
        };
        loadProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ allProducts, isLoading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

