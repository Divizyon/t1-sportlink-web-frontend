export interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  category: 'tournament' | 'training' | 'meeting' | 'other'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  maxParticipants?: number
  currentParticipants: number
  image?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
} 