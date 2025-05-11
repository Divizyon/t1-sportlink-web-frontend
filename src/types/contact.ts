export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'pending' | 'replied' | 'archived'
  createdAt: string
  updatedAt: string
} 