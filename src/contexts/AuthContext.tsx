"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in (on mount)
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        // Check if user is logged in via cookie
        const isLoggedIn = Cookies.get("isLoggedIn") === "true";

        if (isLoggedIn) {
          // In a real app, you would validate the session token with the API
          // and get the user data
          // const response = await fetch('/api/me');
          // const userData = await response.json();
          // setUser(userData);

          // For demo purposes, we're using a mock user
          setUser({
            id: 1,
            name: "Admin User",
            email: "admin@sportlink.com",
            role: "admin",
          });

          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError("Failed to authenticate");
        // Clear any invalid session data
        Cookies.remove("isLoggedIn");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Log in
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // For demo purposes, we're using a mock response
      if (email && password) {
        // Mock successful login
        setUser({
          id: 1,
          name: "Admin User",
          email: email,
          role: "admin",
        });

        Cookies.set("isLoggedIn", "true", { expires: 7 });
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Log out
  const logout = () => {
    Cookies.remove("isLoggedIn");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  // Sign up
  const signup = async (
    userData: Partial<User> & { password: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      // For demo purposes, we're assuming success
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      // For demo purposes, we're assuming success
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Password reset failed";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Update profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would call your API here
      // const response = await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      // For demo purposes, we're updating the local state
      if (user) {
        setUser({
          ...user,
          ...userData,
        });
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Profile update failed";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
