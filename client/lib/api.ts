const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
import { mockProducts } from './mockData';
import type { Product, Category, BackendCartItem, Service, BlogPost, PostFilterCategory, Order, ServiceRequest } from './index';

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
    data: BackendCartItem[];
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

interface Review {
    id: number;
    rating: number;
    text: string;
    customer_name: string;
    created_at: string;
}

interface ReviewsResponse {
    data: {
        reviews: Review[];
        average_rating: number;
    };
    message: string;
}
interface subcategories {
    id: number;
    name_en: string;
    name_ar: string;
}
interface PostCategoriesResponse {
    data: {
        id: number;
        name_en: string;
        name_ar: string;
        subcategories: subcategories[];
    }[];
}


interface Coupon {
    id: number;
    title: string;
    code: string;
    amount: number;
    expire_date: string;
    country_id: number | null;
    country_name?: string | null;
}

interface CouponsResponse {
    data: Coupon[];
    message: string;
}


interface ApplyCouponResponse {
    data: Coupon;
    message: string;
}

interface CheckoutRequest {
    customer_id: string;
    address_id: number;
    items: { product_id: number; price: string; quantity: number }[];
    is_gift?: boolean; // Made optional
    gift_first_name?: string;
    gift_last_name?: string;
    gift_phone_number?: string;
    coupon_id?: number | null;
    total: number;
    delivery_cost: number;
}

interface CheckoutResponse {
    data: {
        order_id: number;
        order_code: string;
        total: number;
        status: string;
    };
    message: string;
}
interface OrdersResponse {
    data: Order[];
    message: string;
}
interface SearchResponse {
    data: {
        products: Product[];
        posts: BlogPost[];
        services: Service[];
    };
    message: string;
}
interface ServiceRequestsResponse {
    data: ServiceRequest[];
    message: string;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
            errorData = await response.json();
        } catch {
            // Handle case where response is not JSON
        }
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
        const response = await fetch(`${API_URL}/api/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<CategoriesResponse>(response);
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
                image: sub.name_en,
                subcategories: [],
            })),
            image: category.subcategories.length > 0 ? category.subcategories[0].name_en : '',
        }));
        return transformedCategories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
};

// Fetch all products, optionally filtered by category IDs
export const fetchAllProducts = async (category_ids?: number[]): Promise<Product[]> => {
    try {
        // Construct query parameters for category filtering
        const query = category_ids && category_ids.length > 0 ? `?category_ids=${category_ids.join(',')}` : '';
        const response = await fetch(`${API_URL}/api/all_products${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<ProductsResponse>(response);
        return data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return mock products as fallback, ensuring type consistency
        return mockProducts.map((product) => ({
            ...product,
            price: product.price.toString(),
            availability: !!product.availability,
            categories: product.categories
                ? product.categories.map((category) => ({
                    id: category.id,
                    name_en: category.name_en || '',
                    name_ar: category.name_ar || '',
                    parent_id: null,
                }))
                : [],
            rating: product.rating || undefined,
        }));
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
            next: { revalidate: 86400 }
        });
        const data = await handleResponse<ProductsResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch top products');
    }
};

export const search = async (query: string, contentType: string = 'all'): Promise<SearchResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&type=${contentType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            next: { revalidate: 30 }
        });
        
        return await handleResponse<SearchResponse>(response);
    } catch (error) {
        console.error('Error performing search:', error);
        throw new Error(error instanceof Error ? error.message : 'Search failed');
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

export const fetchCart = async (customerId: string, locale: string): Promise<BackendCartItem[]> => {
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

export const fetchProductReviews = async (productId: number): Promise<{ reviews: Review[]; averageRating: number }> => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<ReviewsResponse>(response);
        return {
            reviews: data.data.reviews,
            averageRating: data.data.average_rating,
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch product reviews');
    }
};
export const fetchOrders = async (locale: string): Promise<Order[]> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
        });
        const data = await handleResponse<OrdersResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
};

export const fetchUnratedOrders = async (locale: string): Promise<Order[]> => {
    const token = getAuthToken();
    if (!token) {
        return [];
    }
    try {
        const response = await fetch(`${API_URL}/api/orders/unrated`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
        });
        const data = await handleResponse<OrdersResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch unrated orders');
    }
};

export const submitOrderRatings = async (orderId: number, ratings: { product_id: number; rating: number }[], locale: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/orders/${orderId}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
            body: JSON.stringify({ ratings }),
        });
        await handleResponse(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to submit ratings');
    }
};

export const skipOrderRating = async (orderId: number, locale: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/orders/${orderId}/skip-rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
        });
        await handleResponse(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to skip rating');
    }
};
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch(`${API_URL}/api/blog`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        return await handleResponse<BlogPost[]>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch blog posts');
    }
};

export const fetchBookmarkedPosts = async (): Promise<BlogPost[]> => {
    const token = getAuthToken();
    if (!token) {
        return []; // Return empty array for unauthenticated users
    }
    try {
        const response = await fetch(`${API_URL}/api/bookmarks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return await handleResponse<BlogPost[]>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch bookmarked posts');
    }
};

export const toggleBookmark = async (postId: number): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/blog/${postId}/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await handleResponse<{ bookmarked: boolean }>(response);
        return data.bookmarked;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to toggle bookmark');
    }
};
export const fetchPostCategories = async (locale: string): Promise<PostFilterCategory[]> => {
    try {
        const response = await fetch(`${API_URL}/api/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Language': locale,
            },
        });
        const data = await handleResponse<PostCategoriesResponse>(response);
        const transformedCategories: PostFilterCategory[] = data.data.map((category) => ({
            id: category.id,
            name: {
                en: category.name_en,
                ar: category.name_ar,
            },
            selected: false,
        }));
        return transformedCategories;
    } catch (error) {
        console.error('Failed to fetch post categories:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch post categories');
    }
};


export const cancelOrder = async (orderId: string, locale: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to cancel order');
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to cancel order');
    }
};

export const fetchCoupons = async (): Promise<Coupon[]> => {
    try {
        const response = await fetch(`${API_URL}/api/coupons`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const data = await handleResponse<CouponsResponse>(response);
        return data.data;
    } catch (error) {
        console.error('Failed to fetch coupons:', error);
        return [];
    }
};

export const applyCoupon = async (code: string, countryId: number | null): Promise<ApplyCouponResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/coupons/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code, country_id: countryId }),
        });
        return await handleResponse<ApplyCouponResponse>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to apply coupon');
    }
};

export const checkout = async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return await handleResponse<CheckoutResponse>(response);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Checkout failed');
    }
};
export const fetchServiceRequests = async (locale: string): Promise<ServiceRequest[]> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_URL}/api/service-requests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': locale, // Pass locale for language-specific responses
            },
        });
        const data = await handleResponse<ServiceRequestsResponse>(response);
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch service requests');
    }
};
