import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define types for notifications
interface Notification {
  id: number | string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  type: "event" | "system" | "message" | "alert" | "success";
  actionUrl?: string;
  entityId?: number | string;
  entityType?: string;
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Yeni Etkinlik",
    message: "Katıldığınız etkinlik bugün gerçekleşecek.",
    createdAt: "2023-09-15T08:00:00",
    readAt: null,
    type: "event",
    actionUrl: "/dashboard/events/123",
    entityId: 123,
    entityType: "event",
  },
  {
    id: 2,
    title: "Sistem Bakımı",
    message:
      "Sistem bakımı sebebiyle yarın 02:00-04:00 arası hizmet verilmeyecektir.",
    createdAt: "2023-09-14T10:30:00",
    readAt: "2023-09-14T11:45:00",
    type: "system",
  },
  {
    id: 3,
    title: "Yeni Mesaj",
    message: "Yönetici size bir mesaj gönderdi.",
    createdAt: "2023-09-14T15:20:00",
    readAt: null,
    type: "message",
    actionUrl: "/dashboard/messages",
    entityId: 1,
    entityType: "conversation",
  },
  {
    id: 4,
    title: "Etkinlik İptal Edildi",
    message: "Katılmayı planladığınız etkinlik iptal edildi.",
    createdAt: "2023-09-13T09:10:00",
    readAt: "2023-09-13T09:30:00",
    type: "alert",
    entityId: 456,
    entityType: "event",
  },
  {
    id: 5,
    title: "Kayıt Başarılı",
    message: "Basketbol etkinliğine kaydınız tamamlandı.",
    createdAt: "2023-09-12T14:25:00",
    readAt: "2023-09-12T14:30:00",
    type: "success",
    actionUrl: "/dashboard/events/789",
    entityId: 789,
    entityType: "event",
  },
];

export function useNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        // setNotifications(data);

        // Using mock data for now
        setNotifications(MOCK_NOTIFICATIONS);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch notifications")
        );
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Get unread notifications
  const unreadNotifications = useMemo(() => {
    return notifications.filter((notification) => notification.readAt === null);
  }, [notifications]);

  // Get unread count
  const unreadCount = useMemo(() => {
    return unreadNotifications.length;
  }, [unreadNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId: number | string) => {
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, readAt: new Date().toISOString() }
            : notification
        )
      );

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Hata",
        description: "Bildirim okundu olarak işaretlenemedi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      // In a real application, this would be an API call
      // await fetch('/api/notifications/read-all', { method: 'POST' });

      // Update local state
      const now = new Date().toISOString();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.readAt === null
            ? { ...notification, readAt: now }
            : notification
        )
      );

      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Hata",
        description: "Bildirimler okundu olarak işaretlenemedi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number | string) => {
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );

      toast({
        title: "Bildirim Silindi",
        description: "Bildirim başarıyla silindi.",
      });

      return true;
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast({
        title: "Hata",
        description: "Bildirim silinemedi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      // In a real application, this would be an API call
      // await fetch('/api/notifications', { method: 'DELETE' });

      // Update local state
      setNotifications([]);

      toast({
        title: "Bildirimler Temizlendi",
        description: "Tüm bildirimler başarıyla temizlendi.",
      });

      return true;
    } catch (err) {
      console.error("Error clearing notifications:", err);
      toast({
        title: "Hata",
        description: "Bildirimler temizlenemedi.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type: Notification["type"]) => {
    return notifications.filter((notification) => notification.type === type);
  };

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
  };
}
