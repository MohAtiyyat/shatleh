// lib/api.ts

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

interface ApiErrorResponse {
    message?: string;
    error?: string;
}

// Helper function to handle fetch responses
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || errorData.error || `HTTP error ${response.status}`
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


