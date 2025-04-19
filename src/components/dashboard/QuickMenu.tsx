"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bell, Calendar, Users, BarChart3, FileText } from "lucide-react"
import { NewsModal } from "@/components/modals/NewsModal"
import { NewEventModal } from "@/components/modals/NewEventModal"

export interface QuickMenuItem {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
  action: () => void
}

export function QuickMenu() {
  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [newEventModalOpen, setNewEventModalOpen] = useState(false)

  const menuItems: QuickMenuItem[] = [
    {
      id: "participants",
      label: "Katılımcılar",
      icon: <Users className="h-4 w-4" />,
      count: 253,
      action: () => {
        console.log("Katılımcılar modülüne git")
        // Burada katılımcılar sayfasına yönlendirme yapılabilir
        // router.push('/dashboard/participants')
      }
    },
    {
      id: "events",
      label: "Etkinlikler",
      icon: <Calendar className="h-4 w-4" />,
      count: 18,
      action: () => {
        console.log("Etkinlikler modülüne git")
        // Burada etkinlikler sayfasına yönlendirme yapılabilir
        // router.push('/dashboard/events')
      }
    },
    {
      id: "reports",
      label: "Raporlar",
      icon: <BarChart3 className="h-4 w-4" />,
      count: 5,
      action: () => {
        console.log("Raporlar modülüne git")
        // Burada raporlar sayfasına yönlendirme yapılabilir
        // router.push('/dashboard/reports')
      }
    },
    {
      id: "documents",
      label: "Belgeler",
      icon: <FileText className="h-4 w-4" />,
      count: 12,
      action: () => {
        console.log("Belgeler modülüne git")
        // Burada belgeler sayfasına yönlendirme yapılabilir
        // router.push('/dashboard/documents')
      }
    }
  ]

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hızlı Erişim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Ana hızlı erişim butonları */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setNewsModalOpen(true)}
            >
              <Bell className="mr-2 h-4 w-4" />
              Duyuru Yayınla
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setNewEventModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Etkinlik Ekle
            </Button>
          </div>
          
          {/* Menü öğeleri */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-between"
                onClick={item.action}
              >
                <span className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </span>
                {item.count !== undefined && (
                  <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {item.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Modallar */}
      <NewsModal
        open={newsModalOpen}
        onOpenChange={setNewsModalOpen}
      />
      
      <NewEventModal
        open={newEventModalOpen}
        onOpenChange={setNewEventModalOpen}
      />
    </>
  )
} 