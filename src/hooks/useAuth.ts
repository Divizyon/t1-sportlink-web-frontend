import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { apiService } from '@/services/api';
import { API } from '@/constants';
import { UserRole } from '@/types';
import Cookies from 'js-cookie';

interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  avatar?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mapBackendUser = (backendUser: BackendUser): User => {
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.first_name,
      surname: backendUser.last_name,
      role: backendUser.role,
      avatar: undefined
    };
  };

  const setTokens = (accessToken: string, refreshToken: string) => {
    // HTTP-only cookie için API çağrısı
    apiService.post('/api/auth/set-cookies', { 
      accessToken, 
      refreshToken 
    });

    // Client-side storage
    localStorage.setItem('token', accessToken);
    Cookies.set('accessToken', accessToken, { 
      expires: 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  };

  const clearTokens = () => {
    localStorage.removeItem('token');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // HTTP-only cookie'leri temizle
    apiService.post('/api/auth/clear-cookies');
  };

  const fetchUser = async () => {
    try {
      const response = await apiService.get('/api/auth/me');
      const mappedUser = mapBackendUser(response.data.user);
      setUser(mappedUser);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
      setError(err);
      clearTokens();
      
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.post('/api/auth/login', { email, password });
      
      if (response.data.session?.access_token) {
        const { access_token, refresh_token } = response.data.session;
        setTokens(access_token, refresh_token);
        
        const mappedUser = mapBackendUser(response.data.user);
        setUser(mappedUser);
        setIsAuthenticated(true);
        
        toast.success('Başarıyla giriş yaptınız!');
        
        // Yönlendirmeyi setTimeout ile yapıyoruz
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 100);
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (err: any) {
      setError(err);
      toast.error(err?.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.post('/api/auth/logout');
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/auth/login');
    } catch (err: any) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  useEffect(() => {
    const token = Cookies.get('accessToken') || localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchUser
  };
}; 