"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Flag, Search, Calendar, Clock, MapPin, Users, 
  User, ShieldAlert, Shield, CheckCircle, XCircle, 
  Filter, ArrowUpDown
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EventReport {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  reporterId: string
  reporterName: string
  reporterAvatar?: string
  reason: string
  details?: string
  status: "pending" | "resolved" | "dismissed"
  severity: "low" | "medium" | "high"
  createdAt: string
}

interface UserReport {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  userEmail: string
  reporterId: string
  reporterName: string
  reporterAvatar?: string
  reason: string
  details?: string
  status: "pending" | "resolved" | "dismissed"
  severity: "low" | "medium" | "high"
  createdAt: string
}

type Report = EventReport | UserReport

interface ReportsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType?: "events" | "users"
  preferredFilter?: string | null
}

export function ReportsModal({ 
  open, 
  onOpenChange, 
  reportType = "events", 
  preferredFilter = null 
}: ReportsModalProps) {
  const [activeTab, setActiveTab] = useState<string>(reportType)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>(preferredFilter || "all")
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [eventReports, setEventReports] = useState<EventReport[]>([])
  const [userReports, setUserReports] = useState<UserReport[]>([])
  
  useEffect(() => {
    // Simüle edilmiş API çağrısı
    setLoading(true)
    
    setTimeout(() => {
      const mockEventReports: EventReport[] = [
        {
          id: "er-1",
          eventId: "evt-1",
          eventTitle: "Sabah Koşusu",
          eventDate: "12.05.2023",
          reporterId: "usr-5",
          reporterName: "Mehmet Demir",
          reporterAvatar: "/avatars/02.png",
          reason: "Uygunsuz Konum",
          details: "Belirtilen konum kapalı bir alan ve koşu için uygun değil.",
          status: "pending",
          severity: "medium",
          createdAt: "10.05.2023"
        },
        {
          id: "er-2",
          eventId: "evt-2",
          eventTitle: "Yoga Dersi",
          eventDate: "15.05.2023",
          reporterId: "usr-6",
          reporterName: "Ayşe Yılmaz",
          reporterAvatar: "/avatars/03.png",
          reason: "Yanıltıcı Bilgi",
          details: "Etkinlik açıklaması gerçek içerikle uyuşmuyor.",
          status: "pending",
          severity: "high",
          createdAt: "08.05.2023"
        },
        {
          id: "er-3",
          eventId: "evt-3",
          eventTitle: "Basketbol Turnuvası",
          eventDate: "20.05.2023",
          reporterId: "usr-7",
          reporterName: "Ali Kaya",
          reporterAvatar: "/avatars/04.png",
          reason: "Yaş Sınırı Belirtilmemiş",
          details: "Etkinlikte yaş sınırı belirtilmemiş ve çok küçük katılımcılar var.",
          status: "resolved",
          severity: "low",
          createdAt: "05.05.2023"
        },
        {
          id: "er-4",
          eventId: "evt-4",
          eventTitle: "Futbol Maçı",
          eventDate: "25.05.2023",
          reporterId: "usr-8",
          reporterName: "Zeynep Çelik",
          reporterAvatar: "/avatars/05.png",
          reason: "Kapasite Aşımı",
          details: "Etkinliğe kapasiteden fazla kişi alınıyor.",
          status: "dismissed",
          severity: "medium",
          createdAt: "03.05.2023"
        },
        {
          id: "er-5",
          eventId: "evt-5",
          eventTitle: "Tenis Dersi",
          eventDate: "18.05.2023",
          reporterId: "usr-9",
          reporterName: "Emre Şahin",
          reporterAvatar: "/avatars/06.png",
          reason: "Fiyat Uyuşmazlığı",
          details: "Ücretli olduğu belirtilmemiş.",
          status: "pending",
          severity: "high",
          createdAt: "01.05.2023"
        }
      ]
      
      const mockUserReports: UserReport[] = [
        {
          id: "ur-1",
          userId: "usr-10",
          userName: "Can Yılmaz",
          userAvatar: "/avatars/07.png",
          userEmail: "can@example.com",
          reporterId: "usr-5",
          reporterName: "Mehmet Demir",
          reporterAvatar: "/avatars/02.png",
          reason: "Taciz Edici Davranış",
          details: "Kullanıcı etkinliklerde rahatsız edici davranışlarda bulunuyor.",
          status: "pending",
          severity: "high",
          createdAt: "10.05.2023"
        },
        {
          id: "ur-2",
          userId: "usr-11",
          userName: "Deniz Kara",
          userAvatar: "/avatars/08.png",
          userEmail: "deniz@example.com",
          reporterId: "usr-6",
          reporterName: "Ayşe Yılmaz",
          reporterAvatar: "/avatars/03.png",
          reason: "Sahte Profil",
          details: "Profil bilgileri gerçek değil.",
          status: "pending",
          severity: "medium",
          createdAt: "08.05.2023"
        },
        {
          id: "ur-3",
          userId: "usr-12",
          userName: "Selin Demir",
          userAvatar: "/avatars/09.png",
          userEmail: "selin@example.com",
          reporterId: "usr-7",
          reporterName: "Ali Kaya",
          reporterAvatar: "/avatars/04.png",
          reason: "Spam",
          details: "Kullanıcı sürekli spam içerikli mesajlar gönderiyor.",
          status: "resolved",
          severity: "low",
          createdAt: "05.05.2023"
        },
        {
          id: "ur-4",
          userId: "usr-13",
          userName: "Mert Öz",
          userAvatar: "/avatars/10.png",
          userEmail: "mert@example.com",
          reporterId: "usr-8",
          reporterName: "Zeynep Çelik",
          reporterAvatar: "/avatars/05.png",
          reason: "Uygunsuz Profil Resmi",
          details: "Kullanıcının profil resmi uygunsuz içerik barındırıyor.",
          status: "dismissed",
          severity: "medium",
          createdAt: "03.05.2023"
        },
        {
          id: "ur-5",
          userId: "usr-14",
          userName: "Ece Yıldız",
          userAvatar: "/avatars/11.png",
          userEmail: "ece@example.com",
          reporterId: "usr-9",
          reporterName: "Emre Şahin",
          reporterAvatar: "/avatars/06.png",
          reason: "Yaş Sınırı İhlali",
          details: "Kullanıcı yaşını yanlış belirtmiş olabilir.",
          status: "pending",
          severity: "high",
          createdAt: "01.05.2023"
        }
      ]
      
      setEventReports(mockEventReports)
      setUserReports(mockUserReports)
      setLoading(false)
    }, 1000)
  }, [])
  
  useEffect(() => {
    if (open && preferredFilter) {
      setSeverityFilter(preferredFilter)
    }
  }, [open, preferredFilter])
  
  const handleMarkAsResolved = (id: string, type: "events" | "users") => {
    if (type === "events") {
      setEventReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, status: "resolved" } : report
        )
      )
    } else {
      setUserReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, status: "resolved" } : report
        )
      )
    }
    
    toast.success("Rapor çözüldü olarak işaretlendi")
    setSelectedReports(prev => prev.filter(reportId => reportId !== id))
  }
  
  const handleDismiss = (id: string, type: "events" | "users") => {
    if (type === "events") {
      setEventReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, status: "dismissed" } : report
        )
      )
    } else {
      setUserReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, status: "dismissed" } : report
        )
      )
    }
    
    toast.success("Rapor reddedildi")
    setSelectedReports(prev => prev.filter(reportId => reportId !== id))
  }
  
  const handleBulkAction = (action: "resolve" | "dismiss") => {
    if (selectedReports.length === 0) {
      toast.error("Lütfen en az bir rapor seçin")
      return
    }
    
    // Seçilen raporları işle
    if (activeTab === "events") {
      setEventReports(prev => 
        prev.map(report => 
          selectedReports.includes(report.id) 
            ? { ...report, status: action === "resolve" ? "resolved" : "dismissed" } 
            : report
        )
      )
    } else {
      setUserReports(prev => 
        prev.map(report => 
          selectedReports.includes(report.id) 
            ? { ...report, status: action === "resolve" ? "resolved" : "dismissed" } 
            : report
        )
      )
    }
    
    toast.success(
      action === "resolve" 
        ? `${selectedReports.length} rapor çözüldü olarak işaretlendi` 
        : `${selectedReports.length} rapor reddedildi`
    )
    setSelectedReports([])
  }
  
  const handleSelectAll = (reports: Report[]) => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(reports.map(report => report.id))
    }
  }
  
  const handleSelectReport = (id: string) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(prev => prev.filter(reportId => reportId !== id))
    } else {
      setSelectedReports(prev => [...prev, id])
    }
  }
  
  const filterReports = (reports: Report[]) => {
    return reports.filter(report => {
      const matchesSearch = searchQuery === "" || 
        (report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('eventTitle' in report && report.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('userName' in report && report.userName.toLowerCase().includes(searchQuery.toLowerCase())))
      
      const matchesStatus = statusFilter === "all" || report.status === statusFilter
      const matchesSeverity = severityFilter === "all" || report.severity === severityFilter
      
      return matchesSearch && matchesStatus && matchesSeverity
    })
  }
  
  const filteredEventReports = filterReports(eventReports)
  const filteredUserReports = filterReports(userReports)
  
  const getSeverityBadge = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Düşük</Badge>
      case "medium":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Orta</Badge>
      case "high":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Yüksek</Badge>
    }
  }
  
  const getStatusBadge = (status: "pending" | "resolved" | "dismissed") => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Beklemede</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Çözüldü</Badge>
      case "dismissed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Reddedildi</Badge>
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Raporlar</DialogTitle>
            <div className="flex gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                {eventReports.filter(r => r.status === "pending").length +
                 userReports.filter(r => r.status === "pending").length} Bekleyen
              </Badge>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                {eventReports.filter(r => r.severity === "high" && r.status === "pending").length +
                 userReports.filter(r => r.severity === "high" && r.status === "pending").length} Yüksek Öncelikli
              </Badge>
            </div>
          </div>
          <DialogDescription>
            Kullanıcılar tarafından bildirilen etkinlik ve kullanıcı raporlarını yönetin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="events" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Etkinlik Raporları</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Kullanıcı Raporları</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rapor ara..."
                    className="pl-8 w-[180px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5" />
                      <span>{statusFilter === "all" ? "Tüm Durumlar" : 
                        statusFilter === "pending" ? "Beklemede" : 
                        statusFilter === "resolved" ? "Çözüldü" : "Reddedildi"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="resolved">Çözüldü</SelectItem>
                    <SelectItem value="dismissed">Reddedildi</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>{severityFilter === "all" ? "Tüm Öncelikler" : 
                        severityFilter === "low" ? "Düşük" : 
                        severityFilter === "medium" ? "Orta" : "Yüksek"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Öncelikler</SelectItem>
                    <SelectItem value="low">Düşük</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="high">Yüksek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Toplu işlem düğmeleri */}
            {selectedReports.length > 0 && (
              <div className="flex items-center justify-between py-2 px-2 border rounded-md mt-2 bg-muted/30">
                <div className="text-sm">
                  {selectedReports.length} rapor seçildi
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("dismiss")}
                    className="h-8"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Toplu Reddet
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("resolve")}
                    className="h-8"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Toplu Çöz
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden mt-2">
              <TabsContent value="events" className="flex-1 h-[calc(100%-40px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="mt-2 text-sm text-muted-foreground">Raporlar yükleniyor...</span>
                    </div>
                  </div>
                ) : filteredEventReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Flag className="h-12 w-12 mb-4 opacity-20" />
                    <p>Filtrelerinize uygun rapor bulunamadı</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                        setSeverityFilter("all")
                      }}
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center px-2 py-1.5 text-sm text-muted-foreground border-b">
                      <div className="w-6 mr-2">
                        <Checkbox 
                          checked={selectedReports.length === filteredEventReports.length && filteredEventReports.length > 0} 
                          onCheckedChange={() => handleSelectAll(filteredEventReports)}
                        />
                      </div>
                      <div className="w-[30%] flex items-center gap-1">
                        <span>Etkinlik</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                      <div className="w-[15%] flex items-center gap-1">
                        <span>Tarih</span>
                      </div>
                      <div className="w-[20%]">Şikayet Eden</div>
                      <div className="w-[15%]">Öncelik</div>
                      <div className="w-[15%]">Durum</div>
                      <div className="w-[5%]"></div>
                    </div>
                    
                    <ScrollArea className="h-[400px]">
                      {filteredEventReports.map((report) => (
                        <div 
                          key={report.id} 
                          className="flex items-center px-2 py-2 hover:bg-muted/50 rounded-md"
                        >
                          <div className="w-6 mr-2">
                            <Checkbox 
                              checked={selectedReports.includes(report.id)} 
                              onCheckedChange={() => handleSelectReport(report.id)}
                            />
                          </div>
                          <div className="w-[30%] truncate font-medium">{report.eventTitle}</div>
                          <div className="w-[15%] text-sm text-muted-foreground">{report.eventDate}</div>
                          <div className="w-[20%] flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={report.reporterAvatar} />
                              <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate">{report.reporterName}</span>
                          </div>
                          <div className="w-[15%]">{getSeverityBadge(report.severity)}</div>
                          <div className="w-[15%]">{getStatusBadge(report.status)}</div>
                          <div className="w-[5%] flex justify-end">
                            {report.status === "pending" && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkAsResolved(report.id, "events")}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleDismiss(report.id, "events")}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="users" className="flex-1 h-[calc(100%-40px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="mt-2 text-sm text-muted-foreground">Raporlar yükleniyor...</span>
                    </div>
                  </div>
                ) : filteredUserReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Shield className="h-12 w-12 mb-4 opacity-20" />
                    <p>Filtrelerinize uygun rapor bulunamadı</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                        setSeverityFilter("all")
                      }}
                    >
                      Filtreleri Temizle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center px-2 py-1.5 text-sm text-muted-foreground border-b">
                      <div className="w-6 mr-2">
                        <Checkbox 
                          checked={selectedReports.length === filteredUserReports.length && filteredUserReports.length > 0} 
                          onCheckedChange={() => handleSelectAll(filteredUserReports)}
                        />
                      </div>
                      <div className="w-[30%] flex items-center gap-1">
                        <span>Kullanıcı</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                      <div className="w-[20%]">Şikayet Sebebi</div>
                      <div className="w-[15%]">Şikayet Eden</div>
                      <div className="w-[15%]">Öncelik</div>
                      <div className="w-[15%]">Durum</div>
                      <div className="w-[5%]"></div>
                    </div>
                    
                    <ScrollArea className="h-[400px]">
                      {filteredUserReports.map((report) => (
                        <div 
                          key={report.id} 
                          className="flex items-center px-2 py-2 hover:bg-muted/50 rounded-md"
                        >
                          <div className="w-6 mr-2">
                            <Checkbox 
                              checked={selectedReports.includes(report.id)} 
                              onCheckedChange={() => handleSelectReport(report.id)}
                            />
                          </div>
                          <div className="w-[30%] flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={report.userAvatar} />
                              <AvatarFallback>{report.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="truncate">
                              <div className="font-medium">{report.userName}</div>
                              <div className="text-xs text-muted-foreground">{report.userEmail}</div>
                            </div>
                          </div>
                          <div className="w-[20%] text-sm truncate">{report.reason}</div>
                          <div className="w-[15%] flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={report.reporterAvatar} />
                              <AvatarFallback>{report.reporterName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate">{report.reporterName}</span>
                          </div>
                          <div className="w-[15%]">{getSeverityBadge(report.severity)}</div>
                          <div className="w-[15%]">{getStatusBadge(report.status)}</div>
                          <div className="w-[5%] flex justify-end">
                            {report.status === "pending" && (
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleMarkAsResolved(report.id, "users")}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => handleDismiss(report.id, "users")}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 