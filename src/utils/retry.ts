import { AxiosError } from 'axios';

interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Sadece belirli hata kodları için retry yap
    const retryStatusCodes = [408, 429, 500, 502, 503, 504];
    return retryStatusCodes.includes(error.response?.status || 0);
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries, retryDelay, retryCondition } = {
    ...defaultConfig,
    ...config,
  };

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      attempt++;

      // Son deneme değilse ve retry koşulu sağlanıyorsa
      if (attempt < maxRetries && retryCondition?.(error as AxiosError)) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError;
} 