// Genel API yanıt tipi
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// Sayfalama yanıt tipi
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Sayfalama parametreleri
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Filtreleme parametreleri
export interface FilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: any;
}

// API Hata yanıt tipi
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// HTTP Metod türleri
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API Endpoint yapılandırması
export interface ApiEndpointConfig {
  url: string;
  method: HttpMethod;
  requiresAuth?: boolean;
  timeout?: number;
}
