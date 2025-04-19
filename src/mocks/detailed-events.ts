/**
 * Mock data for detailed event views
 */

// For EventDetailModal and event detail page
export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  registeredDate?: string;
  eventCount?: number;
  status?: "active" | "suspended" | "blocked";
}

export interface EventReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed";
}

export interface DetailedEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  participants: EventParticipant[];
  status: "pending" | "approved" | "rejected" | "completed";
  maxParticipants: number;
  currentParticipants: number;
  createdAt: Date;
  category?: string;
  tags?: string[];
  rejectionReason?: string;
  reports?: EventReport[];
  image?: string;
}

export const DETAILED_EVENT: DetailedEvent = {
  id: "evt-123",
  title: "Futbol Turnuvası Finali",
  description: "Üniversiteler arası futbol turnuvasının final maçı.",
  date: new Date(2023, 5, 15),
  time: "15:00",
  location: "Ana Stadyum",
  organizer: "Spor Koordinatörlüğü",
  category: "Futbol",
  tags: ["turnuva", "final", "üniversite"],
  participants: [
    {
      id: "usr-1",
      name: "Ahmet Yılmaz",
      email: "ahmet@mail.com",
      avatar: "/avatars/01.png",
      age: 22,
      gender: "Erkek",
      registeredDate: "01.01.2023",
      eventCount: 15,
      status: "active",
    },
    {
      id: "usr-2",
      name: "Mehmet Demir",
      email: "mehmet@mail.com",
      avatar: "/avatars/02.png",
      age: 24,
      gender: "Erkek",
      registeredDate: "15.02.2023",
      eventCount: 8,
      status: "active",
    },
    {
      id: "usr-3",
      name: "Ayşe Kaya",
      email: "ayse@mail.com",
      avatar: "/avatars/03.png",
      age: 20,
      gender: "Kadın",
      registeredDate: "10.03.2023",
      eventCount: 12,
      status: "active",
    },
    {
      id: "usr-4",
      name: "Zeynep Çelik",
      email: "zeynep@mail.com",
      avatar: "/avatars/04.png",
      age: 19,
      gender: "Kadın",
      registeredDate: "05.04.2023",
      eventCount: 5,
      status: "active",
    },
  ],
  reports: [
    {
      id: "rep-1",
      reporterId: "usr-101",
      reporterName: "Murat Öz",
      reason: "Uygunsuz içerik - Etkinlik açıklamasında uygunsuz dil kullanımı",
      date: "10.04.2023",
      status: "pending",
    },
    {
      id: "rep-2",
      reporterId: "usr-102",
      reporterName: "Deniz Yıldız",
      reason: "Yanıltıcı bilgi - Etkinlik konumu yanlış",
      date: "11.04.2023",
      status: "pending",
    },
  ],
  status: "pending",
  maxParticipants: 22,
  currentParticipants: 4,
  createdAt: new Date(2023, 4, 20),
};

// For edit event modal
export interface EditableEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  location: string;
  participants: number;
  description: string;
}

export const EDITABLE_EVENTS: EditableEvent[] = [
  {
    id: 1,
    title: "Futbol Turnuvası",
    date: "2023-04-18",
    type: "football",
    location: "Spor Kompleksi",
    participants: 24,
    description: "Yıllık futbol turnuvası, tüm takımların katılımı bekleniyor.",
  },
  {
    id: 2,
    title: "Basketbol Maçı",
    date: "2023-04-15",
    type: "basketball",
    location: "Kapalı Spor Salonu",
    participants: 16,
    description: "Dostluk karşılaşması, iki takım arasında.",
  },
  {
    id: 3,
    title: "Yüzme Yarışması",
    date: "2023-04-12",
    type: "swimming",
    location: "Olimpik Havuz",
    participants: 32,
    description: "Tüm yaş kategorilerinde yüzme yarışları.",
  },
  {
    id: 4,
    title: "Tenis Turnuvası",
    date: "2023-04-10",
    type: "tennis",
    location: "Tenis Kortları",
    participants: 12,
    description: "Tenis kulübü üyeleri arası turnuva.",
  },
];

// For the event detail page
export interface EventPageData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "pending";
  image: string;
  participants: EventPageParticipant[];
  reports: EventPageReport[];
}

export interface EventPageParticipant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "approved" | "pending" | "declined" | "attended";
  registrationDate: string;
}

export interface EventPageReport {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  description: string;
  date: string;
  status: "pending" | "resolved" | "rejected";
}

export const EVENT_PAGE_DATA: EventPageData = {
  id: "evt-123",
  title: "Futbol Turnuvası Finali",
  description:
    "Üniversiteler arası futbol turnuvasının final maçı. Katılımcılar için özel ödüller verilecektir.",
  date: "2023-06-15",
  time: "15:00",
  location: "Ana Stadyum, Merkez Kampüs",
  organizer: "Spor Koordinatörlüğü",
  category: "Futbol",
  maxParticipants: 22,
  currentParticipants: 18,
  status: "upcoming",
  image: "/images/events/football-tournament.jpg",
  participants: [
    {
      id: "usr-1",
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      avatar: "/avatars/01.png",
      status: "approved",
      registrationDate: "2023-05-20",
    },
    {
      id: "usr-2",
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      avatar: "/avatars/02.png",
      status: "approved",
      registrationDate: "2023-05-21",
    },
    {
      id: "usr-3",
      name: "Ayşe Kaya",
      email: "ayse@example.com",
      avatar: "/avatars/03.png",
      status: "pending",
      registrationDate: "2023-05-22",
    },
  ],
  reports: [
    {
      id: "rep-1",
      userId: "usr-101",
      userName: "Murat Öz",
      reason: "Uygunsuz İçerik",
      description: "Etkinlik açıklamasında uygunsuz dil kullanımı",
      date: "2023-05-25",
      status: "pending",
    },
    {
      id: "rep-2",
      userId: "usr-102",
      userName: "Deniz Yıldız",
      reason: "Yanıltıcı Bilgi",
      description: "Etkinlik konumu yanlış belirtilmiş",
      date: "2023-05-26",
      status: "pending",
    },
  ],
};
