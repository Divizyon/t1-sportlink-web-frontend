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
import { MonthlyEventsChart } from "@/components/dashboard/analytics/MonthlyEventsChart";
import { TodaysEvents } from "@/components/dashboard/home/TodaysEvents";
import { RecentParticipants } from "@/components/dashboard/home/RecentParticipants";
import { UserTable } from "@/components/dashboard/users/UserTable";
import { EventParticipationChart } from "@/components/dashboard/analytics/EventParticipationChart";
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
import {
  DASHBOARD_TAB_LABELS,
  DASHBOARD_TABS,
  ENTITY_TYPE_LABELS,
  REPORT_PRIORITY_LABELS,
  REPORT_STATUS_LABELS,
  UI_TEXT,
  MODAL_TYPES,
  REPORT_FILTER_LABELS,
  REPORT_FILTERS,
} from "@/constants/dashboard";
import { ReportPriority, ReportStatus, ModalType } from "@/types";
import { REPORTS } from "@/mocks/reports";
import { USERS } from "@/mocks/users";

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

export default function DashboardPage() {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<string>(DASHBOARD_TABS.overview);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preferredReportFilter, setPreferredReportFilter] = useState<string>(
    REPORT_FILTERS.all
  );

  // Raporlar için filtre state'leri
  const [reportFilter, setReportFilter] = useState<"all" | "users" | "events">(
    REPORT_FILTERS.all
  );
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const [allReports, setAllReports] = useState<Report[]>(REPORTS);

  const demoUsers = USERS;

  const openModal = (type: ModalType, entityData: any = null) => {
    if (
      type === MODAL_TYPES.EVENT ||
      type === MODAL_TYPES.DAILY_EVENTS ||
      type === MODAL_TYPES.ORG_EVENTS
    ) {
      setSelectedEvent(entityData);
    } else if (type === MODAL_TYPES.USER) {
      setSelectedUser(entityData);
    } else if (type === MODAL_TYPES.REPORTED_USERS) {
      setPreferredReportFilter(REPORT_FILTERS.users);
    } else if (type === MODAL_TYPES.REPORTED_EVENTS) {
      setPreferredReportFilter(REPORT_FILTERS.events);
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
      title: UI_TEXT.TOAST.EVENT_CREATED.TITLE,
      description: UI_TEXT.TOAST.EVENT_CREATED.DESCRIPTION(event.title),
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
  const filteredReports = REPORTS.filter((report) => {
    // Tür filtreleme
    if (
      reportFilter !== REPORT_FILTERS.all &&
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
        return (
          <Badge variant="destructive">{REPORT_PRIORITY_LABELS.high}</Badge>
        );
      case "medium":
        return <Badge variant="default">{REPORT_PRIORITY_LABELS.medium}</Badge>;
      case "low":
        return <Badge variant="outline">{REPORT_PRIORITY_LABELS.low}</Badge>;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            {REPORT_STATUS_LABELS.pending}
          </Badge>
        );
      case "reviewing":
        return (
          <Badge className="bg-blue-500">
            {REPORT_STATUS_LABELS.reviewing}
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500">
            {REPORT_STATUS_LABELS.resolved}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gray-500">{REPORT_STATUS_LABELS.rejected}</Badge>
        );
    }
  };

  const handleStatusChange = (reportId: number, newStatus: Status) => {
    setAllReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
    toast({
      title: UI_TEXT.TOAST.REPORT_STATUS_UPDATED.TITLE,
      description: UI_TEXT.TOAST.REPORT_STATUS_UPDATED.DESCRIPTION(
        REPORT_STATUS_LABELS[newStatus]
      ),
    });
  };

  return (
    <div className="space-y-4">
      {/* Üstteki tarihleme ve filtreleme alanı artık sabit header'da */}

      {/* Hızlı Erişim Butonları */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => openModal(MODAL_TYPES.NEW_EVENT)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {UI_TEXT.BUTTON_TEXT.NEW_EVENT}
        </Button>
        <Button
          variant="outline"
          onClick={() => openModal(MODAL_TYPES.ANNOUNCEMENT)}
        >
          <BellRing className="mr-2 h-4 w-4" />
          {UI_TEXT.BUTTON_TEXT.PUBLISH_ANNOUNCEMENT}
        </Button>
        <Button variant="outline" onClick={() => openModal(MODAL_TYPES.NEWS)}>
          <Newspaper className="mr-2 h-4 w-4" />
          {UI_TEXT.BUTTON_TEXT.PUBLISH_NEWS}
        </Button>
      </div>

      <Tabs
        defaultValue={DASHBOARD_TABS.overview}
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value={DASHBOARD_TABS.overview}>
            {DASHBOARD_TAB_LABELS.overview}
          </TabsTrigger>
          <TabsTrigger value={DASHBOARD_TABS.analytics}>
            {DASHBOARD_TAB_LABELS.analytics}
          </TabsTrigger>
          <TabsTrigger value={DASHBOARD_TABS.events}>
            {DASHBOARD_TAB_LABELS.events}
          </TabsTrigger>
          <TabsTrigger value={DASHBOARD_TABS.reports}>
            {DASHBOARD_TAB_LABELS.reports}
          </TabsTrigger>
          <TabsTrigger value={DASHBOARD_TABS.messages}>
            {DASHBOARD_TAB_LABELS.messages}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={DASHBOARD_TABS.overview} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>
                  {UI_TEXT.SECTION_TITLES.WEEKLY_PARTICIPATION}
                </CardTitle>
                <CardDescription>
                  {UI_TEXT.SECTION_DESCRIPTIONS.WEEKLY_PARTICIPATION}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <EventParticipationChart categories={selectedCategories} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{UI_TEXT.SECTION_TITLES.TODAY_EVENTS}</CardTitle>
                <CardDescription>
                  {UI_TEXT.SECTION_DESCRIPTIONS.TODAY_EVENTS(
                    new Date().toLocaleDateString("tr-TR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodaysEvents
                  onEventSelect={(event) => openModal(MODAL_TYPES.EVENT, event)}
                  categories={selectedCategories}
                />
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openModal(MODAL_TYPES.ORG_EVENTS)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {UI_TEXT.BUTTON_TEXT.ORG_EVENTS}
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
                  <CardTitle>
                    {UI_TEXT.SECTION_TITLES.RECENT_PARTICIPANTS}
                  </CardTitle>
                  <CardDescription>
                    {UI_TEXT.SECTION_DESCRIPTIONS.RECENT_PARTICIPANTS}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <RecentParticipants
                    onUserSelect={(user) => openModal(MODAL_TYPES.USER, user)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal(MODAL_TYPES.USERS)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {UI_TEXT.BUTTON_TEXT.MANAGE_ALL_USERS}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{UI_TEXT.SECTION_TITLES.PLATFORM_STATS}</CardTitle>
                  <CardDescription>
                    {UI_TEXT.SECTION_DESCRIPTIONS.PLATFORM_STATS}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {UI_TEXT.STATS.ACTIVE_USERS}
                        </h3>
                        <p className="text-2xl font-bold">+573</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {UI_TEXT.STATS.NEW_MEMBERS(39)}
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {UI_TEXT.STATS.TOTAL_PARTICIPANTS}
                        </h3>
                        <p className="text-2xl font-bold">1,324</p>
                      </div>
                      <Activity className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {UI_TEXT.STATS.MONTHLY_PARTICIPANTS}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {UI_TEXT.STATS.EVENT_FILL_RATE}
                        </h3>
                        <p className="text-2xl font-bold">%78</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-muted-foreground opacity-75" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {UI_TEXT.STATS.AVG_PARTICIPATION}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal(MODAL_TYPES.ACTIVE_USERS)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {UI_TEXT.BUTTON_TEXT.USER_STATS}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value={DASHBOARD_TABS.analytics} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{UI_TEXT.SECTION_TITLES.EVENT_ANALYSIS}</CardTitle>
                <CardDescription>
                  {UI_TEXT.SECTION_DESCRIPTIONS.EVENT_ANALYSIS}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MonthlyEventsChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>
                  {UI_TEXT.SECTION_TITLES.USER_DISTRIBUTION}
                </CardTitle>
                <CardDescription>
                  {UI_TEXT.SECTION_DESCRIPTIONS.USER_DISTRIBUTION}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value={DASHBOARD_TABS.events} className="space-y-4">
          {/* ... existing code ... */}
        </TabsContent>
        <TabsContent value={DASHBOARD_TABS.reports} className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant={
                    reportFilter === REPORT_FILTERS.all ? "default" : "outline"
                  }
                  onClick={() => setReportFilter(REPORT_FILTERS.all)}
                >
                  {REPORT_FILTER_LABELS.all}
                </Button>
                <Button
                  variant={
                    reportFilter === REPORT_FILTERS.users
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setReportFilter(REPORT_FILTERS.users)}
                  className="relative"
                >
                  {REPORT_FILTER_LABELS.users}
                  <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {
                      REPORTS.filter(
                        (r) => r.entityType === "user" && r.status === "pending"
                      ).length
                    }
                  </Badge>
                </Button>
                <Button
                  variant={
                    reportFilter === REPORT_FILTERS.events
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setReportFilter(REPORT_FILTERS.events)}
                  className="relative"
                >
                  {REPORT_FILTER_LABELS.events}
                  <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                    {
                      REPORTS.filter(
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
                    <SelectItem value="high">
                      {REPORT_PRIORITY_LABELS.high}
                    </SelectItem>
                    <SelectItem value="medium">
                      {REPORT_PRIORITY_LABELS.medium}
                    </SelectItem>
                    <SelectItem value="low">
                      {REPORT_PRIORITY_LABELS.low}
                    </SelectItem>
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
                    <SelectItem value="pending">
                      {REPORT_STATUS_LABELS.pending}
                    </SelectItem>
                    <SelectItem value="reviewing">
                      {REPORT_STATUS_LABELS.reviewing}
                    </SelectItem>
                    <SelectItem value="resolved">
                      {REPORT_STATUS_LABELS.resolved}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {REPORT_STATUS_LABELS.rejected}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {UI_TEXT.SECTION_TITLES.INCOMING_REPORTS} (
                  {filteredReports.length})
                </CardTitle>
                <CardDescription>
                  {UI_TEXT.SECTION_DESCRIPTIONS.INCOMING_REPORTS}
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
                          {ENTITY_TYPE_LABELS[report.entityType]}
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
        <TabsContent value={DASHBOARD_TABS.messages} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{UI_TEXT.SECTION_TITLES.MESSAGING}</CardTitle>
              <CardDescription>
                {UI_TEXT.SECTION_DESCRIPTIONS.MESSAGING}
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
          activeModal === MODAL_TYPES.EVENT ||
          activeModal === MODAL_TYPES.DAILY_EVENTS ||
          activeModal === MODAL_TYPES.ORG_EVENTS
        }
        onOpenChange={closeModal}
        event={selectedEvent as any}
        onSuccess={closeModal}
      />

      <UserDetailModal
        open={activeModal === MODAL_TYPES.USER}
        onOpenChange={closeModal}
        user={selectedUser as any}
      />

      <NewEventModal
        open={activeModal === MODAL_TYPES.NEW_EVENT}
        onOpenChange={closeModal}
        onSuccess={() => {
          if (selectedEvent) {
            handleNewEventSuccess(selectedEvent);
          } else {
            closeModal();
          }
        }}
      />

      {activeModal === MODAL_TYPES.NEWS && (
        <NewsModal
          open={activeModal === MODAL_TYPES.NEWS}
          onOpenChange={() => closeModal()}
        />
      )}

      {activeModal === MODAL_TYPES.ANNOUNCEMENT && (
        <NewsModal
          open={activeModal === MODAL_TYPES.ANNOUNCEMENT}
          onOpenChange={() => closeModal()}
        />
      )}

      <ReportsModal
        open={
          activeModal === MODAL_TYPES.REPORTED_USERS ||
          activeModal === MODAL_TYPES.REPORTED_EVENTS
        }
        onOpenChange={closeModal}
        preferredFilter={preferredReportFilter}
        reportType={
          activeModal === MODAL_TYPES.REPORTED_USERS ? "users" : "events"
        }
      />
    </div>
  );
}
