import { axiosInstance } from '@/lib/axios';

export interface UserEvent {
  id: number;
  title: string;
  date: string;
  status: string;
}

export interface UserDetails {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  is_watched: boolean;
  watched_since: string;
  joinDate: string;
  avatar: string;
  profile_picture: string;
  registeredDate: string;
  lastActive: string;
  gender: string;
  age: number;
  address: string;
  bio: string;
  phone: string;
  eventCount: number;
  completedEvents: number;
  favoriteCategories: string[];
  events: UserEvent[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export const userService = {
  getUserDetails: async (userId: string): Promise<ApiResponse<UserDetails>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<UserDetails>>(`/users/${userId}/details`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error('Kullanıcı bulunamadı veya endpoint mevcut değil');
          case 401:
            throw new Error('Oturum süreniz dolmuş olabilir, lütfen tekrar giriş yapın');
          case 403:
            throw new Error('Bu işlem için yetkiniz bulunmuyor');
          default:
            throw new Error(error.response.data.message || 'Kullanıcı detayları alınırken bir hata oluştu');
        }
      }
      throw new Error('Sunucu ile iletişim kurulamadı');
    }
  }
}; 