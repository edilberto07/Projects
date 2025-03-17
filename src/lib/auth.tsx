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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, we'll accept any login with admin@university.edu/password
      if (email === "admin@university.edu" && password === "password") {
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
