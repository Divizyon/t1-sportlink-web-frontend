import { useState, useEffect } from 'react';
import { Event, EventInput, EventFilters, EventStatus } from '@/types';
import { apiService } from '@/services/api';
import { API } from '@/constants';
import { useToast } from '@/components/ui/use-toast';

interface UseEventsProps {
  initialFilters?: EventFilters;
}

export const useEvents = ({ initialFilters }: UseEventsProps = {}) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters || {
    search: '',
    status: 'all',
    categories: []
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API'den gelen yanıt formatına uygun olarak düzenlendi
      const response = await apiService.get<{ status: string; data: { events: Event[] } }>(
        API.ENDPOINTS.EVENTS.BASE,
        {
          params: {
            search: filters.search,
            status: filters.status !== 'all' ? filters.status : undefined,
            categories: filters.categories?.join(',')
          }
        }
      );
      
      setEvents(response.data.events);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: 'Hata',
        description: 'Etkinlikler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: EventInput) => {
    try {
      setLoading(true);
      const response = await apiService.post<{ status: string; data: { event: Event } }>(
        API.ENDPOINTS.EVENTS.BASE,
        eventData
      );
      
      setEvents(prev => [...prev, response.data.event]);
      toast({
        title: 'Başarılı',
        description: 'Etkinlik başarıyla oluşturuldu.',
      });
      return response.data.event;
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Hata',
        description: 'Etkinlik oluşturulurken bir hata oluştu.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, newStatus: EventStatus) => {
    try {
      const response = await apiService.patch<{ status: string; data: { event: Event } }>(
        API.ENDPOINTS.EVENTS.STATUS(eventId),
        { status: newStatus }
      );
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? response.data.event : event
        )
      );
      
      toast({
        title: 'Başarılı',
        description: 'Etkinlik durumu güncellendi.',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Hata',
        description: 'Etkinlik durumu güncellenirken bir hata oluştu.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await apiService.delete(API.ENDPOINTS.EVENTS.DETAIL(eventId));
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast({
        title: 'Başarılı',
        description: 'Etkinlik başarıyla silindi.',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Hata',
        description: 'Etkinlik silinirken bir hata oluştu.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEventStatus,
    deleteEvent,
    setFilters,
    refetch: fetchEvents
  };
};

// Test fonksiyonları
export const testEventAPI = {
  // Başarılı API çağrısı testi
  async testSuccessfulAPICall() {
    try {
      const response = await apiService.get('/events');
      return {
        success: true,
        message: 'API çağrısı başarılı',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'API çağrısı başarısız',
        error
      };
    }
  },

  // Hata durumu testi
  async testErrorHandling() {
    try {
      await apiService.get('/events/invalid-endpoint');
      return {
        success: false,
        message: 'Hata yakalanamadı'
      };
    } catch (error) {
      return {
        success: true,
        message: 'Hata başarıyla yakalandı',
        error
      };
    }
  },

  // Token yönetimi testi
  async testTokenManagement() {
    try {
      // Token'ı geçersiz yap
      localStorage.setItem('token', 'invalid-token');
      
      const response = await apiService.get('/events');
      return {
        success: true,
        message: 'Token yenileme başarılı',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token yenileme başarısız',
        error
      };
    }
  }
}; 