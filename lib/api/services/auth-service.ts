import { httpClient } from "../services/http-client";
import { ApiResponse } from "../types/api-types";

// Auth ile ilgili tip tanımları
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Auth servisi
const authService = {
  // Login işlemi
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<UserResponse>> => {
    return httpClient.post<ApiResponse<UserResponse>>(
      "/auth/login",
      credentials
    );
  },

  // Logout işlemi
  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
    return httpClient.post("/auth/logout");
  },

  // Kullanıcı bilgilerini getir
  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    return httpClient.get<ApiResponse<UserResponse>>("/auth/me");
  },
};

export { authService, type LoginCredentials, type UserResponse };
