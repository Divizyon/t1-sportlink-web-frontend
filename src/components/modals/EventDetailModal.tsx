"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash,
  Save,
  CalendarIcon,
  CheckCircle,
  XCircle,
  Filter,
  Info,
  Flag,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePickerWithPresets } from "@/components/ui/custom-datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import { UserDetailModal } from "@/components/modals/UserDetailModal";
import { enrichUserData } from "@/lib/userDataService";
import api from "@/services/api";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  registeredDate?: string;
  eventCount?: number;
  status?: "active" | "suspended" | "blocked";
  isLoading?: boolean;
}

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed";
}

interface ApiEventRating {
  id: string;
  event_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

interface ApiEventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  participants: Participant[];
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  maxParticipants: number;
  createdAt: Date;
  category?: string;
  tags?: string[];
  rejectionReason?: string;
  reports?: Report[];
}

// Create empty initial event
const createEmptyEvent = (): Event => ({
  id: "",
  title: "",
  description: "",
  date: new Date(),
  time: "",
  location: "",
  organizer: "",
  participants: [],
  status: "pending",
  maxParticipants: 0,
  createdAt: new Date(),
  category: "",
  reports: [],
});

// Raw event interface matching the backend response format
interface EventFromAPI {
  id: string;
  creator_id: string;
  sport_id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_latitude: number;
  location_longitude: number;
  max_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
  participants?: ApiEventParticipant[];
  ratings?: ApiEventRating[];
  reports?: any[];
  creator_name?: string;
  sport_category?: string;
  // New properties from the API response
  current_participants?: number;
  is_full?: boolean;
  sport?: {
    id: number;
    icon: string;
    name: string;
    description: string;
  };
  creator_role?: string;
}

interface EventDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSuccess?: () => void;
}

// Event kategori listesi
const categories = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Diğer",
];

// Reddetme sebepleri
const rejectionReasons = [
  "Uygunsuz içerik",
  "Yetersiz detay",
  "Tarihi geçmiş",
  "Konum uygun değil",
  "Kapasite sorunu",
  "Güvenlik riski",
  "Diğer",
];

// Map backend status to frontend status
const mapEventStatus = (
  status: string
): "pending" | "approved" | "rejected" | "completed" => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACTIVE":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "COMPLETED":
      return "completed";
    default:
      return "pending";
  }
};

// Add a helper function to format time strings for display
const formatTimeFromISOString = (isoString: string): string => {
  try {
    // Extract just the time part and format to HH:MM
    const timeMatch = isoString.match(/T(\d{2}:\d{2})/);
    if (timeMatch && timeMatch[1]) {
      return timeMatch[1];
    }
    // Fallback to date object parsing
    return new Date(isoString).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "00:00";
  }
};

export function EventDetailModal({
  open,
  onOpenChange,
  event,
  onSuccess,
}: EventDetailModalProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [rawEventData, setRawEventData] = useState<EventFromAPI | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Initialize with an empty event - we will fill it only after real data is fetched
  const [formData, setFormData] = useState<Event>(createEmptyEvent());

  // Update the useEffect to handle when only an event ID is provided
  useEffect(() => {
    if (open) {
      console.log("EventDetailModal opened, event:", event);
      // Always reset to empty event when modal is opened
      setFormData(createEmptyEvent());
      setFetchingEvent(true);

      if (event?.id) {
        console.log("Fetching event details for ID:", event.id);
        // Fetch event details when only an ID is provided
        fetchEventDetails(event.id);
      } else {
        console.warn("No event ID available");
        setFetchingEvent(false);
      }
    }
  }, [open, event]);

  // Add more logging to fetchEventDetails
  const fetchEventDetails = async (eventId: string) => {
    try {
      console.log(`Starting to fetch details for event ${eventId}...`);
      setFetchingEvent(true);

      // Fix the endpoint path
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      // Ensure eventId is treated as a string regardless of whether it's passed as a number or string
      const eventEndpoint = `${baseUrl}/events/${eventId}`;
      console.log("Using event endpoint:", eventEndpoint);

      // Fetch event details from the API
      const response = await api.get(eventEndpoint);

      console.log(`Raw API response for event ${eventId}:`, response);
      console.log(`API response data for event ${eventId}:`, response.data);

      if (response.data.status === "success" && response.data.data?.event) {
        const apiEvent = response.data.data.event;
        console.log("Raw API event data:", apiEvent);
        setRawEventData(apiEvent);

        // Transform the API data to match our component's expected format
        const transformedEvent: Event = {
          id: apiEvent.id.toString(), // Ensure ID is always stored as string in our state
          title: apiEvent.title,
          description: apiEvent.description || "",
          date: new Date(apiEvent.event_date),
          time: formatTimeFromISOString(apiEvent.start_time || ""),
          location: apiEvent.location_name,
          organizer: apiEvent.creator_name || "Unknown",
          status: mapEventStatus(apiEvent.status),
          maxParticipants: apiEvent.max_participants,
          createdAt: new Date(apiEvent.created_at),
          category: apiEvent.sport_category || apiEvent.sport?.name || "Other",
          participants: [], // We'll fetch participants separately or use apiEvent.current_participants as a count
          reports: [], // We'll fetch reports separately if available
        };

        // If sport data is available, enhance the event with that information
        if (apiEvent.sport) {
          transformedEvent.category = apiEvent.sport.name;
          // You could add other sport-related fields here if needed
        }

        console.log("Transformed event data:", transformedEvent);
        setFormData(transformedEvent);

        // If there's a current_participants count but no actual participant data,
        // we might want to fetch detailed participant information
        if (
          apiEvent.current_participants > 0 &&
          (!apiEvent.participants || apiEvent.participants.length === 0)
        ) {
          fetchEventParticipants(eventId);
        }
      } else {
        console.warn(
          "Invalid API response format or missing event data:",
          response.data
        );
        toast.error("Etkinlik detayları yüklenirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Error fetching event details:", error);
      // More detailed error reporting
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      toast.error("Etkinlik detayları yüklenirken bir hata oluştu");
    } finally {
      setFetchingEvent(false);
    }
  };

  // Add a function to fetch participants separately if needed
  const fetchEventParticipants = async (eventId: string) => {
    try {
      console.log(`Fetching participants for event ${eventId}`);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const participantsEndpoint = `${baseUrl}/events/${eventId}/participants`;
      console.log("Using participants endpoint:", participantsEndpoint);

      const response = await api.get(participantsEndpoint);
      console.log("Raw participants response:", response);

      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        const participants: Participant[] = response.data.data.map(
          (p: any) => ({
            id: p.user_id || p.id,
            name:
              p.name ||
              `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
              "Anonim Kullanıcı",
            email:
              p.email ||
              `user-${(p.user_id || p.id || "").substring(0, 4)}@example.com`,
            avatar: p.avatar,
            registeredDate: p.joined_at
              ? new Date(p.joined_at).toLocaleDateString()
              : undefined,
          })
        );

        setFormData((prev) => ({
          ...prev,
          participants,
        }));
      }
    } catch (error) {
      console.error("Error fetching event participants:", error);
      toast.error("Katılımcı bilgileri yüklenirken bir hata oluştu");
    }
  };

  // Function to fetch detailed user data
  const fetchParticipantDetails = async (participant: Participant) => {
    try {
      // Create a loading state user object
      const loadingUser: Participant = {
        ...participant,
        isLoading: true,
      };

      // Set the loading state
      setSelectedParticipant(loadingUser);

      // Open the modal immediately to show loading state
      setShowUserModal(true);

      try {
        // Check if we should use /api prefix
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const userEndpoint = `${baseUrl}/users/${participant.id}`;
        console.log("Using user endpoint:", userEndpoint);

        // Try to fetch user details from the API
        const response = await api.get(userEndpoint);

        console.log(`User API response:`, response);

        if (response.data.status === "success" && response.data.data) {
          const userData = response.data.data;

          // Map the API response to our participant format
          const detailedUser: Participant = {
            ...participant,
            name: `${userData.first_name} ${userData.last_name}`,
            email: userData.email,
            avatar: userData.avatar || participant.avatar,
            status: userData.status || "active",
            isLoading: false,
          };

          setSelectedParticipant(detailedUser);
        } else {
          console.error("Invalid user API response format:", response.data);
          setSelectedParticipant({
            ...participant,
            isLoading: false,
          });
          toast.error("Kullanıcı bilgileri alınamadı");
        }
      } catch (error: any) {
        console.error("API Error fetching user details:", error);
        // More detailed error reporting
        if (error.response) {
          console.error(
            "API error response:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        }
        setSelectedParticipant({
          ...participant,
          isLoading: false,
        });
        toast.error("Kullanıcı bilgileri alınamadı");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);

      // In case of error, remove loading state but keep modal open
      if (selectedParticipant) {
        const fallbackUser: Participant = {
          ...selectedParticipant,
          isLoading: false,
        };
        setSelectedParticipant(fallbackUser);
      }
      toast.error("Kullanıcı bilgileri alınamadı");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Only proceed if we have raw event data
      if (!rawEventData || !formData.id) {
        toast.error("Güncellenecek etkinlik verisi bulunamadı");
        return;
      }

      // Prepare update data
      const updateData = {
        title: formData.title,
        description: formData.description,
        // Map other fields that can be updated
        event_date: formData.date.toISOString().split("T")[0],
        sport_id: rawEventData.sport_id, // Keep the original sport_id
        location_name: formData.location,
        max_participants: formData.maxParticipants,
      };

      // Construct the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const updateEndpoint = `${baseUrl}/events/${formData.id}`;
      console.log("Using update endpoint:", updateEndpoint);

      // Update the event
      const response = await api.put(updateEndpoint, updateData);

      console.log("Update response:", response);

      if (response.data.status === "success") {
        toast.success("Etkinlik bilgileri güncellendi");
        // Refresh event data
        fetchEventDetails(formData.id);
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(
          response.data.message || "Etkinlik güncellenirken bir hata oluştu"
        );
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      }
      toast.error("Etkinlik güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
      try {
        setLoading(true);

        // Construct the API endpoint
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const deleteEndpoint = `${baseUrl}/events/${formData.id}`;
        console.log("Using delete endpoint:", deleteEndpoint);

        // Delete the event
        const response = await api.delete(deleteEndpoint);

        console.log("Delete response:", response);

        if (response.data.status === "success") {
          toast.success("Etkinlik silindi");
          onOpenChange(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(
            response.data.message || "Etkinlik silinirken bir hata oluştu"
          );
        }
      } catch (error: any) {
        console.error("Error deleting event:", error);
        if (error.response) {
          console.error(
            "API error response:",
            error.response.status,
            error.response.data
          );
        }
        toast.error("Etkinlik silinirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApproveEvent = async () => {
    try {
      setLoading(true);

      // Construct the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const statusEndpoint = `${baseUrl}/events/${formData.id}/status`;
      console.log("Using status endpoint:", statusEndpoint);

      // Update event status to ACTIVE
      const response = await api.patch(
        statusEndpoint,
        { status: "ACTIVE" },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Approve response:", response);

      if (response.data.status === "success") {
        toast.success("Etkinlik onaylandı");
        // Update local state
        setFormData((prev) => ({ ...prev, status: "approved" }));
        if (onSuccess) onSuccess();
      } else {
        toast.error(
          response.data.message || "Etkinlik onaylanırken bir hata oluştu"
        );
      }
    } catch (error: any) {
      console.error("Error approving event:", error);
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      }
      toast.error("Etkinlik onaylanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const openRejectDialog = () => {
    setShowRejectDialog(true);
  };

  const handleRejectEvent = async () => {
    if (!rejectionReason) {
      toast.error("Lütfen bir red sebebi seçin");
      return;
    }

    setLoading(true);

    try {
      // Construct the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const statusEndpoint = `${baseUrl}/events/${formData.id}/status`;
      console.log("Using status endpoint:", statusEndpoint);

      // Update event status to REJECTED
      const response = await api.patch(
        statusEndpoint,
        {
          status: "REJECTED",
          rejection_reason:
            rejectionReason +
            (rejectionComment ? ` - ${rejectionComment}` : ""),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Reject response:", response.data);

      if (response.data.status === "success") {
        toast.success("Etkinlik reddedildi ve neden bildirildi");
        // Update local state
        setFormData((prev) => ({
          ...prev,
          status: "rejected",
          rejectionReason:
            rejectionReason +
            (rejectionComment ? ` - ${rejectionComment}` : ""),
        }));
        setShowRejectDialog(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(
          response.data.message || "Etkinlik reddedilirken bir hata oluştu"
        );
      }
    } catch (error: any) {
      console.error("Error rejecting event:", error);
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      }
      toast.error("Etkinlik reddedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Onay Bekliyor
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Onaylandı
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Reddedildi
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Tamamlandı
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleViewParticipantProfile = (participant: Participant) => {
    // Fetch and display participant details
    fetchParticipantDetails(participant);
  };

  const handleNavigateToUserProfile = (userId: string) => {
    // Gerçek uygulamada kullanıcı profiline yönlendirilecek
    toast.info(`${userId} ID'li kullanıcı profiline yönlendiriliyorsunuz`);
    router.push(`/dashboard/users/${userId}`);
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleDismissReport = (reportId: string) => {
    if (formData.reports) {
      setFormData((prev) => ({
        ...prev,
        reports: prev.reports?.map((report) =>
          report.id === reportId ? { ...report, status: "dismissed" } : report
        ),
      }));
      toast.success("Rapor reddedildi");
    }
  };

  const handleReviewReport = (reportId: string) => {
    if (formData.reports) {
      setFormData((prev) => ({
        ...prev,
        reports: prev.reports?.map((report) =>
          report.id === reportId ? { ...report, status: "reviewed" } : report
        ),
      }));
      toast.success("Rapor incelendi olarak işaretlendi");
    }
  };

  // Close modal functionality
  const closeUserModal = () => {
    setShowUserModal(false);
    // Clear the selected participant after a short delay to avoid UI flickering
    setTimeout(() => {
      setSelectedParticipant(null);
    }, 300);
  };

  const cancelEvent = async () => {
    try {
      console.log(`Attempting to cancel event ${formData.id}...`);
      setIsCancelling(true);

      // Construct the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const cancelEndpoint = `${baseUrl}/events/${formData.id}/cancel`;
      console.log("Using cancel endpoint:", cancelEndpoint);

      const response = await api.post(
        cancelEndpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      console.log("Cancel event response:", response.data);

      if (response.data.status === "success") {
        toast.success("Etkinlik başarıyla iptal edildi");

        // Update the event status in the UI
        setFormData({
          ...formData,
          status: "cancelled",
        });

        // If onEventStatusChange callback is provided, call it
        if (onSuccess) {
          onSuccess();
        }

        // Close the modal
        onOpenChange(false);
      } else {
        console.warn("Unexpected API response format:", response.data);
        toast.error("Etkinlik iptal edilirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Error cancelling event:", error);

      // More detailed error reporting
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      }

      toast.error("Etkinlik iptal edilirken bir hata oluştu");
    } finally {
      setIsCancelling(false);
    }
  };

  const completeEvent = async () => {
    try {
      console.log(`Attempting to complete event ${formData.id}...`);
      setIsCompleting(true);

      // Construct the API endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const completeEndpoint = `${baseUrl}/events/${formData.id}/complete`;
      console.log("Using complete endpoint:", completeEndpoint);

      const response = await api.post(
        completeEndpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      console.log("Complete event response:", response.data);

      if (response.data.status === "success") {
        toast.success("Etkinlik başarıyla tamamlandı");

        // Update the event status in the UI
        setFormData({
          ...formData,
          status: "completed",
        });

        // If onEventStatusChange callback is provided, call it
        if (onSuccess) {
          onSuccess();
        }

        // Close the modal
        onOpenChange(false);
      } else {
        console.warn("Unexpected API response format:", response.data);
        toast.error("Etkinlik tamamlanırken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Error completing event:", error);

      // More detailed error reporting
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      }

      toast.error("Etkinlik tamamlanırken bir hata oluştu");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] w-full md:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="mb-4 md:mb-6">
            <DialogTitle className="text-lg md:text-xl font-semibold">
              {isEditing ? "Etkinliği Düzenle" : "Etkinlik Detayları"}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              {isEditing
                ? "Etkinlik bilgilerini güncelleyin"
                : "Etkinlik detaylarını görüntüleyin ve yönetin"}
            </DialogDescription>
          </DialogHeader>

          {fetchingEvent ? (
            // Show skeleton loading UI
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          ) : (
            // Show actual content once data is fetched
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
                <TabsTrigger value="details" className="text-sm md:text-base">
                  Detaylar
                </TabsTrigger>
                <TabsTrigger
                  value="participants"
                  className="text-sm md:text-base relative"
                >
                  Katılımcılar
                  <Badge className="ml-1 bg-blue-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {formData.participants?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="text-sm md:text-base relative"
                >
                  Raporlar
                  {formData.reports &&
                    formData.reports.filter((r) => r.status === "pending")
                      .length > 0 && (
                      <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                        {
                          formData.reports.filter((r) => r.status === "pending")
                            .length
                        }
                      </Badge>
                    )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">Başlık</Label>
                    {isEditing ? (
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-sm md:text-base">{formData.title}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">Kategori</Label>
                    {isEditing ? (
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {rawEventData?.sport?.icon && (
                          <span className="text-xl">
                            {rawEventData.sport.icon}
                          </span>
                        )}
                        <Badge className="px-2 py-1">{formData.category}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Status info */}
                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">Durum</Label>
                    <div>
                      {getStatusBadge(formData.status)}
                      {rawEventData?.is_full && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-red-50 text-red-700 border-red-200"
                        >
                          Dolu
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">Tarih</Label>
                    {isEditing ? (
                      <div className="grid gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? (
                                format(formData.date, "PPP", { locale: tr })
                              ) : (
                                <span>Tarih seçin</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <DatePickerWithPresets
                              selected={formData.date}
                              onSelect={handleDateChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base">
                        {format(formData.date, "PPP", { locale: tr })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">Saat</Label>
                    {isEditing ? (
                      <Input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Başlangıç: {formData.time}</span>
                        </div>
                        {rawEventData?.end_time && (
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Bitiş:{" "}
                              {formatTimeFromISOString(rawEventData.end_time)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-base">
                      Katılımcı Durumu
                    </Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {rawEventData?.current_participants ||
                          formData.participants.length}{" "}
                        / {formData.maxParticipants}
                      </span>
                      <div className="h-2 bg-gray-200 rounded-full flex-1">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              ((rawEventData?.current_participants ||
                                formData.participants.length) /
                                formData.maxParticipants) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3 col-span-1 md:col-span-2">
                    <Label className="text-sm md:text-base">Konum</Label>
                    {isEditing ? (
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-sm md:text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {formData.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3 col-span-1 md:col-span-2">
                    <Label className="text-sm md:text-base">Açıklama</Label>
                    {isEditing ? (
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="min-h-[100px] md:min-h-[150px]"
                      />
                    ) : (
                      <p className="text-sm md:text-base whitespace-pre-wrap">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Katılımcılar Tab */}
              <TabsContent value="participants" className="relative">
                {formData.participants?.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Bu etkinliğe henüz katılımcı bulunmuyor.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.participants?.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() =>
                          handleViewParticipantProfile(participant)
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={participant.avatar}
                              alt={participant.name}
                            />
                            <AvatarFallback>
                              {participant.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {participant.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              participant.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {participant.status === "active"
                              ? "Aktif"
                              : "Pasif"}
                          </Badge>
                          <button
                            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="Katılımcı profili"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewParticipantProfile(participant);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Raporlar Tab */}
              <TabsContent value="reports" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Raporlar</h3>
                    {formData.reports && (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        {
                          formData.reports.filter((r) => r.status === "pending")
                            .length
                        }{" "}
                        Bekleyen
                      </Badge>
                    )}
                  </div>

                  {formData.reports && formData.reports.length > 0 ? (
                    <div className="space-y-3">
                      {formData.reports.map((report) => (
                        <div
                          key={report.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div
                            className={cn(
                              "p-3",
                              report.status === "pending"
                                ? "bg-yellow-50"
                                : report.status === "reviewed"
                                ? "bg-blue-50"
                                : "bg-gray-50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {report.reporterName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {report.date}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  report.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                    : report.status === "reviewed"
                                    ? "bg-blue-100 text-blue-800 border-blue-300"
                                    : "bg-gray-100 text-gray-800 border-gray-300"
                                )}
                              >
                                {report.status === "pending"
                                  ? "Beklemede"
                                  : report.status === "reviewed"
                                  ? "İncelendi"
                                  : "Reddedildi"}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm">{report.reason}</p>
                          </div>
                          {report.status === "pending" && (
                            <div className="p-3 border-t flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDismissReport(report.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reddet
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReviewReport(report.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                İncelendi
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Flag className="mx-auto h-8 w-8 opacity-30 mb-2" />
                      <p>Bu etkinlik için henüz rapor bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* İşlemler Tab */}
              <TabsContent value="actions" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">Etkinlik Durumu</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-muted-foreground">Mevcut Durum:</p>
                      {getStatusBadge(formData.status)}
                    </div>

                    {formData.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          className="flex-1"
                          onClick={handleApproveEvent}
                          disabled={loading}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Etkinliği Onayla
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={openRejectDialog}
                          disabled={loading}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Etkinliği Reddet
                        </Button>
                      </div>
                    )}

                    {showRejectDialog && (
                      <div className="border p-3 rounded-lg mt-3 space-y-3 bg-gray-50">
                        <h4 className="font-medium">Reddetme Nedeni</h4>
                        <div className="space-y-2">
                          <Select
                            value={rejectionReason}
                            onValueChange={setRejectionReason}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Reddetme nedeni seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {rejectionReasons.map((reason) => (
                                <SelectItem key={reason} value={reason}>
                                  {reason}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Textarea
                            placeholder="Ek açıklama (isteğe bağlı)"
                            value={rejectionComment}
                            onChange={(e) =>
                              setRejectionComment(e.target.value)
                            }
                            className="h-20"
                          />

                          <div className="flex justify-end gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowRejectDialog(false)}
                              disabled={loading}
                            >
                              İptal
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleRejectEvent}
                              disabled={loading}
                            >
                              Etkinliği Reddet
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">Etkinlik Yönetimi</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {isEditing
                          ? "Düzenleme Modundasınız"
                          : "Etkinliği Düzenle"}
                      </Button>

                      <Button
                        variant="destructive"
                        className="flex-1"
                        disabled={loading}
                        onClick={handleDelete}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Etkinliği Sil
                      </Button>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">Etkinlik İptali</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        disabled={loading}
                        onClick={cancelEvent}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Etkinliği İptal Et
                      </Button>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">
                      Etkinlik Tamamlama
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        disabled={loading}
                        onClick={completeEvent}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Etkinliği Tamamla
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="gap-2">
            {fetchingEvent ? (
              <Skeleton className="h-10 w-24" />
            ) : isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button type="button" onClick={handleSave} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> Kaydet
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => onOpenChange(false)}>
                Kapat
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserDetailModal
        open={showUserModal}
        onOpenChange={closeUserModal}
        user={selectedParticipant as any}
        isNested={true}
      />
    </>
  );
}
