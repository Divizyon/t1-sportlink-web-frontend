'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurity } from '@/hooks/useSecurity';
import SecurityLogsTable from '@/components/security/SecurityLogsTable';
import SecurityFilters from '@/components/security/SecurityFilters';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function SecurityPage() {
  const router = useRouter();
  const { securityLogs, loading, pagination, handlePageChange, handleFilter } = useSecurity();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data.success || response.data.data.role !== 'ADMIN') {
          toast.error('Bu sayfaya erişim yetkiniz yok');
          router.push('/dashboard');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/auth/login');
        } else {
          toast.error('Bir hata oluştu');
          router.push('/dashboard');
        }
      }
    };

    checkAdminRole();
  }, [router]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Güvenlik Logları</h1>
      
      <SecurityFilters onFilter={handleFilter} />
      
      <SecurityLogsTable 
        logs={securityLogs}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 