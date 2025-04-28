import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import api from "@/services/api";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => void;
  updateProfile: (userData: Partial<User>) => void;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ error: null });

      // API URL'i kontrol et
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        const errorMsg = "API URL tanımlanmamış";
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      console.log("Login isteği gönderiliyor:", `${apiUrl}/auth/login`);

      const response = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Login yanıtı:", response.data);

      const { access_token, refresh_token } = response.data.data.session;
      const userData = response.data.data.user;

      // Kullanıcı verilerini doğrula ve dönüştür
      const user: User = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        avatar: userData.avatar,
        role: userData.role,
        phone: userData.phone,
      };

      if (!access_token || !refresh_token) {
        const errorMsg = "Token bilgileri eksik";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      Cookies.set("accessToken", access_token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      Cookies.set("refreshToken", refresh_token, {
        expires: 30,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      set({
        isAuthenticated: true,
        user,
        error: null,
      });

      toast.success("Başarıyla giriş yapıldı!");
    } catch (error) {
      let errorMessage = "Giriş yapılırken bir hata oluştu";

      if (axios.isAxiosError(error)) {
        console.error("Axios hatası:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });

        if (error.response) {
          const apiErrorMessage = error.response.data?.message;
          const status = error.response.status;

          if (status === 401) {
            errorMessage = apiErrorMessage || "E-posta veya şifre hatalı";
          } else if (status === 404) {
            errorMessage = apiErrorMessage || "Servis şu anda kullanılamıyor";
          } else if (status === 422) {
            errorMessage =
              apiErrorMessage || "Geçersiz e-posta veya şifre formatı";
          } else if (status === 429) {
            errorMessage =
              "Çok fazla deneme yaptınız. Lütfen bir süre bekleyin";
          } else if (status >= 500) {
            errorMessage =
              "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin";
          }
        } else if (error.request) {
          // İstek yapıldı ama yanıt alınamadı
          console.error("Yanıt alınamadı:", error.request);
          errorMessage =
            "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin";
        } else {
          // İstek oluşturulurken hata oluştu
          console.error("İstek hatası:", error.message);
          errorMessage = "Bağlantı hatası oluştu";
        }
      }

      // State'i güncelle ve toast göster
      set({ error: errorMessage, isAuthenticated: false, user: null });
      toast.error(errorMessage);

      throw error;
    }
  },

  logout: async () => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    } finally {
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("user");
      set({ isAuthenticated: false, user: null, error: null });
    }
  },

  updateAvatar: (avatarUrl: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, avatar: avatarUrl } : null,
    }));
  },

  updateProfile: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  loadProfile: async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("Token bulunamadı");
      }

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      set((state) => ({
        user: {
          id: userData.id || state.user?.id,
          email: userData.email,
          first_name: userData.name?.split(" ")[0] || "",
          last_name: userData.name?.split(" ").slice(1).join(" ") || "",
          avatar: userData.avatar,
          role: state.user?.role || "user",
          phone: userData.phone,
        },
      }));
    } catch (error) {
      console.error("Profil yükleme hatası:", error);
      toast.error("Profil bilgileri yüklenirken bir hata oluştu");
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
