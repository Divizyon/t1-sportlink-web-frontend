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

// Sample event status distribution data
export const EVENT_STATUS_COUNTS = {
  pending: 42,
  approved: 187,
  rejected: 15,
  completed: 203,
};
