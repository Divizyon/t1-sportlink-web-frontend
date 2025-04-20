export interface Audit {
  id: string
  userId: string
  action: string
  details: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failed'
  errorMessage?: string
} 