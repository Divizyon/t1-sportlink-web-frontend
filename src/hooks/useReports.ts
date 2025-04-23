import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface Report {
  id: string;
  konu: string;
  raporlayan: string;
  tarih: string;
  tur: "Kullanıcı" | "Etkinlik";
  oncelik: "Yüksek" | "Orta" | "Düşük";
  durum: "Beklemede" | "Çözüldü" | "Reddedildi";
  reporter_id: string;
  event_id?: string;
  report_reason: string;
  report_date: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  admin_notes?: string;
}

interface ReportFilters {
  status?: "PENDING" | "RESOLVED" | "DISMISSED" | "all";
  type?: "Kullanıcı" | "Etkinlik" | "all";
  priority?: "Yüksek" | "Orta" | "Düşük" | "all";
  searchQuery?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export function useReports(initialFilters: ReportFilters = {}) {
  const { toast } = useToast();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);

  const getToken = () => {
    // Cookie'den token'ı al
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    return token;
  };

    const fetchReports = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast({
          title: "Hata",
          description: "Bu sayfaya erişmek için giriş yapmanız gerekiyor.",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }

      console.log('Fetching reports with URL:', `${process.env.NEXT_PUBLIC_API_URL}/reports`);
      console.log('Filters:', filters);
      console.log('Token:', token);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: filters
        }
      );

      console.log('Reports response:', response.data);

      if (response.data.status === 'success') {
        setReports(response.data.data.reports);
      } else {
        throw new Error(response.data.message || "Raporlar alınamadı");
      }
    } catch (error) {
      console.error('Raporlar alınırken hata oluştu:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Hata",
            description: "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.",
            variant: "destructive",
          });
          router.push('/login');
        } else if (error.response?.status === 403) {
          toast({
            title: "Hata",
            description: "Bu sayfaya erişim yetkiniz yok.",
            variant: "destructive",
          });
          router.push('/dashboard');
        } else {
          toast({
            title: "Hata",
            description: error.response?.data?.message || "Raporlar alınırken bir hata oluştu",
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: "RESOLVED" | "DISMISSED") => {
    try {
      const token = getToken();
      
      if (!token) {
        toast({
          title: "Hata",
          description: "Bu işlemi yapmak için giriş yapmanız gerekiyor.",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setReports(prev => 
          prev.map(report => 
            report.id === reportId ? response.data.data.report : report
          )
        );
        toast({
          title: "Başarılı",
          description: newStatus === "RESOLVED" ? "Rapor çözüldü olarak işaretlendi" : "Rapor reddedildi",
        });
      } else {
        throw new Error(response.data.message || "Rapor durumu güncellenemedi");
      }
    } catch (error) {
      console.error('Rapor durumu güncellenirken hata oluştu:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Hata",
            description: "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.",
            variant: "destructive",
          });
          router.push('/login');
        } else {
          toast({
            title: "Hata",
            description: error.response?.data?.message || "Rapor durumu güncellenirken bir hata oluştu",
            variant: "destructive",
          });
        }
      }
    }
  };

  const updateReportNotes = async (reportId: string, notes: string) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast({
          title: "Hata",
          description: "Bu işlemi yapmak için giriş yapmanız gerekiyor.",
          variant: "destructive",
        });
        router.push('/login');
        return;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/notes`,
        { admin_notes: notes },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setReports(prev => 
          prev.map(report => 
            report.id === reportId ? response.data.data.report : report
          )
        );
        toast({
          title: "Başarılı",
          description: "Admin notu başarıyla güncellendi",
        });
      } else {
        throw new Error(response.data.message || "Admin notu güncellenemedi");
      }
    } catch (error) {
      console.error('Admin notu güncellenirken hata oluştu:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Hata",
            description: "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.",
            variant: "destructive",
          });
          router.push('/login');
        } else {
          toast({
            title: "Hata",
            description: error.response?.data?.message || "Admin notu güncellenirken bir hata oluştu",
            variant: "destructive",
          });
        }
      }
    }
  };

  const applyFilters = (newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  return {
    reports,
    loading,
    filters,
    applyFilters,
    updateReportStatus,
    updateReportNotes
  };
}
