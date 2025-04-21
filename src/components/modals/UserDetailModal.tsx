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
import {
  getUserStatusBadgeClasses,
  getUserStatusBadgeLabel,
  getEventStatusBadgeClasses,
  getEventStatusBadgeLabel,
  getUserDetailModalData,
} from "@/mockups";

interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  status: string;
  isOrganizer?: boolean;
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
  const [userData, setUserData] = useState<User | null>(user || null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);

  // Sync the local state with the prop
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Handle closing the modal safely
  const handleOpenChange = (newOpenState: boolean) => {
    setLocalOpen(newOpenState);
    onOpenChange(newOpenState);
  };

  // Fetch user data and events from mockup data
  useEffect(() => {
    if (!userData && user) {
      setUserData(user);
    }

    if (userData?.id) {
      // Use getUserDetailModalData to get complete data
      const detailData = getUserDetailModalData(String(userData.id));

      if (detailData) {
        // Update stats
        setCompletedCount(detailData.stats.completedCount);
        setUpcomingCount(detailData.stats.upcomingCount);
        setCanceledCount(detailData.stats.canceledCount);

        // Map events to the format expected by the component
        const allEvents = detailData.userEvents.all.map((event) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date).toLocaleDateString(),
          category: event.category,
          status:
            event.status === "completed"
              ? "completed"
              : event.status === "cancelled"
              ? "canceled"
              : "upcoming",
          isOrganizer: event.isOrganizer,
        }));

        setUserEvents(allEvents);
      }
    }
  }, [userData?.id, user]);

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className={getUserStatusBadgeClasses(status)}>
        {getUserStatusBadgeLabel(status)}
      </Badge>
    );
  };

  const getEventStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className={getEventStatusBadgeClasses(status)}>
        {getEventStatusBadgeLabel(status)}
      </Badge>
    );
  };

  // Only render the dialog if the modal should be open
  // This prevents old instances from remaining in the DOM
  if (!open && !localOpen) {
    return null;
  }

  // If we don't have user data, don't render anything
  if (!userData) {
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
                <p className="font-medium">
                  {userData.registeredDate || userData.joinDate}
                </p>
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
                    {userData.completedEvents || completedCount} /{" "}
                    {userData.eventCount || userEvents.length}
                  </span>
                </div>
                <Progress
                  value={
                    ((userData.completedEvents || completedCount) /
                      (userData.eventCount || userEvents.length || 1)) *
                    100
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
                    {userData.completedEvents || completedCount} etkinlik
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Toplam Etkinlikler
                  </p>
                  <p className="font-medium">
                    {userData.eventCount || userEvents.length} etkinlik
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Tamamlama Oranı
                  </p>
                  <p className="font-medium">
                    {Math.round(
                      ((userData.completedEvents || completedCount) /
                        (userData.eventCount || userEvents.length || 1)) *
                        100
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
