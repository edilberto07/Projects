import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
}

interface AuthResponse {
    error: boolean;
    message: string;
    token?: string;
    user?: User;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = useCallback(async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data: AuthResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                navigate('/dashboard');
                return data.user;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const register = useCallback(async (data: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result: AuthResponse = await response.json();

            if (result.error) {
                throw new Error(result.message);
            }

            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data: AuthResponse = await response.json();

            if (!data.error && data.user) {
                setUser(data.user);
                return true;
            }

            return false;
        } catch (err) {
            return false;
        }
    }, []);

    const changePassword = useCallback(async (newPassword: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ newPassword }),
            });
            const data: AuthResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return data;
        } catch (err) {
            throw err;
        }
    }, []);

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        verifyToken,
        changePassword,
    };
}; 