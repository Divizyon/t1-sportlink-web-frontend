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
