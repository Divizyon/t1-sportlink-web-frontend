import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// API Error Response type
interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}

// Request interceptor tipi
type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

// Response interceptor tipi
type ResponseInterceptor = (response: any) => any;

// Error interceptor tipi
type ErrorInterceptor = (error: AxiosError<ApiErrorResponse>) => Promise<never>;

// Request interceptor
const requestInterceptor: RequestInterceptor = (config) => {
  // Token varsa header'a ekle
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor
const responseInterceptor: ResponseInterceptor = (response) => {
  // Response data'yı direkt dön
  return response.data;
};

// Error interceptor
const errorInterceptor: ErrorInterceptor = async (
  error: AxiosError<ApiErrorResponse>
) => {
  // Hata mesajını hazırla
  const errorMessage =
    error.response?.data?.message || error.message || "Bir hata oluştu";

  // HTTP durumuna göre özel işlemler
  switch (error.response?.status) {
    case 401:
      // Yetkisiz erişim - kullanıcıyı logout yap
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
      break;
    case 403:
      // Yasak erişim
      console.error("Erişim yetkiniz yok:", errorMessage);
      break;
    case 404:
      // Bulunamadı
      console.error("Kaynak bulunamadı:", errorMessage);
      break;
    default:
      // Genel hata
      console.error("API Hatası:", errorMessage);
  }

  return Promise.reject(error);
};

// Interceptor'ları axios instance'a ekleyen fonksiyon
const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);
  return instance;
};

export { setupInterceptors };
