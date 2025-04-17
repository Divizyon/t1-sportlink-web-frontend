"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ClipboardCheck,
  MessageSquare,
  FileText,
  Users,
  Calendar,
  Bell,
  Newspaper
} from "lucide-react"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { ReportsModal } from "@/components/modals/ReportsModal"
import { NewsModal } from "@/components/modals/NewsModal"
import { NewEventModal } from "@/components/modals/NewEventModal"

export interface QuickMenuItem {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
  action: () => void
}

type ModalType = 'approval' | 'contact' | 'reports' | 'news' | 'newEvent' | null;

export function QuickMenu() {
  // Tek bir modal state ile tüm modalları yönetme
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  
  // Hızlı erişim menü öğeleri
  const menuItems: QuickMenuItem[] = [
    {
      id: "participants",
      label: "Katılımcılar",
      icon: <Users className="h-5 w-5" />,
      count: 573,
      action: () => {
        console.log("Katılımcılar listesini aç")
        // Alternatif olarak router.push("/dashboard/participants") kullanılabilir
      }
    },
    {
      id: "events",
      label: "Etkinlikler",
      icon: <Calendar className="h-5 w-5" />,
      count: 18,
      action: () => {
        console.log("Etkinlikler listesini aç")
        // Alternatif olarak router.push("/dashboard/events") kullanılabilir
      }
    },
    {
      id: "approvals",
      label: "Etkinlik Onayları",
      icon: <ClipboardCheck className="h-5 w-5" />,
      count: 5,
      action: () => setActiveModal('approval')
    },
    {
      id: "contacts",
      label: "İletişim Talepleri",
      icon: <MessageSquare className="h-5 w-5" />,
      count: 3,
      action: () => setActiveModal('contact')
    },
    {
      id: "reports",
      label: "Bekleyen Raporlar",
      icon: <FileText className="h-5 w-5" />,
      count: 7,
      action: () => setActiveModal('reports')
    }
  ]

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto p-4 flex flex-row items-center justify-start gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
              onClick={item.action}
            >
              <div className="relative">
                {item.icon}
                {item.count && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium truncate">{item.label}</span>
            </Button>
          ))}
          
          {/* Duyuru ve Haber Butonları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={() => setActiveModal('news')}
            >
              <Bell className="h-4 w-4" />
              <span>Duyuru Yayınla</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setActiveModal('newEvent')}
            >
              <Newspaper className="h-4 w-4" />
              <span>Etkinlik Ekle</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modallar */}
      <ApprovalModal 
        open={activeModal === 'approval'} 
        onOpenChange={(open) => setActiveModal(open ? 'approval' : null)} 
      />
      
      <ContactModal 
        open={activeModal === 'contact'} 
        onOpenChange={(open) => setActiveModal(open ? 'contact' : null)} 
      />
      
      <ReportsModal 
        open={activeModal === 'reports'} 
        onOpenChange={(open) => setActiveModal(open ? 'reports' : null)} 
      />
      
      <NewsModal
        open={activeModal === 'news'}
        onOpenChange={(open) => setActiveModal(open ? 'news' : null)}
      />
      
      <NewEventModal
        open={activeModal === 'newEvent'}
        onOpenChange={(open) => setActiveModal(open ? 'newEvent' : null)}
      />
    </>
  )
} 