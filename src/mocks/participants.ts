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

// Event participants (example data for specific events by event ID)
export const EVENT_PARTICIPANTS: { [key: string | number]: Participant[] } = {
  // String IDs (for event detail page)
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

  // Numeric IDs (for TodaysEvents component)
  1: [
    {
      id: "p1",
      name: "Ali Yılmaz",
      email: "ali@example.com",
      lastEvent: "3 gün önce",
    },
    {
      id: "p2",
      name: "Ayşe Kaya",
      email: "ayse@example.com",
      lastEvent: "1 gün önce",
    },
    {
      id: "p3",
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      lastEvent: "5 gün önce",
    },
  ],
  2: [
    {
      id: "p4",
      name: "Zeynep Çelik",
      email: "zeynep@example.com",
      lastEvent: "2 gün önce",
    },
    {
      id: "p5",
      name: "Emre Şahin",
      email: "emre@example.com",
      lastEvent: "Bugün",
    },
  ],
  3: [
    {
      id: "p6",
      name: "Deniz Yıldız",
      email: "deniz@example.com",
      lastEvent: "4 gün önce",
    },
    {
      id: "p7",
      name: "Selin Aksoy",
      email: "selin@example.com",
      lastEvent: "Dün",
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

// Extended participant data with additional details
export const DETAILED_PARTICIPANTS: Record<string, Participant> = {
  p1: {
    id: "p1",
    name: "Ali Yılmaz",
    email: "ali@example.com",
    lastEvent: "3 gün önce",
    avatar: "/avatars/01.png",
  },
  p2: {
    id: "p2",
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    lastEvent: "1 gün önce",
    avatar: "/avatars/02.png",
  },
  p3: {
    id: "p3",
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    lastEvent: "5 gün önce",
    avatar: "/avatars/03.png",
  },
  p4: {
    id: "p4",
    name: "Zeynep Çelik",
    email: "zeynep@example.com",
    lastEvent: "2 gün önce",
    avatar: "/avatars/04.png",
  },
  p5: {
    id: "p5",
    name: "Emre Şahin",
    email: "emre@example.com",
    lastEvent: "Bugün",
    avatar: "/avatars/05.png",
  },
  p6: {
    id: "p6",
    name: "Deniz Yıldız",
    email: "deniz@example.com",
    lastEvent: "4 gün önce",
    avatar: "/avatars/06.png",
  },
  p7: {
    id: "p7",
    name: "Selin Aksoy",
    email: "selin@example.com",
    lastEvent: "Dün",
    avatar: "/avatars/07.png",
  },
};
