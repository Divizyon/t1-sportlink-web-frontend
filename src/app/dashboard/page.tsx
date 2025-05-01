"use client";

import { useState, useEffect } from "react";
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
import { RecentReports } from "@/components/dashboard/home/RecentReports";
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
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferredReportFilter, setPreferredReportFilter] = useState<string>(
    REPORT_FILTERS.all
  );

  // Raporlar için filtre state'leri
  const [reportFilter, setReportFilter] = useState<"all" | "users" | "events">(
    REPORT_FILTERS.all
  );
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  // Create states for API data
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);

  // Default reports and users for fallback
  const defaultReports: Report[] = [
    {
      id: 1,
      subject: "Inappropriate Content",
      description: "This user posted inappropriate content in their profile",
      reportedBy: "Ahmet Yılmaz",
      reportedDate: "2023-05-15",
      entityType: "user",
      entityId: 123,
      priority: "high",
      status: "pending",
    },
    {
      id: 2,
      subject: "Misleading Event Info",
      description: "Event details don't match actual event",
      reportedBy: "Mehmet Demir",
      reportedDate: "2023-05-12",
      entityType: "event",
      entityId: 456,
      priority: "medium",
      status: "reviewing",
    },
  ];
  const defaultUsers = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      role: "antrenor",
      status: "active",
      joinDate: "2023-01-15",
      avatar: "/avatars/01.png",
      registeredDate: "2023-01-10",
      lastActive: "2023-07-15",
    },
    // Add a few more default users if needed
  ];

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/reports", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session-based auth
        });

        // Immediately fall back to mock data if we get a 401
        if (response.status === 401) {
          console.warn(
            "Authentication failed (401 Unauthorized), using mock data"
          );
          setAllReports(defaultReports);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data?.reports)) {
          // Map backend data to frontend format
          const mappedReports: Report[] = data.data.reports.map(
            (report: any) => ({
              id: report.id || Math.floor(Math.random() * 1000),
              subject: report.title || report.subject || "No subject",
              description: report.description || "No description",
              reportedBy: report.reporter_name || "Unknown User",
              reportedDate: new Date(report.created_at)
                .toISOString()
                .split("T")[0],
              entityType: report.entity_type === "USER" ? "user" : "event",
              entityId: report.entity_id || 0,
              priority: mapReportPriority(report.priority),
              status: mapReportStatus(report.status),
            })
          );

          setAllReports(mappedReports);
        } else {
          console.warn("API returned invalid format, using default reports");
          setAllReports(defaultReports);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setAllReports(defaultReports); // Fallback to default reports
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch users from API - used in the dashboard
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/details",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session-based auth
          }
        );

        // Immediately fall back to mock data if we get a 401
        if (response.status === 401) {
          console.warn(
            "Authentication failed (401 Unauthorized), using mock data"
          );
          setDemoUsers(defaultUsers);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data?.users)) {
          // Map backend user data to frontend format
          const mappedUsers: User[] = data.data.users.map((user: any) => ({
            id: user.id || Math.floor(Math.random() * 1000),
            name:
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              "Unknown Name",
            email: user.email || "no-email@example.com",
            role: user.role || "user",
            status: user.active ? "active" : "inactive",
            joinDate: new Date(user.created_at).toISOString().split("T")[0],
            avatar: user.avatar_url || "/avatars/default.png",
            lastActive:
              user.last_login_at || new Date().toISOString().split("T")[0],
          }));

          setDemoUsers(mappedUsers);
        } else {
          console.warn("API returned invalid format, using default users");
          setDemoUsers(defaultUsers);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setDemoUsers(defaultUsers); // Fallback to default users
      }
    };

    fetchReports();
    fetchUsers();
  }, []);

  // Mapping functions for backend data
  const mapReportPriority = (backendPriority?: string): Priority => {
    if (!backendPriority) return "medium";

    const priorityMap: Record<string, Priority> = {
      HIGH: "high",
      MEDIUM: "medium",
      LOW: "low",
    };

    return priorityMap[backendPriority.toUpperCase()] || "medium";
  };

  const mapReportStatus = (backendStatus?: string): Status => {
    if (!backendStatus) return "pending";

    const statusMap: Record<string, Status> = {
      PENDING: "pending",
      REVIEWING: "reviewing",
      IN_REVIEW: "reviewing",
      RESOLVED: "resolved",
      REJECTED: "rejected",
    };

    return statusMap[backendStatus.toUpperCase()] || "pending";
  };

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
  const filteredReports = allReports.filter((report) => {
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
          İçerik Yayınla
        </Button>
      </div>

      <Tabs
        defaultValue={DASHBOARD_TABS.overview}
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-2 w-[300px]">
          <TabsTrigger value={DASHBOARD_TABS.overview}>
            {DASHBOARD_TAB_LABELS.overview}
          </TabsTrigger>
          <TabsTrigger value={DASHBOARD_TABS.analytics}>
            {DASHBOARD_TAB_LABELS.analytics}
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
                  onUserSelect={(user) => openModal(MODAL_TYPES.USER, user)}
                  categories={selectedCategories}
                />
              </CardContent>
            </Card>
          </div>

          {/* Alt Kısım */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols">
            {/* Sol Kolon */}
            <div className="space-y-4">
              <Card className="h-[500px]">
                <CardHeader>
                  <CardTitle>Son Raporlar</CardTitle>
                  <CardDescription>
                    Son eklenen 5 rapor listelenmektedir
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[380px] overflow-y-auto">
                  <RecentReports
                    onReportSelect={(report) => openModal(MODAL_TYPES.REPORT, report)}
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/reports">
                      <Flag className="mr-2 h-4 w-4" />
                      Tüm Raporları Yönet
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-4">
              {/* Platform İstatistikleri Card'ı */}
              {/*
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
                    </Card>
                  </div>
              */}
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
