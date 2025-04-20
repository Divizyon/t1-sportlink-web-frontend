"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail } from "lucide-react";
import { enrichUserData, CommonUser } from "@/lib/userDataService";
import {
  USER_PROFILES,
  getUserEvents,
} from "@/mockups/components/users/userProfile";

interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  status: "completed" | "upcoming" | "canceled";
}

// Define our own User interface instead of extending
interface User {
  id: string | number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  phone?: string;
  gender?: string;
  age?: number;
  registeredDate?: string;
  lastActive?: string;
  role?: string;
  bio?: string;
  address?: string;
  favoriteCategories?: string[];
  events?: Event[];
  eventCount?: number;
  completedEvents?: number;
  joinDate?: string;
}

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  // New prop to identify if this modal is nested inside another modal
  isNested?: boolean;
}

export function UserDetailModal({
  open,
  onOpenChange,
  user,
  isNested = false,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState("profil");
  const [localOpen, setLocalOpen] = useState(false);

  // Sync the local state with the prop
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Handle closing the modal safely
  const handleOpenChange = (newOpenState: boolean) => {
    setLocalOpen(newOpenState);
    onOpenChange(newOpenState);
  };

  // Ensure consistent user data using our service
  const userData: CommonUser = user
    ? enrichUserData(user)
    : enrichUserData(USER_PROFILES[0]);

  // Get user event data from the new mockups
  const userEventData = userData.id
    ? getUserEvents(userData.id.toString())
    : { upcoming: [], participated: [], organized: [] };

  // Create type-safe event data for the component
  const userEvents: Event[] = userEventData.upcoming.map((event) => {
    // Determine the correct status based on the event's status
    const statusValue: "completed" | "upcoming" | "canceled" =
      event.status === "completed"
        ? "completed"
        : event.status === "canceled"
        ? "canceled"
        : "upcoming";

    return {
      id: event.id.toString(),
      title: event.title,
      date: new Date(event.date).toLocaleDateString("tr-TR"),
      category: event.category,
      status: statusValue,
    };
  });

  // Normalize status to ensure consistent handling
  // This ensures that regardless of whether the status comes as "active" or "aktif", it's handled the same way
  const normalizedStatus = userData.status?.toLowerCase();

  // Calculate event counts directly from the events array
  const completedCount =
    userData.events?.filter((e) => e.status === "completed").length || 0;
  const upcomingCount =
    userData.events?.filter((e) => e.status === "upcoming").length || 0;
  const canceledCount =
    userData.events?.filter((e) => e.status === "canceled").length || 0;

  const getStatusBadge = (status: string) => {
    // Normalize status to lowercase for consistent case handling
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "active":
      case "aktif":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Aktif
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Askıya Alınmış
          </Badge>
        );
      case "blocked":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Engellendi
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Pasif
          </Badge>
        );
      default:
        // Return Aktif as default if status is unknown
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Aktif
          </Badge>
        );
    }
  };

  const getEventStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Tamamlandı
          </Badge>
        );
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Yaklaşan
          </Badge>
        );
      case "canceled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            İptal Edildi
          </Badge>
        );
      default:
        return null;
    }
  };

  // Only render the dialog if the modal should be open
  // This prevents old instances from remaining in the DOM
  if (!open && !localOpen) {
    return null;
  }

  return (
    <Dialog
      open={localOpen}
      onOpenChange={handleOpenChange}
      // Set modal to true to ensure proper stacking behavior
      modal={true}
    >
      <DialogContent
        className="sm:max-w-[700px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: isNested ? 100 : 50,
        }}
        // Fix the handler to allow closing by clicking outside
        onPointerDownOutside={(e) => {
          // Always allow closing by clicking outside, regardless of nesting
          handleOpenChange(false);
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Kullanıcı Detayları</DialogTitle>
            {getStatusBadge(userData.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            Kullanıcı detaylarını görüntüleyin ve gerekirse düzenleyin.
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
            <TabsTrigger value="islemler">İşlemler</TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profil" className="space-y-4 pt-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name ? userData.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{userData.name}</h2>
                <p className="text-muted-foreground flex items-center justify-center mt-1">
                  <Mail className="mr-2 h-4 w-4" /> {userData.email}
                </p>
                <p className="text-sm text-muted-foreground uppercase mt-1">
                  {userData.role || "USER"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{userData.phone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Cinsiyet</p>
                <p className="font-medium">{userData.gender}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Yaş</p>
                <p className="font-medium">{userData.age}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Katılım Tarihi</p>
                <p className="font-medium">{userData.registeredDate}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Son Aktivite</p>
                <p className="font-medium">{userData.lastActive}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Adres</p>
                <p className="font-medium">{userData.address}</p>
              </div>
            </div>

            {userData.bio && (
              <div className="mt-6">
                <h4 className="text-sm font-medium">Hakkında</h4>
                <p className="text-muted-foreground mt-1">{userData.bio}</p>
              </div>
            )}

            {userData.favoriteCategories &&
              userData.favoriteCategories.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium">Favori Kategoriler</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.favoriteCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-6">
              <h4 className="text-sm font-medium">Etkinlik Katılımı</h4>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>Tamamlanan Etkinlikler</span>
                  <span>
                    {userData.completedEvents} / {userData.eventCount}
                  </span>
                </div>
                <Progress
                  value={
                    (userData.completedEvents! / userData.eventCount!) * 100
                  }
                  className="h-2 mt-1"
                />
              </div>
            </div>
          </TabsContent>

          {/* Etkinlikler Tab */}
          <TabsContent value="etkinlikler" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Katıldığı Etkinlikler</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Tamamlanan: {completedCount}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700"
                >
                  Yaklaşan: {upcomingCount}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  İptal Edilen: {canceledCount}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {userEvents && userEvents.length > 0 ? (
                userEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.category}</span>
                      </div>
                    </div>
                    <div>{getEventStatusBadge(event.status)}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Kullanıcının katıldığı etkinlik bulunamadı.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* İşlemler Tab */}
          <TabsContent value="islemler" className="space-y-4 pt-4">
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-4">Kullanıcı İstatistikleri</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tamamlanan Etkinlikler
                  </p>
                  <p className="font-medium">
                    {userData.completedEvents} etkinlik
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Toplam Etkinlikler
                  </p>
                  <p className="font-medium">{userData.eventCount} etkinlik</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Tamamlama Oranı
                  </p>
                  <p className="font-medium">
                    {Math.round(
                      (userData.completedEvents! / userData.eventCount!) * 100
                    )}
                    %
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcı Durumu
                  </p>
                  <div className="mt-1">{getStatusBadge(userData.status)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" onClick={() => handleOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
