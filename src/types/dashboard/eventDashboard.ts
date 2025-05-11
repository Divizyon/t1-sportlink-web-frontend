export interface User {
  id: string;
  name: string;
  surname: string;
  role: "bireysel_kullanici" | "kulup_uyesi" | "antrenor" | "tesis_sahibi";
  email: string;
  avatar?: string;
}

export interface Event {
  id: string | number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status:
    | "ACTIVE"
    | "PENDING"
    | "REJECTED"
    | "COMPLETED"
    | "pending"
    | "approved"
    | "rejected"
    | "completed";
  organizer: User;
  image?: string;
  participantList?: User[];
  current_participants?: number;
}
