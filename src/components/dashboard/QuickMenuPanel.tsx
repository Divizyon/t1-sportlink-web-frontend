"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, Calendar, PlusCircle, Bell, Newspaper, 
  MessageSquare, FileText, Clock, LucideIcon 
} from "lucide-react"
import { NewEventModal } from "@/components/modals/NewEventModal"
import { NewsModal } from "@/components/modals/NewsModal"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { EventDetailModal } from "@/components/modals/EventDetailModal"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface QuickMenuPanelProps {
  className?: string
}

interface QuickMenuItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  count?: number
  onClick: () => void
  priority?: number
}

interface QuickAction {
  id: string
  title: string
  icon: React.ReactNode
  onClick: () => void
}

export function QuickMenuPanel({ className }: QuickMenuPanelProps) {
  const router = useRouter()
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [reportsModalOpen, setReportsModalOpen] = useState(false)
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [newEventModalOpen, setNewEventModalOpen] = useState(false)
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false)
  const [newsModalOpen, setNewsModalOpen] = useState(false)

  // Hızlı menü öğeleri
  const quickMenuItems: QuickMenuItem[] = [
    {
      id: "participants",
      title: "Katılımcılar",
      description: "Tüm katılımcıları yönet",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      onClick: () => router.push("/dashboard/users"),
      priority: 1
    },
    {
      id: "events",
      title: "Etkinlikler",
      description: "Tüm etkinlikleri görüntüle",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      onClick: () => router.push("/dashboard/events"),
      priority: 2
    },
    {
      id: "approval",
      title: "Onay Bekleyenler",
      description: "Onay bekleyen etkinlikler",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      count: 5,
      onClick: () => setApprovalModalOpen(true)
    },
    {
      id: "contact",
      title: "İletişim Talepleri",
      description: "Yanıtlanmamış mesajlar",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      count: 3,
      onClick: () => setContactModalOpen(true)
    },
    {
      id: "reports",
      title: "Raporlar",
      description: "Bekleyen raporlar",
      icon: <FileText className="h-5 w-5 text-red-500" />,
      count: 2,
      onClick: () => setReportsModalOpen(true)
    }
  ]

  // Hızlı erişim butonları
  const quickActions: QuickAction[] = [
    {
      id: "new-event",
      title: "Yeni Etkinlik",
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
      onClick: () => setNewEventModalOpen(true)
    },
    {
      id: "publish-news",
      title: "Duyuru Yayınla",
      icon: <Bell className="h-4 w-4 mr-2" />,
      onClick: () => setNewsModalOpen(true)
    },
    {
      id: "add-news",
      title: "Haber Ekle",
      icon: <Newspaper className="h-4 w-4 mr-2" />,
      onClick: () => setNewsModalOpen(true)
    }
  ]

  // Menü öğelerini önceliğe göre sırala
  const sortedMenuItems = [...quickMenuItems].sort((a, b) => {
    const priorityA = a.priority || 999
    const priorityB = b.priority || 999
    return priorityA - priorityB
  })

  return (
    <Card className={cn("w-64 shadow-lg", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Hızlı Erişim</CardTitle>
        <CardDescription>Hızlı işlemler ve bildirimler</CardDescription>
        
        <div className="flex flex-col gap-2 mt-2">
          {quickActions.map((action) => (
            <Button 
              key={action.id} 
              variant="outline" 
              className="w-full justify-start"
              onClick={action.onClick}
            >
              {action.icon}
              {action.title}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-2">
        {sortedMenuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start h-auto py-2 px-3 relative"
            onClick={item.onClick}
          >
            <div className="flex items-center">
              <div className="mr-3">{item.icon}</div>
              <div className="text-left">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
            {item.count !== undefined && (
              <div className="absolute right-2 top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {item.count}
              </div>
            )}
          </Button>
        ))}
      </CardContent>

      {/* Modallar */}
      <ApprovalModal 
        open={approvalModalOpen} 
        onOpenChange={setApprovalModalOpen} 
      />
      
      <ContactModal 
        open={contactModalOpen} 
        onOpenChange={setContactModalOpen} 
      />
      
      <EventDetailModal 
        open={eventDetailModalOpen} 
        onOpenChange={setEventDetailModalOpen} 
      />
      
      <NewEventModal 
        open={newEventModalOpen} 
        onOpenChange={setNewEventModalOpen} 
      />
      
      <NewsModal 
        open={newsModalOpen} 
        onOpenChange={setNewsModalOpen} 
      />
    </Card>
  )
} 