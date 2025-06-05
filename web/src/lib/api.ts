import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false // Remove credentials since we're using token-based auth
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Request interceptor - Token from localStorage:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers);
        } else {
            console.log('No token found in localStorage');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        console.log('Response interceptor - Success:', response.status);
        return response;
    },
    async (error) => {
        console.error('Response interceptor - Error:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });

        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Attempting to refresh token...');
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: false
                });

                if (response.data.token) {
                    console.log('Token refresh successful');
                    // Store the new token
                    localStorage.setItem('token', response.data.token);
                    
                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('token');
                // Don't redirect automatically
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Add auth status cache
let authStatusCache = {
    isAuthenticated: false,
    lastChecked: 0,
    checking: false
};

// Request queue implementation
class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;

    async add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            if (!this.processing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        try {
            while (this.queue.length > 0) {
                const request = this.queue.shift();
                if (request) {
                    await request();
                }
            }
        } catch (error) {
            console.error('Error processing request queue:', error);
        } finally {
            this.processing = false;
            // Check if new requests were added while processing
            if (this.queue.length > 0) {
                this.processQueue();
            }
        }
    }
}

// Create a singleton queue instance
const requestQueue = new RequestQueue();

// Cache for stats data
const statsCache = {
    data: null,
    lastChecked: 0,
    checking: false,
    error: null
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Function to clear stats cache
const clearStatsCache = () => {
    statsCache.data = null;
    statsCache.lastChecked = 0;
    statsCache.checking = false;
    statsCache.error = null;
};

// Add login attempt tracking
let lastLoginAttempt = 0;
const LOGIN_COOLDOWN = 2000; // 2 seconds cooldown between login attempts

// Auth API functions
const authApi = {
    register: async (data: any) => {
        const response = await requestQueue.add(() => api.post('/auth/register', data));
        return response.data;
    },
    login: async (data: any) => {
        // Check if we're within the cooldown period
        const now = Date.now();
        if (now - lastLoginAttempt < LOGIN_COOLDOWN) {
            console.log('Login attempt too soon, please wait');
            throw new Error('Please wait before trying again');
        }
        
        lastLoginAttempt = now;
        console.log('API login called with:', data);
        
        try {
            const response = await requestQueue.add(() => api.post('/auth/login', data));
            console.log('API login response:', response.data);
            
            if (response.data && !response.data.error && response.data.data?.token) {
                console.log('Storing token from response:', response.data.data.token);
                localStorage.setItem('token', response.data.data.token);
            } else {
                console.error('Invalid response structure:', response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    logout: async () => {
        try {
            await requestQueue.add(() => api.post('/auth/logout'));
        } finally {
            localStorage.removeItem('token');
        }
    },
    checkAuth: async () => {
        try {
            const response = await requestQueue.add(() => api.get('/auth/check'));
            return response.data;
        } catch (error) {
            console.error('Auth check error:', error);
            return { authenticated: false };
        }
    }
};

// Employee API functions
const employeeApi = {
    getAll: async () => {
        try {
            const response = await requestQueue.add(() => api.get('/employees'));
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },
    getById: async (id: number) => {
        try {
            const response = await requestQueue.add(() => api.get(`/employees/${id}`));
            return response.data;
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    },
    create: async (data: any) => {
        try {
            const response = await requestQueue.add(() => api.post('/employees', data));
            return response.data;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    },
    update: async (id: number, field: string, value: string, reason: string) => {
        try {
            const response = await requestQueue.add(() => api.put(`/employees/${id}/field`, {
                field_name: field,
                new_value: value,
                reason
            }));
            return response.data;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    },
    delete: async (id: number) => {
        try {
            const response = await requestQueue.add(() => api.delete(`/employees/${id}`));
            return response.data;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    },
    getStats: async (forceRefresh = false) => {
        try {
            // If force refresh is true, clear the cache
            if (forceRefresh) {
                console.log('Force refresh requested, clearing cache');
                clearStatsCache();
            }

            // Check if we have a recent cache
            const now = Date.now();
            if (now - statsCache.lastChecked < CACHE_DURATION && !statsCache.checking && !forceRefresh) {
                console.log('Using cached stats');
                return statsCache.data;
            }

            // If already checking, return cached value or error
            if (statsCache.checking) {
                console.log('Stats check already in progress, using cached value');
                if (statsCache.error) {
                    throw new Error(statsCache.error);
                }
                return statsCache.data;
            }

            statsCache.checking = true;
            statsCache.error = null;

            console.log('Making API call to /employees/stats'); // Debug log
            const response = await requestQueue.add(() => api.get('/employees/stats'));
            console.log('Raw stats response:', response); // Debug log
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            if (response.data.error) {
                throw new Error(response.data.message || 'Failed to fetch statistics');
            }

            // Update cache with the correct data structure
            const statsData = {
                error: false,
                data: response.data.data
            };
            console.log('Processed stats data:', statsData); // Debug log
            
            statsCache.data = statsData;
            statsCache.lastChecked = now;
            return statsData;
        } catch (error) {
            console.error('Error in getStats:', error); // Debug log
            statsCache.error = error.message;
            
            // If we have cached data, return it even if it's stale
            if (statsCache.data) {
                console.log('Returning stale cached stats due to error');
                return statsCache.data;
            }
            throw error;
        } finally {
            statsCache.checking = false;
        }
    }
};

export { authApi, employeeApi, clearStatsCache };
export default api; 