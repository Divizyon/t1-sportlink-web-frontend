"use client";

import { useState } from "react";
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

interface Event {
  id: string;
  title: string;
  date: string;
  category: string;
  status: "completed" | "upcoming" | "canceled";
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  gender?: string;
  age?: number;
  registeredDate: string;
  lastActive: string;
  status: "active" | "suspended" | "blocked";
  role?: "user" | "admin" | "moderator";
  bio?: string;
  address?: string;
  favoriteCategories?: string[];
  events?: Event[];
  eventCount?: number;
  completedEvents?: number;
}

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserDetailModal({
  open,
  onOpenChange,
  user,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState("profil");

  // Mock kullanıcı verisini kullan eğer gerçek bir kullanıcı yoksa
  const mockUser: User = user || {
    id: "usr-123",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    avatar: "/avatars/01.png",
    phone: "+90 555 123 4567",
    gender: "Erkek",
    age: 28,
    registeredDate: "01.01.2023",
    lastActive: "Bugün, 10:30",
    status: "active",
    role: "user",
    bio: "Spor ve açık hava aktivitelerine meraklı bir profesyonel.",
    address: "İstanbul, Türkiye",
    favoriteCategories: ["Futbol", "Koşu", "Bisiklet"],
    events: [
      {
        id: "evt-1",
        title: "Sahil Koşusu",
        date: "15.08.2023",
        category: "Koşu",
        status: "completed",
      },
      {
        id: "evt-2",
        title: "Hafta Sonu Basketbol",
        date: "22.08.2023",
        category: "Basketbol",
        status: "completed",
      },
      {
        id: "evt-3",
        title: "Bisiklet Turu",
        date: "29.08.2023",
        category: "Bisiklet",
        status: "completed",
      },
      {
        id: "evt-4",
        title: "Sabah Koşusu",
        date: "10.09.2023",
        category: "Koşu",
        status: "upcoming",
      },
    ],
    eventCount: 12,
    completedEvents: 8,
  };

  const userData = user || mockUser;

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
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
      default:
        return null;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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
                <p className="font-medium">+90 555 123 4567</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Cinsiyet</p>
                <p className="font-medium">Erkek</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Yaş</p>
                <p className="font-medium">28</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Katılım Tarihi</p>
                <p className="font-medium">01.01.2023</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Son Aktivite</p>
                <p className="font-medium">Bugün, 10:30</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Adres</p>
                <p className="font-medium">İstanbul, Türkiye</p>
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
                  <span>8 / 12</span>
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
              <Badge variant="outline">
                Toplam: {userData.events?.length || 0}
              </Badge>
            </div>

            <div className="space-y-3 mt-4">
              {userData.events?.map((event) => (
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
              ))}
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
          <Button type="button" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
