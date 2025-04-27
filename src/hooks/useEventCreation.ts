import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { generateFutureEventTime } from "@/lib/eventUtils";

interface EventCreationData {
  title: string;
  description?: string;
  sport_id: number | string;
  location_name: string;
  location_lat: number;
  location_long: number;
  max_participants: number;
  hoursInFuture?: number; // Optional parameter to specify how far in the future the event should be
}

interface CreatedEvent {
  id: string;
  title: string;
  status: string;
  // Add other fields as needed
}

export function useEventCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdEvent, setCreatedEvent] = useState<CreatedEvent | null>(null);

  const createEvent = async (
    data: EventCreationData
  ): Promise<CreatedEvent | null> => {
    setLoading(true);
    setError(null);

    try {
      // Generate valid future date/times
      const { date, startTime, endTime } = generateFutureEventTime(
        data.hoursInFuture || 2
      );

      // Create event data with proper dates
      const eventData = {
        title: data.title,
        description: data.description || "",
        sport_id: data.sport_id,
        event_date: date,
        start_time: startTime,
        end_time: endTime,
        location_name: data.location_name,
        location_lat: data.location_lat,
        location_long: data.location_long,
        max_participants: data.max_participants,
      };

      console.log("Creating event with data:", eventData);

      // Make API request
      const response = await api.post("/events", eventData);

      console.log("Event creation response:", response.data);

      if (response.data && response.data.status === "success") {
        // Extract the newly created event data
        const newEvent = response.data.data.event;

        // Since we know there's a date issue, log the dates that were returned
        console.log(
          "New event created with date:",
          newEvent.event_date || newEvent.date
        );
        console.log("New event status:", newEvent.status);

        // Force a refresh of the events after creation to ensure it shows up
        try {
          await api.get("/events?status=PENDING");
        } catch (refreshErr) {
          console.error(
            "Error refreshing events data after creation:",
            refreshErr
          );
        }

        setCreatedEvent(newEvent);
        toast.success("Event created successfully");
        return newEvent;
      } else {
        throw new Error(response.data?.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      setError(new Error(errorMessage));
      toast.error(`Failed to create event: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    loading,
    error,
    createdEvent,
  };
}
