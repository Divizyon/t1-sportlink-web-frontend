"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Participant, RecentParticipantsProps } from "@/types/dashboard";
import { RECENT_PARTICIPANTS } from "@/mocks/participants";
import { getUserInitials, sortParticipantsByLastEvent } from "@/lib/userUtils";
import { generateSkeletonArray } from "@/lib/uiUtils";

export function RecentParticipants({ onUserSelect }: RecentParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true);

    // Mock verileri kullanarak yükleme simülasyonu
    setTimeout(() => {
      // Sort participants by their last event using utility function
      const sortedParticipants =
        sortParticipantsByLastEvent(RECENT_PARTICIPANTS);
      setParticipants(sortedParticipants);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {generateSkeletonArray(5).map((index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="ml-auto h-4 w-[50px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md -mx-2"
          onClick={() => onUserSelect && onUserSelect(participant)}
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
