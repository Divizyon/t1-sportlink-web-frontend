import { Participant } from "@/types/dashboard";

/**
 * Mock data for participants
 */

// Recent participants for the dashboard
export const RECENT_PARTICIPANTS: Participant[] = [
  {
    id: "part-1",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    avatar: "/avatars/01.png",
    lastEvent: "Futbol Turnuvası",
  },
  {
    id: "part-2",
    name: "Ayşe Demir",
    email: "ayse@example.com",
    avatar: "/avatars/02.png",
    lastEvent: "Basketbol Karşılaşması",
  },
  {
    id: "part-3",
    name: "Mehmet Can",
    email: "mehmet@example.com",
    avatar: "/avatars/03.png",
    lastEvent: "Yüzme Yarışı",
  },
  {
    id: "part-4",
    name: "Zeynep Kaya",
    email: "zeynep@example.com",
    avatar: "/avatars/04.png",
    lastEvent: "Tenis Turnuvası",
  },
  {
    id: "part-5",
    name: "Emre Güneş",
    email: "emre@example.com",
    avatar: "/avatars/05.png",
    lastEvent: "Voleybol Maçı",
  },
];

// Event participants (example data for specific events)
export const EVENT_PARTICIPANTS: { [key: string]: Participant[] } = {
  "evt-1": [
    {
      id: "usr-1",
      name: "Zeynep Yılmaz",
      email: "zeynep@example.com",
      avatar: "/avatars/01.png",
      lastEvent: "Sabah Koşusu",
    },
    {
      id: "usr-6",
      name: "Ali Yıldız",
      email: "ali@example.com",
      avatar: "/avatars/06.png",
      lastEvent: "Sabah Koşusu",
    },
    {
      id: "usr-7",
      name: "Sibel Çelik",
      email: "sibel@example.com",
      avatar: "/avatars/07.png",
      lastEvent: "Sabah Koşusu",
    },
  ],
  "evt-3": [
    {
      id: "usr-2",
      name: "Ahmet Demir",
      email: "ahmet@example.com",
      avatar: "/avatars/02.png",
      lastEvent: "Basketbol Turnuvası",
    },
    {
      id: "usr-8",
      name: "Kemal Şahin",
      email: "kemal@example.com",
      avatar: "/avatars/08.png",
      lastEvent: "Basketbol Turnuvası",
    },
    {
      id: "usr-9",
      name: "Deniz Aydın",
      email: "deniz@example.com",
      avatar: "/avatars/09.png",
      lastEvent: "Basketbol Turnuvası",
    },
  ],
};

// Participation statistics
export const PARTICIPATION_STATS = {
  totalParticipations: 1245,
  monthlyGrowth: 12.8,
  weeklyJoins: 48,
  averagePerEvent: 15.3,
};
