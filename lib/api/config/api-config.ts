import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// API yapılandırma sabitleri
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000, // 30 saniye
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
} as const;

// Axios instance oluşturma fonksiyonu
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    ...config,
  });

  return axiosInstance;
};

// Default axios instance
const axiosInstance = createAxiosInstance();

export { axiosInstance, createAxiosInstance, API_CONFIG };
