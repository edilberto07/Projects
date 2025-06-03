import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { authApi } from './api';
import { useNavigate } from 'react-router-dom';
import { employeeApi } from './api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // add other user properties as needed
}


interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  pendingApprovals: number;
  upcomingPayroll: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<{ authenticated: boolean, user?: User }>;
  employeeStats: EmployeeStats | null;
  fetchEmployeeStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderComponent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loginAttemptRef = useRef<number>(0);
  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);

  console.log('AuthProviderComponent rendered. Loading:', loading, 'User:', user ? 'Authenticated' : 'Not Authenticated', 'User object:', user);

  useEffect(() => {
    console.log('AuthProviderComponent useEffect [mount]: Component mounted, starting authentication check...');
    const checkAuthentication = async () => {
      console.log('AuthProviderComponent checkAuthentication: Setting loading to true...');
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('AuthProviderComponent checkAuthentication: Token found:', !!token);
      if (token) {
        try {
          console.log('AuthProviderComponent checkAuthentication: Token found, attempting auth check via API...');
          const response = await authApi.checkAuth();
          console.log('AuthProviderComponent checkAuthentication: authApi.checkAuth response:', response);
          if (response?.authenticated && response.user) {
            console.log('AuthProviderComponent checkAuthentication: Authentication successful. Setting user to:', response.user);
            setUser(response.user);
          } else {
            console.log('AuthProviderComponent checkAuthentication: Authentication failed. Setting user to null.');
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('AuthProviderComponent checkAuthentication: Error during auth check:', err);
          localStorage.removeItem('token');
          console.log('AuthProviderComponent checkAuthentication: Setting user to null due to error.');
          setUser(null);
        } finally {
          console.log('AuthProviderComponent checkAuthentication: Setting loading to false.');
          setLoading(false);
        }
      } else {
        console.log('AuthProviderComponent checkAuthentication: No token found. Setting user to null and loading to false.');
        setUser(null);
        setLoading(false);
      }
    };

    checkAuthentication();

    return () => {
      console.log('AuthProviderComponent unmounting cleanup.');
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('AuthProviderComponent useEffect [state change]: User or loading state changed. Loading:', loading, 'User:', user ? 'Authenticated' : 'Not Authenticated', 'User object:', user);
  }, [user, loading]);

  const fetchEmployeeStats = useCallback(async () => {
    if (!user || loading) return;
    try {
      console.log('AuthProviderComponent: Attempting to fetch employee stats...');
      const response = await employeeApi.getStats(true);
      if (response && response.data && !response.data.error) {
        console.log('AuthProviderComponent: Successfully fetched employee stats.', response.data.data);
        setEmployeeStats(response.data);
      } else {
        console.error('AuthProviderComponent: Failed to fetch employee stats or invalid data structure.', response);
        setEmployeeStats(null);
      }
    } catch (err) {
      console.error('AuthProviderComponent: Error fetching employee stats:', err);
      setEmployeeStats(null);
    }
  }, [user, loading]);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register({ email, password, firstName, lastName });
      if (response.data) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      console.log('AuthProvider login called');
      const response = await authApi.login({ email, password });
      console.log('AuthProvider login response:', response);
      
      if (response && !response.error && response.data?.token && response.data?.user) {
        console.log('Login successful, setting user and token');
        setUser(response.data.user);
        return response;
      } else {
        const errorMessage = response?.message || 'Invalid email or password';
        setError(errorMessage);
        console.error('Login failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Login error in AuthProvider:', err);
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('AuthProvider logout called');
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      console.log('User logged out, token removed.');
    }
  }, []);

  const publicCheckAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Public checkAuth: No token found.');
      return { authenticated: false };
    }
    try {
      console.log('Public checkAuth: Token found, attempting auth check...');
      const response = await authApi.checkAuth();
      console.log('Public checkAuth: authApi.checkAuth response:', response);
      if (response?.authenticated && response.user) {
        console.log('Public checkAuth: Authentication successful.');
        return { authenticated: true, user: response.user };
      } else {
        console.log('Public checkAuth: Authentication failed.');
        return { authenticated: false };
      }
    } catch (err) {
      console.error('Public checkAuth error:', err);
      return { authenticated: false };
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    checkAuth: publicCheckAuth,
    employeeStats,
    fetchEmployeeStats,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = AuthProviderComponent;
