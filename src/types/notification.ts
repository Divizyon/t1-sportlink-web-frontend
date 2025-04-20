export interface Notification {
  id: string | number;
  userId?: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  type:
    | "event"
    | "system"
    | "message"
    | "alert"
    | "success"
    | "info"
    | "warning"
    | "error";
  actionUrl?: string;
  link?: string;
  entityId?: number | string;
  entityType?: string;
  isRead?: boolean; // For backward compatibility
}
