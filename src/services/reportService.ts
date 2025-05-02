import { axiosInstance } from '../lib/axios';

export interface Report {
  id: string;
  konu: string;
  raporlayan: string;
  raporlanan: string;
  tarih: string;
  tur: 'Kullanıcı' | 'Etkinlik';
  oncelik: 'Yüksek' | 'Orta' | 'Düşük';
  durum: 'Beklemede' | 'İnceleniyor' | 'Tamamlandı' | 'Reddedildi';
  reporter_id: string;
  reported_user_id: string;
  target_user_id: string;
  event_id?: string;
  report_reason: string;
  report_date: string;
  status: string;
  admin_notes?: string;
}

export interface BanResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    banned_user_id: string;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: {
    reports?: T[];
    report?: T;
  };
  message?: string;
}

export const reportService = {
  // Admin notu ekle veya güncelle
  addAdminNote: async (reportId: string | number, adminNotes: string): Promise<ApiResponse<Report>> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Report>>(`/reports/${reportId}/notes`, {
        admin_notes: adminNotes
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Not ekleme işlemi başarısız oldu');
      }
      throw new Error('Sunucu ile iletişim kurulamadı');
    }
  },

  // Raporun durumunu güncelle
  updateReportStatus: async (reportId: string | number, status: string, adminNotes?: string): Promise<ApiResponse<Report>> => {
    try {
      const response = await axiosInstance.patch<ApiResponse<Report>>(`/reports/${reportId}/status`, {
        status,
        admin_notes: adminNotes
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Durum güncelleme işlemi başarısız oldu');
      }
      throw new Error('Sunucu ile iletişim kurulamadı');
    }
  },

  // Kullanıcıya ait raporları getir
  getUserReports: async (userId: string | number): Promise<ApiResponse<Report>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Report>>(`/reports`, {
        params: {
          reported_user_id: userId,
          type: 'user'
        }
      });

      // Admin notlarını doğru şekilde map et
      if (response.data.data?.reports) {
        response.data.data.reports = response.data.data.reports.map(report => ({
          ...report,
          admin_notes: report.admin_notes // API'den gelen admin_notes'u direkt kullan
        }));
      }

      console.log('API Response:', response.data); // Debug için log ekleyelim
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Raporlar alınırken bir hata oluştu');
      }
      throw new Error('Sunucu ile iletişim kurulamadı');
    }
  },

  // Kullanıcıyı banla
  banUserFromReport: async (reportId: string | number): Promise<BanResponse> => {
    try {
      const response = await axiosInstance.post<BanResponse>(`/reports/${reportId}/ban-user`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Kullanıcı banlanırken bir hata oluştu');
      }
      throw new Error('Sunucu ile iletişim kurulamadı');
    }
  }
}; 