import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface BackendProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface AdminInviteData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

// API URL'ini al
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("accessToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Profil bilgilerini getir
export const getProfile = async (): Promise<ProfileData> => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    throw error;
  }
};

// Profil bilgilerini güncelle
export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const response = await api.put("/profile", data);
    return response.data;
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        "Profil güncellenirken bir hata oluştu";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Şifre değiştir
export const changePassword = async (data: PasswordData) => {
  try {
    const requestData = {
      old_password: data.current_password,
      new_password: data.new_password,
    };

    const response = await api.put("/auth/change-password", requestData);
    return response.data;
  } catch (error) {
    console.error("Şifre değiştirme API hatası:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        "Şifre değiştirilirken bir hata oluştu";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Avatar yükle
export const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Avatar yükleme API hatası:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Avatar yüklenirken bir hata oluştu";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Admin davet et
export const inviteAdmin = async (data: AdminInviteData) => {
  try {
    const response = await api.post("/admin/invite", data);
    return response.data;
  } catch (error) {
    console.error("Admin davet hatası:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        "Admin davet edilirken bir hata oluştu";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export default api;
