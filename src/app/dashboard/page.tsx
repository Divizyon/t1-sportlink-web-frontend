"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Calendar, Activity, Newspaper, AlertTriangle, BarChart3, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { QuickMenu } from "@/components/QuickMenu"
import { ApprovalModal } from "@/components/modals/ApprovalModal"
import { ContactModal } from "@/components/modals/ContactModal"
import { ReportsModal } from "@/components/modals/ReportsModal"
import { NewsModal } from "@/components/modals/NewsModal"
import { NewEventModal } from "@/components/modals/NewEventModal"
import { EventDetailModal } from "@/components/modals/EventDetailModal"

// Haftalık etkinlik verileri
const eventData = [
  { name: "Pzt", etkinlik: 4 },
  { name: "Sal", etkinlik: 6 },
  { name: "Çar", etkinlik: 8 },
  { name: "Per", etkinlik: 5 },
  { name: "Cum", etkinlik: 10 },
  { name: "Cmt", etkinlik: 12 },
  { name: "Paz", etkinlik: 7 },
]

// Son etkinlik verileri
const lastEvents = [
  { id: 1, title: "Futbol Turnuvası", date: "18 Nisan", participants: 24 },
  { id: 2, title: "Basketbol Maçı", date: "15 Nisan", participants: 16 },
  { id: 3, title: "Yüzme Yarışması", date: "12 Nisan", participants: 32 },
  { id: 4, title: "Tenis Turnuvası", date: "10 Nisan", participants: 12 },
]

// Modal türleri
type ModalType = 'newEvent' | 'news' | 'eventDetail' | 'approval' | 'contact' | 'reports' | null;

export default function DashboardPage() {
  // Tek bir modal state kullanımı
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>(undefined)

  // Modal açma fonksiyonları
  const openModal = (modalType: ModalType, eventId?: number) => {
    if (eventId) setSelectedEventId(eventId)
    setActiveModal(modalType)
  }

  // Aksiyon fonksiyonları
  const handleNewEvent = () => {
    toast.success("Yeni etkinlik oluşturma işlemi başlatıldı")
    openModal('newEvent')
  }

  const handleManageUsers = () => {
    toast.success("Kullanıcı yönetim sayfasına yönlendiriliyorsunuz")
    window.location.href = "/dashboard/users"
  }

  const handlePublishNews = () => {
    toast.success("Haber yayınlama işlemi başlatıldı")
    openModal('news')
  }

  const handleEditEvent = (id: number) => {
    toast.info(`${id} numaralı etkinlik düzenleniyor`)
    openModal('eventDetail', id)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Ana Düzen - 2 Kolonlu Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Sol Kolon - İstatistikler ve Grafik (%70) */}
        <div className="xl:col-span-8 space-y-6">
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Günlük Etkinlik</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Bugün oluşturulan toplam etkinlik
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif Kullanıcı</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125</div>
                <p className="text-xs text-muted-foreground">
                  Son 24 saatte giriş yapan kullanıcı
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Katılım</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  Tüm etkinliklerdeki toplam kişi
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Haftalık Etkinlik Grafiği */}
          <Card>
            <CardHeader>
              <CardTitle>Haftalık Etkinlik Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="etkinlik" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ek İstatistik Kartları */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sık Raporlanan Kullanıcı</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9</div>
                <p className="text-xs text-muted-foreground">
                  Son 7 günde alınan raporlar
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sık Raporlanan Etkinlik</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Son 7 günde alınan şikayetler
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organizasyonel Etkinlikler</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  Katılım durumu
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sağ Kolon - Hızlı Erişim ve Son Etkinlikler (%30) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Hızlı Aksiyonlar Paneli */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Aksiyonlar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={handleNewEvent} className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Etkinlik
              </Button>
              <Button onClick={handleManageUsers} variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Kullanıcıları Yönet
              </Button>
              <Button onClick={handlePublishNews} variant="outline" className="w-full justify-start">
                <Newspaper className="mr-2 h-4 w-4" />
                Haber Yayınla
              </Button>
            </CardContent>
          </Card>

          {/* Son Etkinlikler */}
          <Card>
            <CardHeader>
              <CardTitle>Son Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lastEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-gray-50 cursor-pointer rounded-md px-2 py-1 transition-colors"
                    onClick={() => handleEditEvent(event.id)}
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs bg-gray-100 rounded-full px-2 py-1 mr-2">
                        <Users className="mr-1 h-3 w-3 inline" />
                        {event.participants}
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Hızlı Menü Bileşeni */}
          <QuickMenu />
        </div>
      </div>

      {/* Modallar */}
      <NewEventModal 
        open={activeModal === 'newEvent'}
        onOpenChange={(open) => setActiveModal(open ? 'newEvent' : null)}
      />

      <NewsModal 
        open={activeModal === 'news'}
        onOpenChange={(open) => setActiveModal(open ? 'news' : null)}
      />

      <EventDetailModal 
        open={activeModal === 'eventDetail'}
        onOpenChange={(open) => setActiveModal(open ? 'eventDetail' : null)}
        event={selectedEventId ? { id: `evt-${selectedEventId}` } : null}
      />

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
    </div>
  )
} 