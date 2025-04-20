import { Event } from "@/types/dashboard";

/**
 * Mock data for events
 */

// Today's events for the dashboard
export const TODAY_EVENTS: Event[] = [
  {
    id: 1,
    title: "Futbol Turnuvası",
    description: "Üniversitelerarası futbol turnuvasının final maçı",
    date: new Date(),
    time: "15:00",
    location: "Ana Stadyum",
    category: "Futbol",
    participants: 18,
    maxParticipants: 22,
    status: "approved",
    organizer: "Spor Koordinatörlüğü",
    image: "/images/events/football.jpg",
    createdAt: "2023-07-10",
  },
  {
    id: 2,
    title: "Basketbol Karşılaşması",
    description: "Dostluk maçı - A Takımı vs B Takımı",
    date: new Date(),
    time: "18:30",
    location: "Kapalı Spor Salonu",
    category: "Basketbol",
    participants: 12,
    maxParticipants: 15,
    status: "approved",
    organizer: "Basketbol Kulübü",
    image: "/images/events/basketball.jpg",
    createdAt: "2023-07-12",
  },
  {
    id: 3,
    title: "Yüzme Yarışı",
    description: "Serbest stil 100m yüzme yarışması",
    date: new Date(),
    time: "10:00",
    location: "Olimpik Havuz",
    category: "Yüzme",
    participants: 24,
    maxParticipants: 30,
    status: "approved",
    organizer: "Yüzme Federasyonu",
    image: "/images/events/swimming.jpg",
    createdAt: "2023-07-08",
  },
];

// Detailed event data (for EventDetailModal and other components)
export const EVENT_DETAILS: Event[] = [
  {
    id: 101,
    title: "Haftalık Futbol Karşılaşması",
    description:
      "Her yaş ve seviye için açık futbol maçı. Takımlar yerinde oluşturulacak.",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    time: "19:00",
    location: "Merkez Spor Kompleksi",
    category: "Futbol",
    participants: 18,
    maxParticipants: 22,
    status: "approved",
    organizer: "Spor Kulübü",
    image: "/images/events/soccer.jpg",
  },
  {
    id: 102,
    title: "Sabah Yoga Dersi",
    description:
      "Güne enerjik başlamak için yoga dersi. Tüm seviyeler için uygundur.",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: "07:30",
    location: "Zen Yoga Stüdyosu",
    category: "Yoga",
    participants: 12,
    maxParticipants: 15,
    status: "approved",
    organizer: "Zen Yoga",
    image: "/images/events/yoga.jpg",
  },
  {
    id: 103,
    title: "Bisiklet Turu",
    description: "Şehir çevresinde 25km'lik bisiklet turu. Kask zorunludur.",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: "08:00",
    location: "Sahil Parkı Girişi",
    category: "Bisiklet",
    participants: 25,
    maxParticipants: 40,
    status: "approved",
    organizer: "Bisiklet Kulübü",
    image: "/images/events/cycling.jpg",
  },
];

// Sample event status distribution data
export const EVENT_STATUS_COUNTS = {
  pending: 42,
  approved: 187,
  rejected: 15,
  completed: 203,
};

// User Events for UserDetailModal
export interface UserEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  status: "completed" | "upcoming" | "canceled";
}

// Default mock user events for the UserDetailModal
export const DEFAULT_USER_EVENTS: UserEvent[] = [
  {
    id: "evt-1",
    title: "naberrer loo Koşusu",
    date: "15.08.2023",
    category: "Koşu",
    status: "completed",
  },
  {
    id: "evt-2",
    title: "Hafta Sonu Basketbol",
    date: "22.08.2023",
    category: "Basketbol",
    status: "completed",
  },
  {
    id: "evt-3",
    title: "Bisiklet Turu",
    date: "29.08.2023",
    category: "Bisiklet",
    status: "completed",
  },
  {
    id: "evt-4",
    title: "Sabah Koşusu",
    date: "10.09.2023",
    category: "Koşu",
    status: "upcoming",
  },
  {
    id: "evt-5",
    title: "Yoga Dersi",
    date: "15.09.2023",
    category: "Yoga",
    status: "upcoming",
  },
  {
    id: "evt-6",
    title: "Yüzme Etkinliği",
    date: "20.09.2023",
    category: "Yüzme",
    status: "upcoming",
  },
];
