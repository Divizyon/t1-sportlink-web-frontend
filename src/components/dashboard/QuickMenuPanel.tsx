"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileCheck, AlertTriangle, Package, CreditCard, User, Plus, Newspaper, History } from "lucide-react"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { ReportsModal } from "@/components/modals/ReportsModal"
import { EquipmentModal } from "@/components/modals/EquipmentModal"
import { NewEventModal } from "@/components/modals/NewEventModal"

interface QuickMenuPanelProps {
  className?: string
}

export function QuickMenuPanel({ className }: QuickMenuPanelProps) {
  // Modal durumları
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [reportsModalOpen, setReportsModalOpen] = useState(false)
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [newEventModalOpen, setNewEventModalOpen] = useState(false)
  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false)

  // Hızlı erişim menüsü öğeleri
  const quickMenuItems = [
    {
      title: "Etkinlik Onayları",
      description: "Onay bekleyen etkinlikleri görüntüleyin",
      icon: <FileCheck className="h-5 w-5" />,
      count: 5,
      onClick: () => setApprovalModalOpen(true),
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "İletişim Talepleri",
      description: "Kullanıcılardan gelen mesajlar",
      icon: <MessageSquare className="h-5 w-5" />,
      count: 3,
      onClick: () => setContactModalOpen(true),
      color: "text-violet-500",
      bgColor: "bg-violet-50"
    },
    {
      title: "Bekleyen Raporlar",
      description: "İncelenmesi gereken raporlar",
      icon: <AlertTriangle className="h-5 w-5" />,
      count: 7,
      onClick: () => setReportsModalOpen(true),
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Kullanıcıları Yönet",
      description: "Kullanıcı listesine erişin",
      icon: <User className="h-5 w-5" />,
      count: 0,
      href: "/users",
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ]

  // Hızlı Eylemler
  const quickActions = [
    {
      title: "Yeni Etkinlik",
      icon: <Plus className="h-4 w-4 mr-2" />,
      onClick: () => setNewEventModalOpen(true),
      variant: "default" as const
    },
    {
      title: "Haber Yayınla",
      icon: <Newspaper className="h-4 w-4 mr-2" />,
      onClick: () => setNewsModalOpen(true),
      variant: "outline" as const
    },
    {
      title: "Son Etkinlikler",
      icon: <History className="h-4 w-4 mr-2" />,
      onClick: () => setEventDetailsModalOpen(true),
      variant: "outline" as const
    }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Hızlı Menü</CardTitle>
        <CardDescription>Önemli işlemlere hızlı erişim sağlayın</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {quickActions.map((action, index) => (
            <Button 
              key={index} 
              size="sm" 
              variant={action.variant}
              onClick={action.onClick}
              className="gap-1"
            >
              {action.icon}
              {action.title}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quickMenuItems.map((item, index) => (
            item.href ? (
              <Link href={item.href} key={index}>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <div className={`h-6 min-w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center`}>
                      {item.count}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.count > 0 && (
                  <div className={`h-6 min-w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center`}>
                    {item.count}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
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
      
      <ReportsModal 
        open={reportsModalOpen} 
        onOpenChange={setReportsModalOpen} 
      />
      
      <EquipmentModal 
        open={equipmentModalOpen} 
        onOpenChange={setEquipmentModalOpen} 
      />
      
      <NewEventModal 
        open={newEventModalOpen} 
        onOpenChange={setNewEventModalOpen} 
      />
    </Card>
  )
} 