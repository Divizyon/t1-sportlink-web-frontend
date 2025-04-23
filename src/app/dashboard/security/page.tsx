"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSecurity } from "@/hooks/useSecurity"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showLogs, setShowLogs] = useState(true)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const {
    securityLogs: logs,
    loading,
    pagination,
    handlePageChange,
    handleFilter
  } = useSecurity()

  const handleSearch = () => {
    handleFilter({
      searchQuery: searchQuery,
      dateFilter: dateFilter,
      status: statusFilter === 'all' ? '' : statusFilter as any
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Shield className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <Lock className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleToggleLogs = () => {
    setShowLogs(!showLogs)
    toast.success(`Loglar ${showLogs ? "gizlendi" : "gösterildi"}`)
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Güvenlik Logları</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleLogs}>
            {showLogs ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Logları Gizle
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Logları Göster
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            placeholder="Admin, IP veya İşlem ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="success">Başarılı</SelectItem>
              <SelectItem value="warning">Uyarı</SelectItem>
              <SelectItem value="error">Hata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Button onClick={handleSearch} className="w-full md:w-auto">
            Filtreleri Uygula
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : showLogs && (
          <>
            <div className="grid gap-4 md:hidden">
              {logs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {log.type === "login" ? "Giriş" : 
                         log.type === "logout" ? "Çıkış" : 
                         log.type === "failed_attempt" ? "Başarısız Giriş" : 
                         log.type === "password_change" ? "Şifre Değişikliği" :
                         log.type === "user_update" ? "Kullanıcı Güncelleme" :
                         log.type === "role_change" ? "Rol Değişikliği" :
                         "İzin Değişikliği"}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge 
                          variant="outline"
                          className={
                            log.status === "success" 
                              ? "bg-green-100 text-green-800 border-green-200"
                              : log.status === "warning" 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                         >
                          {log.status === "success" ? "Başarılı" : 
                           log.status === "warning" ? "Uyarı" : 
                           "Hata"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Admin: {log.admin}</div>
                      <div>IP: {log.ip}</div>
                      <div>Tarih: {log.date} {log.time}</div>
                    </div>
                    <div>
                      <button 
                        onClick={() => setSelectedAction(log.action)}
                        className="text-left hover:underline cursor-pointer text-blue-600"
                      >
                        {truncateText(log.action, 100)}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tip</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.type === "login" ? "Giriş" : 
                         log.type === "logout" ? "Çıkış" : 
                         log.type === "failed_attempt" ? "Başarısız Giriş" : 
                         log.type === "password_change" ? "Şifre Değişikliği" :
                         log.type === "user_update" ? "Kullanıcı Güncelleme" :
                         log.type === "role_change" ? "Rol Değişikliği" :
                         "İzin Değişikliği"}
                      </TableCell>
                      <TableCell>{log.admin}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => setSelectedAction(log.action)}
                          className="text-left hover:underline cursor-pointer text-blue-600"
                        >
                          {truncateText(log.action)}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge 
                            variant="outline"
                            className={
                              log.status === "success" 
                                ? "bg-green-100 text-green-800 border-green-200"
                                : log.status === "warning" 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {log.status === "success" ? "Başarılı" : 
                             log.status === "warning" ? "Uyarı" : 
                             "Hata"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Sayfalama */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Önceki
                </Button>
                <span className="flex items-center">
                  Sayfa {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Sonraki
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İşlem Detayı</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{selectedAction}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 