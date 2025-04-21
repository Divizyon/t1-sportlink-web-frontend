"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Participant, RecentParticipantsProps } from "@/types/dashboard";
import { getUserInitials } from "@/lib/userUtils";
import { generateSkeletonArray } from "@/lib/uiUtils";
import {
  RECENT_PARTICIPANTS,
  PARTICIPANT_DETAILS,
  LOADING_DELAYS,
  DASHBOARD_DATA_SETTINGS,
} from "@/mockups";

export function RecentParticipants({ onUserSelect }: RecentParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API load delay
    setLoading(true);

    // Simulate loading time
    setTimeout(() => {
      // Use the RECENT_PARTICIPANTS from mockups instead of generating from USERS
      const recentParticipants: Participant[] = RECENT_PARTICIPANTS.map(
        (participant) => ({
          id: participant.id.toString(),
          name: participant.name,
          email: participant.email,
          avatar: participant.avatar || "/avatars/default.png",
          lastEvent: participant.lastEvent,
        })
      );

      setParticipants(recentParticipants);
      setLoading(false);
    }, LOADING_DELAYS.medium);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {generateSkeletonArray(DASHBOARD_DATA_SETTINGS.maxDisplayedItems).map(
          (index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <Skeleton className="ml-auto h-4 w-[50px]" />
            </div>
          )
        )}
      </div>
    );
  }

  // Handle participant selection with consistent data
  const handleParticipantSelect = (participant: Participant) => {
    if (onUserSelect) {
      // Use PARTICIPANT_DETAILS from mockups for enriched data
      const enrichedParticipant =
        PARTICIPANT_DETAILS[participant.id] || participant;
      onUserSelect(enrichedParticipant as any);
    }
  };

  return (
    <div className="space-y-8">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md -mx-2"
          onClick={() => handleParticipantSelect(participant)}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback>{getUserInitials(participant.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {participant.name}
            </p>
            <p className="text-sm text-muted-foreground">{participant.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <div className="text-sm text-muted-foreground">
              {participant.lastEvent}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
