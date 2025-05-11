export interface Activity {
  id: string
  userId: string
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view'
  entityType: 'user' | 'news' | 'event' | 'facility' | 'reservation'
  entityId: string
  details: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
} 