import { Event } from "@/types/dashboard";

/**
 * Centralized mock data for all events in the application
 * All components should use this data source and apply filtering as needed
 */

// All events for the application
export const ALL_EVENTS = [
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
  {
    id: 4,
    title: "Tenis Turnuvası",
    description:
      "Çiftler tenis turnuvası. Amatör ve profesyonel kategorilerde yarışmalar...",
    date: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    time: "10:00",
    location: "Tenis Kulübü, Antalya",
    category: "Tenis",
    participants: 24,
    maxParticipants: 32,
    status: "approved",
    organizer: "Tenis Derneği",
    image: "/images/events/tennis.jpg",
    createdAt: "2023-07-15",
  },
  {
    id: 5,
    title: "Fitness Boot Camp",
    description:
      "4 haftalık yoğun fitness programı. HIIT, kardiyo ve kuvvet antrenmanları içerir...",
    date: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 days from now
    time: "07:00",
    location: "Fitness Center, İstanbul",
    category: "Fitness",
    participants: 20,
    maxParticipants: 30,
    status: "pending",
    organizer: "Fitness Eğitmenleri",
    image: "/images/events/fitness.jpg",
    createdAt: "2023-07-18",
  },
  {
    id: 6,
    title: "Voleybol Turnuvası",
    description:
      "Plaj voleybolu turnuvası. 2'şer kişilik takımlar halinde yarışma...",
    date: new Date(new Date().setDate(new Date().getDate() + 15)), // 15 days from now
    time: "16:00",
    location: "Plaj Spor Tesisi, Antalya",
    category: "Voleybol",
    participants: 28,
    maxParticipants: 40,
    status: "approved",
    organizer: "Voleybol Federasyonu",
    image: "/images/events/volleyball.jpg",
    createdAt: "2023-07-20",
  },
  {
    id: 7,
    title: "Koşu Maratonu",
    description:
      "Yaz maratonu etkinliği. 5km, 10km ve 21km kategorilerinde yarışlar...",
    date: new Date(new Date().setDate(new Date().getDate() + 20)), // 20 days from now
    time: "08:00",
    location: "Sahil Parkuru, İzmir",
    category: "Koşu",
    participants: 145,
    maxParticipants: 200,
    status: "pending",
    organizer: "Atletizm Kulübü",
    image: "/images/events/running.jpg",
    createdAt: "2023-07-22",
  },
  {
    id: 8,
    title: "Yoga ve Meditasyon",
    description:
      "Stresli şehir hayatından uzaklaşıp, doğayla iç içe yoga ve meditasyon deneyimi...",
    date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    time: "09:00",
    location: "Belgrad Ormanı, İstanbul",
    category: "Yoga",
    participants: 15,
    maxParticipants: 30,
    status: "pending",
    organizer: "Yoga ve Yaşam Merkezi",
    image: "/images/events/yoga.jpg",
    createdAt: "2023-07-25",
  },
];

// Helper functions for filtering events
export const filterEventsByDate = (targetDate: Date) => {
  const targetDay = new Date(targetDate);
  targetDay.setHours(0, 0, 0, 0);

  return ALL_EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === targetDay.getTime();
  });
};

export const filterTodayEvents = () => {
  return filterEventsByDate(new Date());
};

export const filterEventsByStatus = (status: string) => {
  if (status === "all") return ALL_EVENTS;
  return ALL_EVENTS.filter((event) => event.status === status);
};

export const filterEventsByCategory = (categories: string[]) => {
  if (!categories || categories.length === 0) return ALL_EVENTS;
  return ALL_EVENTS.filter((event) => categories.includes(event.category));
};

export const filterUpcomingEvents = (days: number = 30) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  return ALL_EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today && eventDate <= futureDate;
  });
};

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
    title: "Sabah Koşusu",
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
