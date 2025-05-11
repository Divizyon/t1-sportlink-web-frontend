"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail, Flag, ArrowUpRight } from "lucide-react";
import { processUserData, CommonUser } from "@/lib/userDataService";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { reportService, Report } from "@/services/reportService";
import { userService, UserDetails } from "@/services/userService";

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
  userId: string;
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
  userId,
  isNested = false,
}: UserDetailModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profil");
  const [localOpen, setLocalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isBanning, setIsBanning] = useState(false);
  const { toast } = useToast();

  // Sync the local state with the prop
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Load user details
  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    }
  }, [open, userId]);

  // Load reports when reports tab is active
  useEffect(() => {
    if (userId && activeTab === "raporlar") {
      loadReports();
    }
  }, [userId, activeTab]);

  const loadUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserDetails(userId);
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı detayları yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadReports = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      console.log('Raporlar yükleniyor... UserId:', userId);
      const response = await reportService.getUserReports(userId);
      console.log('Raporlar yanıtı:', response);
      if (response.data?.reports) {
        // Sadece seçili kullanıcıya ait raporları filtrele
        const userReports = response.data.reports.filter(report => 
          report.raporlanan === userData?.name || // Kullanıcının adıyla eşleştir
          report.reported_user_id === userId // veya ID ile eşleştir
        );
        console.log('Filtrelenmiş raporlar:', userReports);
        setReports(userReports);
      }
    } catch (error: any) {
      console.error('Raporlar yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: error.message || "Raporlar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (report: Report) => {
    if (!report.id) return;

    try {
      setIsBanning(true);
      const response = await reportService.banUserFromReport(report.id);
      toast({
        title: "Başarılı",
        description: response.message || "Kullanıcı başarıyla banlandı",
      });
      handleOpenChange(false); // Modal'ı kapat
      router.refresh(); // Sayfayı yenile
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı banlanırken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsBanning(false);
    }
  };

  const handleReportClick = (reportId: string) => {
    // Önce modalı kapat
    handleOpenChange(false);
    // Raporlar sayfasına yönlendir ve rapor ID'sini query param olarak ekle
    router.push(`/dashboard/reports?reportId=${reportId}`);
  };

  // Handle closing the modal safely
  const handleOpenChange = (newOpenState: boolean) => {
    setLocalOpen(newOpenState);
    onOpenChange(newOpenState);
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "active":
      case "aktif":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Aktif
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Askıya Alınmış
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Engellendi
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Pasif
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Bilinmiyor
          </Badge>
        );
    }
  };

  const getEventStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Tamamlandı
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Yaklaşan
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
    <Dialog open={localOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogContent
        className={`max-w-[95vw] w-full md:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6 ${
          isNested ? "z-[100]" : "z-50"
        }`}
        onPointerDownOutside={(e) => {
          if (isNested) {
            e.preventDefault();
          }
        }}
        aria-describedby="user-details-description"
      >
        <DialogHeader>
          <DialogTitle>Kullanıcı Detayları</DialogTitle>
          <DialogDescription id="user-details-description">
            Kullanıcının profil bilgileri, etkinlikleri ve raporları
          </DialogDescription>
        </DialogHeader>

        {isLoading || !userData ? (
          <UserDetailSkeleton />
        ) : (
          <>
            <div className="mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src={userData.avatar || userData.profile_picture} alt={userData.name} />
                  <AvatarFallback>{userData.name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <span className="text-lg md:text-xl font-semibold">{userData.name}</span>
                {userData.is_watched && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 ml-2">
                    İzleniyor
                  </Badge>
                )}
              </div>
            </div>

            <Tabs defaultValue="profil" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
                <TabsTrigger value="profil" className="text-sm md:text-base">
                  Profil
                </TabsTrigger>
                <TabsTrigger value="etkinlikler" className="text-sm md:text-base">
                  Etkinlikler
                </TabsTrigger>
                <TabsTrigger value="raporlar" className="text-sm md:text-base">
                  Raporlar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profil" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      E-posta
                    </p>
                    <p className="text-sm md:text-base">{userData.email}</p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-medium text-muted-foreground">
                      Durum
                    </p>
                    {getStatusBadge(userData.status)}
                  </div>

                  {userData.registeredDate && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Kayıt Tarihi
                      </p>
                      <p className="text-sm md:text-base">
                        {new Date(userData.registeredDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  )}

                  {userData.lastActive && (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base font-medium text-muted-foreground">
                        Son Aktivite
                      </p>
                      <p className="text-sm md:text-base">
                        {new Date(userData.lastActive).toLocaleDateString('tr-TR')}
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

                {userData.favoriteCategories && userData.favoriteCategories.length > 0 && (
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
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Tamamlanan: {userData.completedEvents}
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Toplam: {userData.eventCount}
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
                            <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
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

              {/* Raporlar Tab */}
              <TabsContent value="raporlar" className="space-y-4 pt-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Kullanıcı Raporları</h3>
                    {reports.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBanUser(reports[0])}
                        disabled={isBanning}
                      >
                        {isBanning ? "Banlanıyor..." : "Kullanıcıyı Banla"}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : reports.length > 0 ? (
                      reports.map((report) => (
                        <div 
                          key={report.id} 
                          className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => handleReportClick(report.id)}
                        >
                          <div className="bg-muted/50 p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm">Rapor: {report.konu}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Raporlayan: {report.raporlayan}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {report.tarih}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Rapor Türü:</p>
                              <p className="text-sm text-muted-foreground">
                                {report.tur}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <Badge variant="secondary">{report.durum}</Badge>
                              <Badge variant="outline" className={
                                report.oncelik === "Yüksek" 
                                  ? "bg-red-50 text-red-700" 
                                  : report.oncelik === "Orta"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-blue-50 text-blue-700"
                              }>
                                {report.oncelik}
                              </Badge>
                            </div>
                            {report.admin_notes && (
                              <div className="pt-2 border-t">
                                <p className="text-sm font-medium text-muted-foreground">Admin Notu:</p>
                                <p className="mt-1 text-sm whitespace-pre-wrap">{report.admin_notes}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                              <ArrowUpRight className="h-4 w-4" />
                              <span>Detayları görüntülemek için tıklayın</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Flag className="mx-auto h-8 w-8 opacity-30 mb-2" />
                        <p>Bu kullanıcı için henüz rapor bulunmuyor.</p>
                      </div>
                    )}
                  </div>
                </div>
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
