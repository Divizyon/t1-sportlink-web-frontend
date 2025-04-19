"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  Calendar,
  Plus,
  Bell,
  Flag,
  FileText,
  Megaphone,
  PenSquare,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlusCircle,
  BellRing,
  Newspaper,
  SendHorizontal,
} from "lucide-react";
import { MonthlyEventsChart } from "@/components/dashboard/charts/MonthlyEventsChart";
import { TodaysEvents } from "@/components/dashboard/TodaysEvents";
import { RecentParticipants } from "@/components/dashboard/RecentParticipants";
import { UserTable } from "@/components/dashboard/tables/UserTable";
import { EventParticipationChart } from "@/components/dashboard/charts/EventParticipationChart";
import { CategoryFilterDropdown } from "@/components/dashboard/filters/CategoryFilterDropdown";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { UserDetailModal } from "@/components/modals/UserDetailModal";
import { NewEventModal } from "@/components/modals/NewEventModal";
import { ReportsModal } from "@/components/modals/ReportsModal";
import { NewsModal } from "@/components/modals/NewsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

type ModalType =
  | "event"
  | "newEvent"
  | "newNews"
  | "newAnnouncement"
  | "user"
  | "users"
  | "dailyEvents"
  | "activeUsers"
  | "totalParticipants"
  | "reportedUsers"
  | "reportedEvents"
  | "orgEvents"
  | null;

// Raporlar için demo verileri
type Priority = "high" | "medium" | "low";
type Status = "pending" | "reviewing" | "resolved" | "rejected";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  avatar?: string;
  registeredDate?: string;
  lastActive?: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  organizer: string;
  image?: string;
  participants?: any[];
  createdAt?: string;
}

interface Report {
  id: number;
  subject: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  entityType: "user" | "event";
  entityId: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "reviewing" | "resolved" | "rejected";
}

// Demo verileri
const DEMO_REPORTS: Report[] = [
  {
    id: 1,
    subject: "Uygunsuz İçerik",
    description: "Etkinlik açıklamasında uygunsuz içerik bulunuyor.",
    reportedBy: "Ahmet Yılmaz",
    reportedDate: "2023-07-15",
    entityType: "event",
    entityId: 101,
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    subject: "Taciz Edici Davranış",
    description: "Kullanıcı mesajlarda taciz edici davranışlarda bulunuyor.",
    reportedBy: "Ayşe Demir",
    reportedDate: "2023-07-14",
    entityType: "user",
    entityId: 203,
    priority: "high",
    status: "reviewing",
  },
  {
    id: 3,
    subject: "Yanlış Bilgi",
    description: "Etkinlik konumu yanlış belirtilmiş.",
    reportedBy: "Mehmet Can",
    reportedDate: "2023-07-12",
    entityType: "event",
    entityId: 105,
    priority: "medium",
    status: "pending",
  },
  {
    id: 4,
    subject: "Sahte Profil",
    description: "Bu hesap sahte olabilir.",
    reportedBy: "Zeynep Kaya",
    reportedDate: "2023-07-10",
    entityType: "user",
    entityId: 210,
    priority: "medium",
    status: "resolved",
  },
  {
    id: 5,
    subject: "Spam İçerik",
    description: "Etkinlik spam içeriği barındırıyor.",
    reportedBy: "Emre Güneş",
    reportedDate: "2023-07-08",
    entityType: "event",
    entityId: 112,
    priority: "low",
    status: "rejected",
  },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preferredReportFilter, setPreferredReportFilter] =
    useState<string>("all");

  // Raporlar için filtre state'leri
  const [reportFilter, setReportFilter] = useState<"all" | "users" | "events">(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const [allReports, setAllReports] = useState<Report[]>(DEMO_REPORTS);

  const demoUsers = [
    {
      id: 1,
      name: "Ahmet Koç",
      email: "ahmet@example.com",
      role: "üye",
      status: "aktif",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      role: "üye",
      status: "aktif",
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Mehmet Can",
      email: "mehmet@example.com",
      role: "üye",
      status: "aktif",
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      role: "üye",
      status: "aktif",
      joinDate: "2023-03-15",
    },
    {
      id: 5,
      name: "Emre Güneş",
      email: "emre@example.com",
      role: "üye",
      status: "beklemede",
      joinDate: "2023-04-05",
    },
  ];

  const openModal = (type: ModalType, entityData: any = null) => {
    if (type === "event" || type === "dailyEvents" || type === "orgEvents") {
      setSelectedEvent(entityData);
    } else if (type === "user") {
      setSelectedUser(entityData);
    } else if (type === "reportedUsers") {
      setPreferredReportFilter("users");
    } else if (type === "reportedEvents") {
      setPreferredReportFilter("events");
    }
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedEvent(null);
    setSelectedUser(null);
  };

  const handleNewEventSuccess = (event: Event) => {
    toast({
      title: "Etkinlik oluşturuldu",
      description: `"${event.title}" etkinliği başarıyla oluşturuldu.`,
    });
    closeModal();
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Filtreleme işlemi
  const filteredReports = DEMO_REPORTS.filter((report) => {
    // Tür filtreleme
    if (
      reportFilter !== "all" &&
      report.entityType !== reportFilter.slice(0, -1)
    ) {
      return false;
    }

    // Öncelik filtreleme
    if (priorityFilter !== "all" && report.priority !== priorityFilter) {
      return false;
    }

    // Durum filtreleme
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek</Badge>;
      case "medium":
        return <Badge variant="default">Orta</Badge>;
      case "low":
        return <Badge variant="outline">Düşük</Badge>;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Beklemede</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-500">İnceleniyor</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Çözüldü</Badge>;
      case "rejected":
        return <Badge className="bg-gray-500">Reddedildi</Badge>;
    }
  };

  const handleStatusChange = (reportId: number, newStatus: Status) => {
    setAllReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
    toast({
      title: "Rapor durumu güncellendi",
      description: `Rapor durumu ${newStatus} olarak değiştirildi.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Üstteki tarihleme ve filtreleme alanı artık sabit header'da */}

      {/* Hızlı Erişim Butonları */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => openModal("newEvent")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
        <Button variant="outline" onClick={() => openModal("newAnnouncement")}>
          <BellRing className="mr-2 h-4 w-4" />
          Duyuru Yayınla
        </Button>
        <Button variant="outline" onClick={() => openModal("newNews")}>
          <Newspaper className="mr-2 h-4 w-4" />
          Haber Yayınla
        </Button>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">İstatistikler</TabsTrigger>
          <TabsTrigger value="events">Etkinlikler</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
          <TabsTrigger value="messages">Mesajlaşma</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Haftalık Etkinlik Katılımı</CardTitle>
                <CardDescription>
                  Son 7 gündeki etkinliklere katılım ve durum oranları
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <EventParticipationChart categories={selectedCategories} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Bugünkü Etkinlikler</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodaysEvents
                  onEventSelect={(event) => openModal("event", event)}
                  categories={selectedCategories}
                />
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openModal("orgEvents")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Organizasyon Etkinlikleri
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Alt Kısım */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Sol Kolon */}
            <div className="space-y-4">
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>Son Katılımcılar</CardTitle>
                  <CardDescription>
                    Son etkinliklere katılan spor tutkunları
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <RecentParticipants
                    onUserSelect={(user) => openModal("user", user)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal("users")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Tüm Kullanıcıları Yönet
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform İstatistikleri</CardTitle>
                  <CardDescription>
                    Kullanıcı ve katılımcı özeti
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Aktif Kullanıcılar
                        </h3>
                        <p className="text-2xl font-bold">+573</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Son 30 günde +39 yeni üye
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Toplam Katılımcı
                        </h3>
                        <p className="text-2xl font-bold">1,324</p>
                      </div>
                      <Activity className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Son ayın toplam katılımcısı
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Etkinlik Doluluk Oranı
                        </h3>
                        <p className="text-2xl font-bold">%78</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ortalama etkinlik katılım oranı
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal("activeUsers")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Kullanıcı İstatistikleri
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Etkinlik Analizi</CardTitle>
                <CardDescription>
                  Son 12 aydaki etkinlik verileri
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MonthlyEventsChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Kullanıcı Dağılımı</CardTitle>
                <CardDescription>
                  Kategorilere göre kullanıcı dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          {/* ... existing code ... */}
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant={reportFilter === "all" ? "default" : "outline"}
                  onClick={() => setReportFilter("all")}
                >
                  Tüm Raporlar
                </Button>
                <Button
                  variant={reportFilter === "users" ? "default" : "outline"}
                  onClick={() => setReportFilter("users")}
                  className="relative"
                >
                  Kullanıcı Raporları
                  <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {
                      DEMO_REPORTS.filter(
                        (r) => r.entityType === "user" && r.status === "pending"
                      ).length
                    }
                  </Badge>
                </Button>
                <Button
                  variant={reportFilter === "events" ? "default" : "outline"}
                  onClick={() => setReportFilter("events")}
                  className="relative"
                >
                  Etkinlik Raporları
                  <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {
                      DEMO_REPORTS.filter(
                        (r) =>
                          r.entityType === "event" && r.status === "pending"
                      ).length
                    }
                  </Badge>
                </Button>
              </div>

              <div className="flex space-x-2">
                <Select
                  value={priorityFilter}
                  onValueChange={(value) =>
                    setPriorityFilter(value as Priority | "all")
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Öncelik Filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Öncelikler</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="low">Düşük</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as Status | "all")
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Durum Filtrele" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="reviewing">İnceleniyor</SelectItem>
                    <SelectItem value="resolved">Çözüldü</SelectItem>
                    <SelectItem value="rejected">Reddedildi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gelen Raporlar ({filteredReports.length})</CardTitle>
                <CardDescription>
                  İncelemeniz gereken rapor ve bildirimler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Konu</TableHead>
                      <TableHead>Raporlayan</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Öncelik</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.subject}
                        </TableCell>
                        <TableCell>{report.reportedBy}</TableCell>
                        <TableCell>
                          {new Date(report.reportedDate).toLocaleDateString(
                            "tr-TR"
                          )}
                        </TableCell>
                        <TableCell>
                          {report.entityType === "user"
                            ? "Kullanıcı"
                            : "Etkinlik"}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(report.priority)}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openModal(report.entityType, {
                                  id: report.entityId,
                                })
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {report.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(report.id, "reviewing")
                                }
                              >
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              </Button>
                            )}
                            {(report.status === "pending" ||
                              report.status === "reviewing") && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(report.id, "resolved")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusChange(report.id, "rejected")
                                  }
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mesajlaşma</CardTitle>
              <CardDescription>
                Kullanıcılar ve etkinlik katılımcıları ile iletişime geçin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] border rounded-md">
                <div className="w-1/3 border-r">
                  <div className="p-4 border-b">
                    <Input placeholder="Kullanıcı ara..." />
                  </div>
                  <div className="overflow-auto h-[348px]">
                    {demoUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 hover:bg-accent cursor-pointer border-b"
                      >
                        <Avatar className="h-9 w-9 mr-2">
                          <AvatarImage
                            src={`https://i.pravatar.cc/150?img=${index + 10}`}
                          />
                          <AvatarFallback>
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate w-40">
                            Son mesaj içeriği burada gösterilecek...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-2/3 flex flex-col">
                  <div className="p-4 border-b flex items-center">
                    <Avatar className="h-9 w-9 mr-2">
                      <AvatarImage src="https://i.pravatar.cc/150?img=10" />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Ahmet Koç</p>
                      <p className="text-xs text-muted-foreground">Çevrimiçi</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="https://i.pravatar.cc/150?img=10" />
                          <AvatarFallback>AK</AvatarFallback>
                        </Avatar>
                        <div className="bg-accent p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            Merhaba, etkinlik hakkında bilgi alabilir miyim?
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            09:15
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            Tabii ki, hangi etkinlik hakkında bilgi almak
                            istiyorsunuz?
                          </p>
                          <p className="text-xs text-primary-foreground/70 mt-1">
                            09:17
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="https://i.pravatar.cc/150?img=10" />
                          <AvatarFallback>AK</AvatarFallback>
                        </Avatar>
                        <div className="bg-accent p-3 rounded-lg max-w-[80%]">
                          <p className="text-sm">
                            15 Haziran'daki futbol turnuvası için.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            09:18
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input placeholder="Mesajınızı yazın..." />
                      <Button size="icon">
                        <SendHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modallar */}
      <EventDetailModal
        open={
          activeModal === "event" ||
          activeModal === "dailyEvents" ||
          activeModal === "orgEvents"
        }
        onOpenChange={closeModal}
        event={selectedEvent as any}
        onSuccess={closeModal}
      />

      <UserDetailModal
        open={activeModal === "user"}
        onOpenChange={closeModal}
        user={selectedUser as any}
      />

      <NewEventModal
        open={activeModal === "newEvent"}
        onOpenChange={closeModal}
        onSuccess={() => {
          if (selectedEvent) {
            handleNewEventSuccess(selectedEvent);
          } else {
            closeModal();
          }
        }}
      />

      {activeModal === "newNews" && (
        <NewsModal
          open={activeModal === "newNews"}
          onOpenChange={() => closeModal()}
        />
      )}

      {activeModal === "newAnnouncement" && (
        <NewsModal
          open={activeModal === "newAnnouncement"}
          onOpenChange={() => closeModal()}
        />
      )}

      <ReportsModal
        open={
          activeModal === "reportedUsers" || activeModal === "reportedEvents"
        }
        onOpenChange={closeModal}
        preferredFilter={preferredReportFilter}
        reportType={activeModal === "reportedUsers" ? "users" : "events"}
      />
    </div>
  );
}
