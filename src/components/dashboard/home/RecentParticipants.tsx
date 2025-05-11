"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { sampleUser } from "@/components/modals/UserDetailModal";
import { Participant as DashboardParticipant } from "@/types/dashboard";

// Define participant type that matches our API structure
interface Participant {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  status?: string;
  lastEvent?: string;
  isLoading?: boolean;
}

interface RecentParticipantsProps {
  onUserSelect: (user: Participant) => void;
}

// Transform API data structure to our Participant type
const transformApiParticipant = (apiData: any): Participant => {
  return {
    id: apiData.id,
    name: apiData.name || apiData.fullName,
    email: apiData.email,
    avatar: apiData.avatar || apiData.profilePicture,
    lastEvent: apiData.lastEvent,
    // Add other fields as needed
  };
};

export function RecentParticipants({ onUserSelect }: RecentParticipantsProps) {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet.yilmaz@example.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      status: "active",
      lastEvent: "Futbol Turnuvası",
    },
    {
      id: 2,
      name: "Ayşe Demir",
      email: "ayse.demir@example.com",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "active",
      lastEvent: "Yoga Etkinliği",
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      email: "mehmet.kaya@example.com",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "inactive",
      lastEvent: "Basketbol Maçı",
    },
    {
      id: 4,
      name: "Zeynep Şahin",
      email: "zeynep.sahin@example.com",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      status: "active",
      lastEvent: "Yüzme Yarışması",
    },
  ]);

  // Fetch user details when a participant is clicked
  const fetchUserDetails = async (participant: Participant) => {
    try {
      // First create a loading state user object
      const loadingUser: Participant = {
        ...participant,
        isLoading: true,
      };

      // Update parent with loading state
      onUserSelect(loadingUser);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, fetch from API:
      // const response = await fetch(`/api/users/${participant.id}`);
      // const userData = await response.json();

      // For now, use sample data merged with the participant data
      const detailedUser: Participant = {
        ...sampleUser,
        id: participant.id,
        name: participant.name,
        email: participant.email,
        avatar: participant.avatar,
        lastEvent: participant.lastEvent,
        isLoading: false,
      };

      // Pass the detailed user data to the parent component
      onUserSelect(detailedUser);
    } catch (error) {
      console.error("Error fetching user details:", error);

      // In case of error, remove loading state and pass basic user data
      const fallbackUser: Participant = {
        ...participant,
        isLoading: false,
      };
      onUserSelect(fallbackUser);
    }
  };

  const handleParticipantSelect = (participant: Participant) => {
    // Fetch detailed user data
    fetchUserDetails(participant);
  };

  // When showing loading state while fetching participants
  if (loading) {
    return (
      <Card className="col-span-1 w-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">
            Son Katılımcılar
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3 px-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Son Katılımcılar</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 px-6 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleParticipantSelect(participant)}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>{participant.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-none">
                  {participant.name}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {participant.email}
                </p>
              </div>
              {participant.status && (
                <Badge
                  variant="outline"
                  className={
                    participant.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  {participant.status === "active" ? "Aktif" : "Pasif"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
