// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
import { mockProducts } from './mockData';

// Import Product type
import type { Product } from './index';

// Interfaces for request and response data
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

interface Service {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    image: string[] | null;
}

interface ServicesResponse {
    data: Service[];
    message: string;
}

interface ServiceRequestRequest {
    service_id: number;
    address_id: number;
    description: string;
    image?: File;
}

interface ServiceRequestResponse {
    data: {
        id: number;
        user_id: number;
        service_id: number;
        address_id: number;
        description: string;
        image: string | null;
        status: string;
    };
    message: string;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper function to handle fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || errorData.error || JSON.stringify(errorData.errors) || `HTTP error ${response.status}`
        );
    }
    return response.json() as Promise<T>;
};

// Login API call
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
        return handleResponse<LoginResponse>(response);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Login failed'
        );
    }
};

// Register API call
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
        return handleResponse<RegisterResponse>(response);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Registration failed'
        );
    }
};

// Logout API call
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
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Logout failed'
        );
    }
};

// Fetch top products
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to fetch top products'
        );
    }
};

// Fetch all products (for ProductsPage)
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
        return mockProducts; // Return mock data on failure
    }
};

// Fetch user profile
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
        console.log(data);
        return data.data;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Failed to fetch profile'
        );
    }
};

// Update user profile
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to update profile'
        );
    }
};

// Fetch user addresses
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to fetch addresses'
        );
    }
};

// Add new address
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to add address'
        );
    }
};

// Update address
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to update address'
        );
    }
};

// Set default address
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to set default address'
        );
    }
};

// Delete address
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to delete address'
        );
    }
};

// Fetch all active services
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
        console.log("service",data);
        return data.data;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Failed to fetch services'
        );
    }
};

// Create a new service request
export const createServiceRequest = async (data: ServiceRequestRequest): Promise<ServiceRequestResponse> => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No authentication token found');
    }
    try {
        const formData = new FormData();
        formData.append('service_id', data.service_id.toString());
        formData.append('address_id', data.address_id.toString());
        formData.append('description', data.description);
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
        throw new Error(
            error instanceof Error ? error.message : 'Failed to create service request'
        );
    }
};