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
import { processUserData, CommonUser } from "@/lib/userDataService";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data inline for demonstration
export const sampleUser = {
  id: "user123",
  name: "Ahmet Yılmaz",
  email: "ahmet.yilmaz@example.com",
  status: "active",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  phone: "+90 532 123 4567",
  gender: "Erkek",
  age: 34,
  registeredDate: "15.03.2023",
  lastActive: "Bugün, 14:35",
  role: "üye",
  bio: "İstanbul'da yaşayan koşu ve bisiklet tutkunuyum. Hafta sonları grup etkinliklerine katılmayı seviyorum.",
  address: "Kadıköy, İstanbul",
  favoriteCategories: ["Koşu", "Bisiklet", "Yüzme"],
  events: [
    {
      id: "event001",
      title: "Caddebostan Sahil Koşusu",
      date: "10 Haziran 2023",
      category: "Koşu",
      status: "completed",
    },
    {
      id: "event002",
      title: "Belgrad Ormanı Bisiklet Turu",
      date: "25 Haziran 2023",
      category: "Bisiklet",
      status: "completed",
    },
    {
      id: "event003",
      title: "Boğaz Yüzme Etkinliği",
      date: "14 Temmuz 2023",
      category: "Yüzme",
      status: "canceled",
    },
    {
      id: "event004",
      title: "Büyükada Bisiklet Turu",
      date: "12 Ağustos 2023",
      category: "Bisiklet",
      status: "upcoming",
    },
  ],
  eventCount: 4,
  completedEvents: 2,
  joinDate: "15.03.2023",
};

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
  isLoading?: boolean; // Add isLoading flag
}

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  // New prop to identify if this modal is nested inside another modal
  isNested?: boolean;
}

// Loading skeleton component for the modal
function UserDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-16 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
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

  // Use the sample user data if no user is provided
  const userData: CommonUser = processUserData(user || sampleUser);

  // Check if data is in loading state
  const isLoading = user?.isLoading || false;

  // Calculate event counts only if events array exists
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
        // Return unknown status if status is not recognized
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Bilinmiyor
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
        className={`max-w-[95vw] w-full md:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6 ${
          isNested ? "z-[100]" : "z-50"
        }`}
        onPointerDownOutside={(e) => {
          // Prevent closing if nested and clicking outside
          if (isNested) {
            e.preventDefault();
          }
        }}
      >
        {isLoading ? (
          // Render loading skeleton when data is loading
          <UserDetailSkeleton />
        ) : (
          // Render actual content when data is available
          <>
            <DialogHeader className="mb-4 md:mb-6">
              <DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{userData.name}</span>
              </DialogTitle>
            </DialogHeader>

            <Tabs
              defaultValue="profil"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
                <TabsTrigger value="profil" className="text-sm md:text-base">
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="etkinlikler"
                  className="text-sm md:text-base"
                >
                  Etkinlikler
                </TabsTrigger>
                <TabsTrigger value="islemler" className="text-sm md:text-base">
                  İşlemler
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profil" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      E-posta
                    </p>
                    <p className="text-sm md:text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      Durum
                    </p>
                    {getStatusBadge(userData.status || "")}
                  </div>

                  {userData.registeredDate && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Kayıt Tarihi
                      </p>
                      <p className="text-sm md:text-base">
                        {userData.registeredDate}
                      </p>
                    </div>
                  )}

                  {userData.lastActive && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Son Aktivite
                      </p>
                      <p className="text-sm md:text-base">
                        {userData.lastActive}
                      </p>
                    </div>
                  )}

                  {userData.phone && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Telefon
                      </p>
                      <p className="text-sm md:text-base">{userData.phone}</p>
                    </div>
                  )}

                  {userData.address && (
                    <div className="space-y-2 md:space-y-3 col-span-1 md:col-span-2">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Adres
                      </p>
                      <p className="text-sm md:text-base">{userData.address}</p>
                    </div>
                  )}
                </div>

                {userData.bio && (
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      Hakkında
                    </p>
                    <p className="text-sm md:text-base">{userData.bio}</p>
                  </div>
                )}

                {userData.favoriteCategories &&
                  userData.favoriteCategories.length > 0 && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        İlgilendiği Kategoriler
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {userData.favoriteCategories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="text-xs md:text-sm"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </TabsContent>

              {/* Etkinlikler Tab */}
              <TabsContent value="etkinlikler" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Katıldığı Etkinlikler</h3>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
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
                  {userData.events && userData.events.length > 0 ? (
                    userData.events.map((event) => (
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
                {userData.eventCount !== undefined &&
                userData.completedEvents !== undefined ? (
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-4">
                      Kullanıcı İstatistikleri
                    </h3>

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
                        <p className="font-medium">
                          {userData.eventCount} etkinlik
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tamamlama Oranı
                        </p>
                        <p className="font-medium">
                          {userData.eventCount > 0
                            ? Math.round(
                                (userData.completedEvents /
                                  userData.eventCount) *
                                  100
                              )
                            : 0}
                          %
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Kullanıcı Durumu
                        </p>
                        <div className="mt-1">
                          {getStatusBadge(userData.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Kullanıcı istatistikleri bulunamadı.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Kapat
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
