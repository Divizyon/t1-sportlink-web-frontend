"use client";

import React, { useState, useEffect } from "react";
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
import axios from "axios";

interface EventType {
  id: number;
  title: string;
  description: string;
  date: Date | string;
  time: string;
  location: string;
  sport_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reports: ReportType[];
  participants: ParticipantType[];
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  category?: string;
  max_participants: number;
}

interface ReportType {
  id: number;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

interface ParticipantType {
  user_id: number;
  status: string;
}

interface EventDetailModalProps {
  event: EventType | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedEvent: EventType) => void;
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

export function EventDetailModal({ event, open, onClose, onUpdate }: EventDetailModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantType | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date instanceof Date ? event.date : new Date(event.date),
        time: event.time,
        location: event.location,
        sport_id: event.sport_id,
        status: event.status,
        reports: event.reports || [],
        participants: event.participants || [],
        created_at: event.created_at || new Date().toISOString(),
        updated_at: event.updated_at || new Date().toISOString(),
        rejection_reason: event.rejection_reason,
        category: event.category,
        max_participants: event.max_participants
      });
    } else {
      setFormData(null);
    }
  }, [event]);

  if (!event || !formData) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date && formData) {
      setFormData({
        ...formData,
        date: date,
        id: formData.id,
        title: formData.title,
        description: formData.description,
        time: formData.time,
        location: formData.location,
        sport_id: formData.sport_id,
        status: formData.status,
        reports: formData.reports,
        participants: formData.participants,
        created_at: formData.created_at,
        updated_at: formData.updated_at,
        max_participants: formData.max_participants
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData(prev => ({
        ...prev,
        time: e.target.value
      }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData(prev => ({
        ...prev,
        location: e.target.value
      }));
    }
  };

  const handleSave = async () => {
    try {
    setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }

      if (!formData) {
        throw new Error("Form verisi bulunamadı");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onUpdate(response.data.data);
      toast.success("Etkinlik başarıyla güncellendi");
      onClose();
    } catch (error) {
      console.error("Etkinlik güncellenirken hata:", error);
      toast.error("Etkinlik güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) {
      toast.error('Etkinlik ID bulunamadı');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${formData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Etkinlik başarıyla silindi');
      onClose();
    } catch (error) {
      console.error('Etkinlik silinirken hata oluştu:', error);
      toast.error('Etkinlik silinirken bir hata oluştu');
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setFormData(prev => prev ? { ...prev, status: 'approved' } : null);
      onUpdate(response.data.data);
      toast.success("Etkinlik onaylandı");
    } catch (error) {
      console.error("Etkinlik onaylanırken hata:", error);
      toast.error("Etkinlik onaylanırken bir hata oluştu");
    } finally {
        setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
    setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}/reject`,
        {
          reason: rejectionReason,
          comment: rejectionComment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setFormData(prev => prev ? { ...prev, status: 'rejected', rejection_reason: rejectionReason } : null);
      onUpdate(response.data.data);
      toast.success("Etkinlik reddedildi");
      setShowRejectDialog(false);
    } catch (error) {
      console.error("Etkinlik reddedilirken hata:", error);
      toast.error("Etkinlik reddedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: number, action: 'review' | 'dismiss') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}/reports/${reportId}/${action}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setFormData(prev => prev ? {
        ...prev,
        reports: prev.reports.map(report => 
          report.id === reportId 
            ? { ...report, status: action === 'review' ? 'reviewed' : 'dismissed' }
            : report
        )
      } : null);
      onUpdate(response.data.data);
      toast.success(`Rapor ${action === 'review' ? 'incelendi' : 'reddedildi'}`);
    } catch (error) {
      console.error("Rapor işlenirken hata:", error);
      toast.error("Rapor işlenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantAction = async (userId: number, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Oturum açmanız gerekiyor");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}/participants/${userId}/${action}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setFormData(prev => prev ? {
        ...prev,
        participants: prev.participants.map(participant => 
          participant.user_id === userId 
            ? { ...participant, status: action === 'approve' ? 'approved' : 'rejected' }
            : participant
        )
      } : null);
      onUpdate(response.data.data);
      toast.success(`Katılımcı ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`);
    } catch (error) {
      console.error("Katılımcı işlenirken hata:", error);
      toast.error("Katılımcı işlenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: EventType["status"]) => {
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

  const handleViewParticipantProfile = (participant: ParticipantType) => {
    setSelectedParticipant(participant);
    setShowUserModal(true);
  };

  const handleNavigateToUserProfile = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleCategoryChange = (value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        category: value,
        id: formData.id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        sport_id: formData.sport_id,
        status: formData.status,
        reports: formData.reports,
        participants: formData.participants,
        created_at: formData.created_at,
        updated_at: formData.updated_at,
        max_participants: formData.max_participants
      });
    }
  };

  const handleMaxParticipantsChange = (value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        max_participants: parseInt(value) || 0,
        id: formData.id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        sport_id: formData.sport_id,
        status: formData.status,
        reports: formData.reports,
        participants: formData.participants,
        created_at: formData.created_at,
        updated_at: formData.updated_at
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] w-full md:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader className="mb-4 md:mb-6">
            <DialogTitle className="text-lg md:text-xl font-semibold">
            {loading ? "Güncelleniyor..." : "Etkinlik Detayları"}
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base">
            {loading
              ? "Etkinlik bilgileri güncelleniyor"
                : "Etkinlik detaylarını görüntüleyin ve yönetin"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
              <TabsTrigger value="details" className="text-sm md:text-base">
                Detaylar
              </TabsTrigger>
              <TabsTrigger value="participants" className="text-sm md:text-base relative">
                Katılımcılar
                <Badge className="ml-1 bg-blue-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {formData.participants?.length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-sm md:text-base relative">
                Raporlar
              {formData.reports && formData.reports.length > 0 && (
                  <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {formData.reports.filter(r => r.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-sm md:text-base">Başlık</Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full"
                    />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label className="text-sm md:text-base">Kategori</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
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
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label className="text-sm md:text-base">Tarih</Label>
                <DatePickerWithPresets
                  selected={formData.date instanceof Date ? formData.date : new Date(formData.date)}
                  onSelect={handleDateChange}
                />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label className="text-sm md:text-base">Saat</Label>
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                  onChange={handleTimeChange}
                      className="w-full"
                    />
                </div>

                <div className="space-y-2 md:space-y-3 col-span-1 md:col-span-2">
                  <Label className="text-sm md:text-base">Konum</Label>
                    <Input
                      name="location"
                      value={formData.location}
                  onChange={handleLocationChange}
                      className="w-full"
                    />
                </div>

                <div className="space-y-2 md:space-y-3 col-span-1 md:col-span-2">
                  <Label className="text-sm md:text-base">Açıklama</Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="min-h-[100px] md:min-h-[150px]"
                    />
              </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Katılımcılar</h3>
                  <span className="text-sm text-muted-foreground">
                  {formData.participants?.length || 0} / {formData.max_participants}
                  </span>
                </div>

                <div className="space-y-3">
                {formData.participants?.map((participant) => (
                    <div
                    key={participant.user_id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleViewParticipantProfile(participant)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                          {participant.user_id.toString().charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">Katılımcı #{participant.user_id}</p>
                          <p className="text-sm text-muted-foreground">
                          {participant.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                          handleNavigateToUserProfile(participant.user_id.toString());
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Raporlar</h3>
                {Array.isArray(formData.reports) && formData.reports.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                    {formData.reports.filter((r) => r.status === "pending").length}{" "}
                      Bekleyen
                    </Badge>
                  )}
                </div>

              {Array.isArray(formData.reports) && formData.reports.length > 0 ? (
                  <div className="space-y-3">
                    {formData.reports.map((report) => (
                    <div key={report.id} className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{report.reason}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(report.created_at).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Durum: {report.status === 'pending' ? 'Beklemede' : 'Çözüldü'}
                      </p>
                      <div className="flex gap-2 mt-2">
                            <Button
                          size="sm"
                              variant="outline"
                          onClick={() => handleReportAction(report.id, 'review')}
                          disabled={report.status === 'dismissed'}
                            >
                          İncele
                            </Button>
                            <Button
                              size="sm"
                          variant="outline"
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          disabled={report.status === 'reviewed'}
                            >
                          Reddet
                            </Button>
                      </div>
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
          </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
                  İptal
                </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Güncelleniyor..." : "Kaydet"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}

export default EventDetailModal;
