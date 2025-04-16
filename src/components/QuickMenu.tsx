"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ClipboardCheck,
  MessageSquare,
  FileText
} from "lucide-react"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { ReportsModal } from "@/components/modals/ReportsModal"

export interface QuickMenuItem {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
  action: () => void
}

type ModalType = 'approval' | 'contact' | 'reports' | null;

export function QuickMenu() {
  // Tek bir modal state ile tüm modalları yönetme
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  
  // Hızlı erişim menü öğeleri
  const menuItems: QuickMenuItem[] = [
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
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h2 className="text-lg font-semibold mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
              onClick={item.action}
            >
              <div className="relative">
                {item.icon}
                {item.count && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
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
    </>
  )
} 