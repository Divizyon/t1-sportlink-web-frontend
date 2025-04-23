import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}


const loginFormDatatoBackend = (bir: string, iki: string) => {
  return {
     email: bir,
    password: iki,
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      // Önceki hataları temizle
      set({ error: null });

      console.log('Login attempt with:', email);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, loginFormDatatoBackend(email, password));

      console.log('Login response:', response.data);
      
      // Backend'den gelen yanıt yapısına göre token'ları al
      const { access_token, refresh_token } = response.data.data.session;
      
      if (!access_token || !refresh_token) {
        throw new Error('Token bilgileri eksik');
      }

      // Token'ları cookie'lere kaydet
      Cookies.set('accessToken', access_token, {
        expires: 7, // 7 gün
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      Cookies.set('refreshToken', refresh_token, {
        expires: 30, // 30 gün
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      // Authentication durumunu güncelle
      set({ isAuthenticated: true });
      console.log('Authentication state updated to true');
    } catch (error) {
      console.error('Login error:', error);
      
      // Hata mesajını belirle
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Email veya şifre hatalı.';
        } else if (error.response?.status === 404) {
          errorMessage = 'API endpoint bulunamadı.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
      }

      // Hata durumunu güncelle
      set({ error: errorMessage, isAuthenticated: false });
      throw error;
    }
  },

  logout: () => {
    // Cookie'leri temizle
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });

    // Authentication durumunu güncelle
    set({ isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  requestPasswordReset: async (email: string) => {
    try {
      set({ error: null });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        email,
      });
      
      if (response.data.status === 'success') {
        // Test ortamında reset link'i göster
        if (process.env.NODE_ENV === 'development' && response.data.data?.resetLink) {
          console.log('Test ortamı - Şifre sıfırlama bağlantısı:', response.data.data.resetLink);
          // Test ortamında otomatik yönlendirme yap
          window.location.href = response.data.data.resetLink;
        }
        return;
      }
      
      throw new Error('Şifre sıfırlama isteği başarısız oldu');
    } catch (error) {
      console.error('Password reset request error:', error);
      let errorMessage = 'Şifre sıfırlama isteği gönderilirken bir hata oluştu.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = 'Bu email adresi ile kayıtlı kullanıcı bulunamadı.';
        }
      }
      
      set({ error: errorMessage });
      throw error;
    }
  },

  resetPassword: async (password: string) => {
    try {
      set({ error: null });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`, {
        password,
      });
      
      if (response.data.status === 'success') {
        // Başarılı mesajı göster
        return;
      }
      
      throw new Error('Şifre güncelleme başarısız oldu');
    } catch (error) {
      console.error('Password reset error:', error);
      set({ error: 'Şifre güncellenirken bir hata oluştu.' });
      throw error;
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      set({ error: null });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`, {
        currentPassword,
        newPassword,
      });
      
      if (response.data.status === 'success') {
        // Başarılı mesajı göster
        return;
      }
      
      throw new Error('Şifre güncelleme başarısız oldu');
    } catch (error) {
      console.error('Password update error:', error);
      let errorMessage = 'Şifre güncellenirken bir hata oluştu.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = 'Mevcut şifre hatalı.';
        }
      }
      
      set({ error: errorMessage });
      throw error;
    }
  },
})); 