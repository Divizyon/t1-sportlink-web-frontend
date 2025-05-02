import axios from 'axios';
import Cookies from 'js-cookie';

// API'nin temel URL'sini ortam değişkeninden al
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Axios instance'ını oluştur
export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 10 saniye
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı
axiosInstance.interceptors.request.use(
  (config) => {
    // Token'ı Cookies'den al
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 hatası durumunda oturumu sonlandır
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
); 