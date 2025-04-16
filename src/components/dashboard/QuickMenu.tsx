"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileText, Users, MessageSquare, ArrowRight, Newspaper, Clock } from "lucide-react"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { NewsModal } from "@/components/modals/NewsModal" 
import { EventDetailModal } from "@/components/modals/EventDetailModal"
import { NewEventModal } from "@/components/modals/NewEventModal"
import { useRouter } from "next/navigation"

interface QuickMenuItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  count?: number
  action: () => void
}

export function QuickMenu() {
  const router = useRouter()
  const [openModal, setOpenModal] = useState<string | null>(null)
  
  const handleOpenModal = (modalId: string) => {
    setOpenModal(modalId)
  }
  
  const handleCloseModal = () => {
    setOpenModal(null)
  }

  // Menü öğeleri ve eylemlerini tanımla
  const menuItems: QuickMenuItem[] = [
    {
      id: "approval",
      title: "Etkinlik Onayları",
      description: "Onay bekleyen etkinlikler",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      count: 5,
      action: () => handleOpenModal("approval")
    },
    {
      id: "contact",
      title: "İletişim Talepleri",
      description: "Cevaplanmamış iletişim talepleri",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      count: 3,
      action: () => handleOpenModal("contact")
    },
    {
      id: "new-event",
      title: "Yeni Etkinlik",
      description: "Yeni bir etkinlik oluştur",
      icon: <PlusCircle className="h-5 w-5 text-purple-500" />,
      action: () => handleOpenModal("new-event")
    },
    {
      id: "users",
      title: "Kullanıcıları Yönet",
      description: "Kullanıcı yönetimi",
      icon: <Users className="h-5 w-5 text-orange-500" />,
      action: () => router.push("/dashboard/users")
    },
    {
      id: "news",
      title: "Haber Yayınla",
      description: "Yeni bir haber yayınla",
      icon: <Newspaper className="h-5 w-5 text-cyan-500" />,
      action: () => handleOpenModal("news")
    },
    {
      id: "last-events",
      title: "Son Etkinlikler",
      description: "Düzenlenen son etkinlikler",
      icon: <FileText className="h-5 w-5 text-yellow-500" />,
      action: () => handleOpenModal("event-detail")
    }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="p-2 rounded-full bg-slate-100">{item.icon}</div>
                {item.count !== undefined && (
                  <Badge variant="secondary" className="font-semibold">
                    {item.count}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                onClick={item.action}
              >
                <span>İncele</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modallar */}
      <ApprovalModal 
        open={openModal === "approval"} 
        onOpenChange={(open) => open ? handleOpenModal("approval") : handleCloseModal()} 
      />
      
      <ContactModal 
        open={openModal === "contact"} 
        onOpenChange={(open) => open ? handleOpenModal("contact") : handleCloseModal()} 
      />
      
      <NewsModal 
        open={openModal === "news"} 
        onOpenChange={(open) => open ? handleOpenModal("news") : handleCloseModal()} 
      />
      
      <EventDetailModal 
        open={openModal === "event-detail"} 
        onOpenChange={(open) => open ? handleOpenModal("event-detail") : handleCloseModal()} 
      />
      
      <NewEventModal 
        open={openModal === "new-event"} 
        onOpenChange={(open) => open ? handleOpenModal("new-event") : handleCloseModal()} 
      />
    </>
  )
} 