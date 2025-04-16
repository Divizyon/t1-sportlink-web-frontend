"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, FileText, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

interface Report {
  id: string
  title: string
  type: "injury" | "facility" | "behavior" | "other"
  reportDate: string
  submittedBy: string
  status: "pending" | "reviewed" | "closed"
  description: string
  urgency: "low" | "medium" | "high"
}

interface ReportsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Örnek rapor verileri
const mockReports: Report[] = [
  {
    id: "REP-001",
    title: "Futbol Sahası Hasarı",
    type: "facility",
    reportDate: "2023-08-15",
    submittedBy: "Ahmet Yılmaz",
    status: "pending",
    description: "Futbol sahasının kuzey tarafında çim hasarı tespit edildi. Acil bakım gerekiyor.",
    urgency: "high"
  },
  {
    id: "REP-002",
    title: "Öğrenci Davranış Raporu",
    type: "behavior",
    reportDate: "2023-08-10",
    submittedBy: "Mehmet Demir",
    status: "pending",
    description: "Basketbol turnuvası sırasında iki öğrenci arasında tartışma yaşandı. Duruma müdahale edildi.",
    urgency: "medium"
  },
  {
    id: "REP-003",
    title: "Yüzme Havuzu Ekipman Eksikliği",
    type: "facility",
    reportDate: "2023-08-05",
    submittedBy: "Ayşe Kaya",
    status: "pending",
    description: "Yüzme havuzunda can simidi ve ilk yardım ekipmanları eksik. Güvenlik açısından tamamlanması gerekiyor.",
    urgency: "high"
  },
  {
    id: "REP-004",
    title: "Voleybol Turnuvası Yaralanması",
    type: "injury",
    reportDate: "2023-07-28",
    submittedBy: "Fatma Şahin",
    status: "pending",
    description: "Voleybol turnuvası sırasında bir öğrenci ayak bileğini burktu. İlk müdahale yapıldı ve aileye bilgi verildi.",
    urgency: "medium"
  },
  {
    id: "REP-005",
    title: "Fitness Salonu Ekipman Arızası",
    type: "facility",
    reportDate: "2023-07-25",
    submittedBy: "Ali Özkan",
    status: "pending",
    description: "Fitness salonundaki koşu bandı arızalandı. Tamir edilmesi gerekiyor.",
    urgency: "low"
  },
  {
    id: "REP-006",
    title: "Antrenör Davranış Şikayeti",
    type: "behavior",
    reportDate: "2023-07-20",
    submittedBy: "Zeynep Yıldız",
    status: "pending",
    description: "Futbol antrenörünün öğrencilere karşı sert davranışları hakkında veli şikayeti alındı.",
    urgency: "high"
  },
  {
    id: "REP-007",
    title: "Tenis Kortu Bakım İhtiyacı",
    type: "facility",
    reportDate: "2023-07-15",
    submittedBy: "Murat Aksoy",
    status: "pending",
    description: "Tenis kortlarının zemini yıpranmış durumda. Yenileme çalışması gerekiyor.",
    urgency: "medium"
  }
]

export function ReportsModal({ open, onOpenChange }: ReportsModalProps) {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  // Arama ve filtreleme
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    return matchesSearch && report.status === activeTab
  })

  // Rapor durum güncelleme
  const handleUpdateStatus = (reportId: string, newStatus: "reviewed" | "closed") => {
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    )

    setReports(updatedReports)
    
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus })
    }

    toast.success(`Rapor durumu "${newStatus === "reviewed" ? "İncelendi" : "Kapatıldı"}" olarak güncellendi.`)
  }

  // Rapor durum badge'i render etme
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Beklemede</Badge>
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">İncelendi</Badge>
      case "closed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Kapatıldı</Badge>
      default:
        return null
    }
  }

  // Aciliyet badge'i render etme
  const renderUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Düşük</Badge>
      case "medium":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Orta</Badge>
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Yüksek</Badge>
      default:
        return null
    }
  }

  // Rapor türü badge'i render etme
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "injury":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Yaralanma</Badge>
      case "facility":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Tesis</Badge>
      case "behavior":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Davranış</Badge>
      case "other":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Diğer</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Raporlar</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sol panel: Raporlar listesi */}
          <div className="w-1/2 pr-4 flex flex-col overflow-hidden">
            <div className="mb-4 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Raporlarda ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mb-2">
                <TabsTrigger value="all">Tümü ({reports.length})</TabsTrigger>
                <TabsTrigger value="pending">
                  Beklemede ({reports.filter(r => r.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="reviewed">
                  İncelendi ({reports.filter(r => r.status === "reviewed").length})
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Kapatıldı ({reports.filter(r => r.status === "closed").length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="flex-1 overflow-y-auto space-y-2 mt-0">
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => (
                    <div
                      key={report.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-slate-50 ${
                        selectedReport?.id === report.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.submittedBy} • {report.reportDate}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {renderStatusBadge(report.status)}
                            {renderTypeBadge(report.type)}
                            {renderUrgencyBadge(report.urgency)}
                          </div>
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Arama kriterlerinize uygun rapor bulunamadı.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sağ panel: Seçili rapor detayı */}
          <div className="w-1/2 pl-4 border-l h-full overflow-y-auto">
            {selectedReport ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <span>Rapor No: {selectedReport.id}</span>
                    <span>•</span>
                    <span>Tarih: {selectedReport.reportDate}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Durum</div>
                  <div>{renderStatusBadge(selectedReport.status)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Aciliyet</div>
                  <div>{renderUrgencyBadge(selectedReport.urgency)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Rapor Türü</div>
                  <div>{renderTypeBadge(selectedReport.type)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Gönderen</div>
                  <div className="text-sm">{selectedReport.submittedBy}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Açıklama</div>
                  <div className="text-sm p-3 border rounded-md bg-slate-50">
                    {selectedReport.description}
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  {selectedReport.status === "pending" && (
                    <>
                      <Button
                        className="flex-1"
                        onClick={() => handleUpdateStatus(selectedReport.id, "reviewed")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        İncelendi Olarak İşaretle
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(selectedReport.id, "closed")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Kapat
                      </Button>
                    </>
                  )}
                  {selectedReport.status === "reviewed" && (
                    <Button
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedReport.id, "closed")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Raporu Kapat
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p>Detayları görüntülemek için bir rapor seçin</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 