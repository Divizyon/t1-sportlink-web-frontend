import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

// Sadece gerekli interfaceleri bırakalım
interface SecurityLog {
  id: number;
  type: string;
  admin: string;
  ip: string;
  date: string;
  time: string;
  status: string;
  action: string;
}

interface SecurityLogFilters {
  searchQuery?: string;
  dateFilter?: string;
  status?: 'success' | 'warning' | 'error' | '';
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useSecurity = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<SecurityLogFilters>({
    searchQuery: '',
    dateFilter: '',
    status: ''
  });

  const fetchLogs = async (currentFilters: SecurityLogFilters = filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/security/logs`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            ...currentFilters,
            page: pagination.page,
            limit: pagination.limit
          }
        }
      );

      if (response.data.success) {
        setSecurityLogs(response.data.data.logs);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.pagination.total
        }));
      } else {
        throw new Error(response.data.message || "Güvenlik logları alınamadı");
      }
    } catch (error) {
      console.error('Güvenlik logları alınırken hata oluştu:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
      toast({
            title: "Yetkisiz Erişim",
            description: "Bu sayfaya erişim yetkiniz bulunmuyor.",
            variant: "destructive",
          });
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
      toast({
        title: "Hata",
            description: error.response?.data?.message || "Güvenlik logları alınırken bir hata oluştu",
        variant: "destructive",
      });
        }
      } else {
      toast({
          title: "Hata",
          description: "Güvenlik logları alınırken bir hata oluştu",
        variant: "destructive",
      });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilter = (newFilters: Partial<SecurityLogFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Filtreleme yapıldığında ilk sayfaya dön
    fetchLogs(updatedFilters);
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page]); // Sadece sayfa değişiminde fetchLogs çağrılsın

  return {
    securityLogs,
    loading,
    pagination,
    filters,
    handlePageChange,
    handleFilter
  };
};
