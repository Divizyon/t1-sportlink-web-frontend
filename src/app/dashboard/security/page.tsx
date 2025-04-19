"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface SecurityLog {
  id: string
  type: "login" | "logout" | "failed_attempt" | "password_change"
  user: string
  ip: string
  date: string
  status: "success" | "warning" | "error"
}

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showLogs, setShowLogs] = useState(true)
  const [logs, setLogs] = useState<SecurityLog[]>([
    {
      id: "1",
      type: "login",
      user: "admin",
      ip: "192.168.1.100",
      date: "2024-03-15 10:30",
      status: "success"
    },
    {
      id: "2",
      type: "failed_attempt",
      user: "unknown",
      ip: "192.168.1.101",
      date: "2024-03-15 11:45",
      status: "error"
    }
  ])

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip.includes(searchQuery)
  )

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
        <div className="mb-4">
          <Input 
            placeholder="Kullanıcı veya IP ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {showLogs && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>IP Adresi</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.type === "login" ? "Giriş" : 
                       log.type === "logout" ? "Çıkış" : 
                       log.type === "failed_attempt" ? "Başarısız Giriş" : 
                       "Şifre Değişikliği"}
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge variant={log.status === "success" ? "default" : 
                                      log.status === "warning" ? "secondary" : 
                                      "destructive"}>
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
        )}
      </Card>
    </div>
  )
} 