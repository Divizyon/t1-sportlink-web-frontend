"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Flag, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"
import { UserNav } from "@/components/nav/user-nav"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

type Priority = "high" | "medium" | "low"
type Status = "pending" | "reviewing" | "resolved" | "rejected"

interface Report {
  id: string
  subject: string
  description: string
  reportedBy: string
  reportedDate: string
  priority: Priority
  status: Status
  entityId: string
  entityType: "user" | "event"
}

// Demo verileri
const DEMO_REPORTS: Report[] = [
  {
    id: "1",
    subject: "Uygunsuz Davranış",
    description: "Katılımcı diğer kullanıcılara karşı uygunsuz davranışlarda bulundu",
    reportedBy: "Ahmet Yılmaz",
    reportedDate: "2023-08-25",
    priority: "high",
    status: "pending",
    entityId: "user123",
    entityType: "user"
  },
  {
    id: "2",
    subject: "Yanıltıcı Etkinlik Bilgisi",
    description: "Etkinlik konumu yanlış belirtilmiş",
    reportedBy: "Mehmet Demir",
    reportedDate: "2023-08-24",
    priority: "medium",
    status: "reviewing",
    entityId: "event456",
    entityType: "event"
  },
  {
    id: "3",
    subject: "Sahte Etkinlik",
    description: "Bu etkinlik bir dolandırıcılık girişimi olabilir",
    reportedBy: "Zeynep Kaya",
    reportedDate: "2023-08-23",
    priority: "high",
    status: "pending",
    entityId: "event789",
    entityType: "event"
  },
  {
    id: "4",
    subject: "Yaş Sınırı İhlali",
    description: "18 yaş altı katılımcılar kabul edildi",
    reportedBy: "Cemil Özkan",
    reportedDate: "2023-08-22",
    priority: "high",
    status: "pending",
    entityId: "event101",
    entityType: "event"
  },
  {
    id: "5",
    subject: "Taciz Raporu",
    description: "Kullanıcı mesajlarda taciz edici içerikler gönderdi",
    reportedBy: "Gül Akın",
    reportedDate: "2023-08-21",
    priority: "high",
    status: "reviewing",
    entityId: "user456",
    entityType: "user"
  },
  {
    id: "6",
    subject: "Uygunsuz Profil Resmi",
    description: "Kullanıcının profil fotoğrafı uygunsuz içerik barındırıyor",
    reportedBy: "İbrahim Tatlıses",
    reportedDate: "2023-08-20",
    priority: "medium",
    status: "resolved",
    entityId: "user789",
    entityType: "user"
  },
  {
    id: "7",
    subject: "Gerçekleşmeyen Etkinlik",
    description: "Etkinlik iptal edildi fakat bildirim yapılmadı",
    reportedBy: "Deniz Tuna",
    reportedDate: "2023-08-19",
    priority: "low",
    status: "rejected",
    entityId: "event111",
    entityType: "event"
  },
  {
    id: "8",
    subject: "Sahte Konum",
    description: "Organizatör gerçekleştiği konumu yanlış belirtti",
    reportedBy: "Pınar Deniz",
    reportedDate: "2023-08-18",
    priority: "medium",
    status: "pending",
    entityId: "event112",
    entityType: "event"
  }
]

export default function ReportsPage() {
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "users" | "events">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")

  // Filtreleme işlemi
  const filteredReports = DEMO_REPORTS.filter(report => {
    // Tür filtreleme
    if (filter !== "all" && report.entityType !== filter.slice(0, -1)) {
      return false
    }
    
    // Öncelik filtreleme
    if (priorityFilter !== "all" && report.priority !== priorityFilter) {
      return false
    }
    
    // Durum filtreleme
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false
    }
    
    return true
  })

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Yüksek</Badge>
      case "medium":
        return <Badge variant="default">Orta</Badge>
      case "low":
        return <Badge variant="outline">Düşük</Badge>
    }
  }

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Beklemede</Badge>
      case "reviewing":
        return <Badge className="bg-blue-500">İnceleniyor</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Çözüldü</Badge>
      case "rejected":
        return <Badge className="bg-gray-500">Reddedildi</Badge>
    }
  }

  const handleStatusChange = (reportId: string, newStatus: Status) => {
    // Normalde API'ye istek atılacak
    toast({
      title: "Durum Güncellendi",
      description: `Rapor durumu ${newStatus} olarak güncellendi`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Sport Link</h1>
          <div className="ml-auto flex items-center">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Anasayfa</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setFilter(value as "all" | "users" | "events")}>
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
              <TabsTrigger value="users" className="relative">
                Kullanıcı Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {DEMO_REPORTS.filter(r => r.entityType === "user" && r.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="events" className="relative">
                Etkinlik Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {DEMO_REPORTS.filter(r => r.entityType === "event" && r.status === "pending").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Select 
                value={priorityFilter} 
                onValueChange={(value) => setPriorityFilter(value as Priority | "all")}
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
                onValueChange={(value) => setStatusFilter(value as Status | "all")}
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
                      <TableCell className="font-medium">{report.subject}</TableCell>
                      <TableCell>{report.reportedBy}</TableCell>
                      <TableCell>{new Date(report.reportedDate).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>
                        {report.entityType === "user" ? "Kullanıcı" : "Etkinlik"}
                      </TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <Link 
                              href={`/dashboard/${report.entityType === "user" ? "users" : "events"}/${report.entityId}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {report.status === "pending" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(report.id, "reviewing")}
                            >
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            </Button>
                          )}
                          {(report.status === "pending" || report.status === "reviewing") && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStatusChange(report.id, "resolved")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStatusChange(report.id, "rejected")}
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
        </Tabs>
      </div>
    </div>
  )
} 