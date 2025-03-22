import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "../config/api-config";
import { setupInterceptors } from "../config/api-interceptors";

// HTTP istemcisi için tip tanımları
interface HttpClient {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

// HTTP istemcisi sınıfı
class ApiClient implements HttpClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance = axiosInstance) {
    this.instance = setupInterceptors(instance);
  }

  // GET isteği
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  // POST isteği
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  // PUT isteği
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config
    );
    return response.data;
  }

  // DELETE isteği
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  // PATCH isteği
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(
      url,
      data,
      config
    );
    return response.data;
  }
}

// Default HTTP istemcisi instance'ı
const httpClient = new ApiClient();

export { httpClient, ApiClient, type HttpClient };
