export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string | Date;
  time: string;
  location: string;
  sport_id: number;
  max_participants: number;
  status: 'pending' | 'active' | 'cancelled' | 'completed' | 'approved' | 'rejected';
  category?: string;
  rejection_reason?: string;
  reports?: Report[];
  participants?: Participant[];
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: number;
  user_id: number;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export interface Participant {
  id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export type EventFormData = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'reports' | 'participants'>; 