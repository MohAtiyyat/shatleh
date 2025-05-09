const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
import { mockProducts } from './mockData';
import type { Product, Category, CartItem, Service } from './index';

interface LoginRequest {
    email: string;
    password: string;
    language: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
    };
}

interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    language: string;
    ip_country_id: string;
}

interface RegisterResponse {
    token: string;
    user: {
        id: string;
    };
}

interface ProductsResponse {
    data: Product[];
}

interface RawCategory {
    id: number;
    name_en: string;
    name_ar: string;
    subcategories: {
        id: number;
        name_en: string;
        name_ar: string;
        parent_id: number;
    }[];
}

interface CategoriesResponse {
    data: RawCategory[];
}

interface Address {
    id: number;
    title: string;
    country_id: number;
    country_name: string | null;
    city: string;
    address_line: string;
    is_default: boolean;
}

interface AddressesResponse {
    data: Address[];
}

interface AddressResponse {
    address: Address;
    message: string;
}

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    photo: string | null;
}

interface ProfileResponse {
    data: Profile;
    message?: string;
}

interface ServicesResponse {
    data: Service[];
    message: string;
}

interface ServiceRequestRequest {
    service_id: number;
    address_id: number;
    customer_id: string;
    details: string;
    image?: File;
}

interface ServiceRequestResponse {
    data: {
        id: number;
        user_id: number;
        customer_id: string;
        service_id: number;
        address_id: number;
        details: string;
        image: string | null;
        status: string;
    };
    message: string;
}

interface CartResponse {
    data: CartItem[];
}

interface CartUpdateRequest {
    customer_id: string;
    product_id: number;
    quantity: number;
}

interface CartUpdateResponse {
    message: string;
}

interface CartClearResponse {
    message: string;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
        });
        throw new Error(
            errorData.message || errorData.error || JSON.stringify(errorData.errors) || `HTTP error ${response.status}`
        );
    }
    return response.json() as Promise<T>;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<LoginResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user.id);
        return result;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<RegisterResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user.id);
        return result;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
};

export const logoutApi = async (token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/api/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        await handleResponse<void>(response);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Logout failed');
    }
};

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        console.log('Fetching categories from:', `${API_URL}/api/categories`);
        const response = await fetch(`${API_URL}/api/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<CategoriesResponse>(response);
        // Transform backend response to match Category type
        const transformedCategories: Category[] = data.data.map((category) => ({
            id: category.id,
            name: {
                en: category.name_en,
                ar: category.name_ar,
            },
            subcategories: category.subcategories.map((sub) => ({
                id: sub.id,
                name: {
                    en: sub.name_en,
                    ar: sub.name_ar,
                },
                subcategories: [], // Assuming subcategories are not nested further
            })),
        }));
        console.log('Transformed categories:', transformedCategories);
        return transformedCategories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
};

export const fetchTopProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/api/top_sellers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<ProductsResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch top products');
    }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/api/all_products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<ProductsResponse>(response);
        return data.data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        // Transform mockProducts to match Product type
        return mockProducts.map((product) => ({
            ...product,
            price: product.price.toString(),
            availability: !!product.availability,
            category_id: product.category_id || null,
            category_en: product.category_en || null,
            category_ar: product.category_ar || null,
            rating: product.rating || undefined,
        }));
    }
};

export const fetchProfile = async (): Promise<Profile> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await handleResponse<ProfileResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
};

export const updateProfile = async (formData: FormData): Promise<Profile> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/profile`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await handleResponse<ProfileResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
};

export const fetchAddresses = async (): Promise<Address[]> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/addresses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await handleResponse<AddressesResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch addresses');
    }
};

export const addAddress = async (address: Omit<Address, 'id' | 'is_default' | 'country_name'>): Promise<Address> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/addresses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(address),
        });
        const data = await handleResponse<AddressResponse>(response);
        return data.address;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to add address');
    }
};

export const updateAddress = async (id: number, address: Omit<Address, 'id' | 'is_default' | 'country_name'>): Promise<Address> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/addresses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(address),
        });
        const data = await handleResponse<AddressResponse>(response);
        return data.address;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update address');
    }
};

export const setDefaultAddress = async (id: number): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/addresses/${id}/set-default`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        await handleResponse<void>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to set default address');
    }
};

export const deleteAddress = async (id: number): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/addresses/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        await handleResponse<void>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete address');
    }
};

export const fetchServices = async (): Promise<Service[]> => {
    try {
        const response = await fetch(`${API_URL}/api/services`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<ServicesResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch services');
    }
};

export const createServiceRequest = async (data: ServiceRequestRequest): Promise<ServiceRequestResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const formData = new FormData();
        formData.append('service_id', data.service_id.toString());
        formData.append('address_id', data.address_id.toString());
        formData.append('customer_id', data.customer_id);
        formData.append('details', data.details);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await fetch(`${API_URL}/api/service-requests`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        return handleResponse<ServiceRequestResponse>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create service request');
    }
};

export const fetchCart = async (customerId: string, locale: string): Promise<CartItem[]> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
            body: JSON.stringify({ customer_id: customerId }),
        });
        const data = await handleResponse<CartResponse>(response);
        return data.data.map((item) => ({
            ...item,
            price: item.price.toString(),
        }));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch cart');
    }
};
export const updateCartItem = async (data: CartUpdateRequest, locale: string): Promise<CartUpdateResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/cart/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
            body: JSON.stringify(data),
        });
        return handleResponse<CartUpdateResponse>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update cart');
    }
};

export const clearCart = async (customerId: string, locale: string): Promise<CartClearResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/cart/clear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
            body: JSON.stringify({ customer_id: customerId }),
        });
        return handleResponse<CartClearResponse>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to clear cart');
    }
};