import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using named function declaration for better Fast Refresh support
function AuthProviderComponent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid unnecessary loading state
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("user"); // Clear potentially corrupted data
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Add a small delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demo purposes, we'll accept any login with admin@university.edu/password123
      if (email === "admin@university.edu" && password === "password123") {
        const user = {
          id: "1",
          email: "admin@university.edu",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return;
      }
      throw new Error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Mock register function - in a real app, this would call an API
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    setLoading(true);
    try {
      // Add a small delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, this would create a new user in the database
      // For demo purposes, we'll just simulate a successful registration
      console.log("Registered user:", { email, firstName, lastName });
      return;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthProvider = AuthProviderComponent;

// Using named function declaration for better Fast Refresh support
function useAuthHook() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const useAuth = useAuthHook;
