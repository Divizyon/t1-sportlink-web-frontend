"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Clock, MapPin, CheckCircle, XCircle, AlertTriangle, Edit, Trash, UserCog, ChevronLeft } from "lucide-react"
import { UserNav } from "@/components/nav/UserNav"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Participant {
  id: string
  name: string
  email: string
  avatar: string
  status: "approved" | "pending" | "declined" | "attended"
  registrationDate: string
}

interface Report {
  id: string
  userId: string
  userName: string
  reason: string
  description: string
  date: string
  status: "pending" | "resolved" | "rejected" | "reviewing"
}

interface Event {
  id: string | number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  participants: Participant[]
  maxParticipants: number
  status: "pending" | "approved" | "rejected" | "completed"
  organizer: {
    id: string
    name: string
    surname: string
    role: string
    email: string
  }
  reports: Report[]
  image?: string
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  const unwrappedParams = use(params)

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        const events = JSON.parse(savedEvents) as Event[]
        const foundEvent = events.find((e) => String(e.id) === unwrappedParams.id)
        if (foundEvent) {
          setEvent({
            ...foundEvent,
            reports: foundEvent.reports || [],
            participants: foundEvent.participants || []
          })
        } else {
          toast({
            title: "Hata",
            description: "Etkinlik bulunamadı.",
            variant: "destructive"
          })
          router.push('/dashboard/events')
        }
      }
    } catch (error) {
      console.error('Error loading event:', error)
      toast({
        title: "Hata",
        description: "Etkinlik yüklenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [unwrappedParams.id, toast, router])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  if (!event) {
    return <div>Etkinlik bulunamadı.</div>
  }

  const handleEventUpdate = () => {
    if (!event) return

    try {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        const events = JSON.parse(savedEvents) as Event[]
        const updatedEvents = events.map((e) => 
          String(e.id) === unwrappedParams.id ? event : e
        )
        localStorage.setItem('events', JSON.stringify(updatedEvents))
        
        toast({
          title: "Başarılı",
          description: "Etkinlik başarıyla güncellendi."
        })
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast({
        title: "Hata",
        description: "Etkinlik güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: keyof Event, value: string) => {
    if (!event) return

    setEvent((prev) => {
      if (!prev) return null
      const updatedEvent: Event = {
        ...prev,
        [field]: value
      }
      return updatedEvent
    })
  }

  const handleDeleteEvent = () => {
    if (!event) return

    try {
      const savedEvents = localStorage.getItem('events')
      if (savedEvents) {
        const events = JSON.parse(savedEvents) as Event[]
        const filteredEvents = events.filter((e) => String(e.id) !== unwrappedParams.id)
        localStorage.setItem('events', JSON.stringify(filteredEvents))
        
        toast({
          title: "Başarılı",
          description: "Etkinlik başarıyla silindi."
        })
        router.push('/dashboard/events')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: "Hata",
        description: "Etkinlik silinirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleParticipantStatusChange = (participantId: string, newStatus: Participant['status']) => {
    if (!event) return

    try {
      const updatedEvent = {
        ...event,
        participants: event.participants.map(p => 
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      }
      setEvent(updatedEvent)
      handleEventUpdate()
    } catch (error) {
      console.error('Error updating participant status:', error)
      toast({
        title: "Hata",
        description: "Katılımcı durumu güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleReportStatusChange = (reportId: string, newStatus: Report['status']) => {
    if (!event) return

    try {
      const updatedEvent = {
        ...event,
        reports: event.reports.map(r => 
          r.id === reportId ? { ...r, status: newStatus } : r
        )
      }
      setEvent(updatedEvent)
      handleEventUpdate()
    } catch (error) {
      console.error('Error updating report status:', error)
      toast({
        title: "Hata",
        description: "Rapor durumu güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Yaklaşan</Badge>;
      case "ongoing":
        return <Badge className="bg-green-500">Devam Ediyor</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Tamamlandı</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">İptal Edildi</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Onay Bekliyor</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Onaylandı</Badge>;
      case "declined":
        return <Badge className="bg-red-500">Reddedildi</Badge>;
      case "attended":
        return <Badge className="bg-blue-500">Katıldı</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Çözüldü</Badge>;
      case "rejected":
        return <Badge className="bg-gray-500">Reddedildi</Badge>;
      default:
        return <Badge>Bilinmiyor</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Sport Link</h1>
          <div className="ml-auto flex items-center">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/events')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
            <h2 className="text-3xl font-bold tracking-tight text-black">{event.title}</h2>
            <Badge 
              variant={event.status === "approved" ? "default" : 
                      event.status === "rejected" ? "destructive" : 
                      event.status === "completed" ? "secondary" : 
                      "outline"}
            >
              {event.status === "pending" ? "Beklemede" :
               event.status === "approved" ? "Onaylandı" :
               event.status === "rejected" ? "Reddedildi" :
               "Tamamlandı"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Etkinlik Detayları</TabsTrigger>
            <TabsTrigger value="participants" className="relative">
              Katılımcılar
              <Badge className="ml-1 bg-blue-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                {event?.participants?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              Raporlar
              {event?.reports?.filter(r => r.status === "pending").length > 0 && (
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {event.reports.filter(r => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {isEditing ? (
                    <Input 
                      value={event.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <span className="text-black text-2xl font-semibold">{event.title}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Katılımcılar ({event?.participants?.length || 0})</CardTitle>
                <CardDescription>
                  Bu etkinliğe katılmak isteyen veya katılan kişilerin listesi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Katılımcı</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(event?.participants) && event.participants.length > 0 ? (
                      event.participants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <img 
                                src={participant.avatar} 
                                alt={participant.name} 
                                className="h-8 w-8 rounded-full"
                              />
                              <div>
                                <div>{participant.name}</div>
                                <div className="text-xs text-muted-foreground">{participant.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(participant.registrationDate).toLocaleDateString('tr-TR')}</TableCell>
                          <TableCell>{getStatusBadge(participant.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                              >
                                <Link href={`/dashboard/users/${participant.id}`}>
                                  <UserCog className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleParticipantStatusChange(participant.id, "approved")}
                                className={participant.status === "approved" ? "bg-green-100" : ""}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleParticipantStatusChange(participant.id, "declined")}
                                className={participant.status === "declined" ? "bg-red-100" : ""}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleParticipantStatusChange(participant.id, "attended")}
                                className={participant.status === "attended" ? "bg-blue-100" : ""}
                              >
                                <Users className="h-4 w-4 text-blue-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          Henüz katılımcı bulunmuyor.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Raporlar ve Şikayetler ({event?.reports?.length || 0})</CardTitle>
                <CardDescription>
                  Bu etkinlik hakkında bildirilen raporlar ve şikayetler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rapor Eden</TableHead>
                      <TableHead>Sebep</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event?.reports?.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <Link href={`/dashboard/users/${report.userId}`} className="text-blue-500 hover:underline">
                            {report.userName}
                          </Link>
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.description}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {report.status === "pending" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReportStatusChange(report.id, "resolved")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
<<<<<<< HEAD
                            {(report.status === "pending") && (
=======
                            {report.status === "pending" && (
>>>>>>> b8a40a51e748b24658022b9cbb78f1a77dc8e947
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleReportStatusChange(report.id, "rejected")}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!event?.reports || event.reports.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                          Bu etkinlik için henüz rapor bulunmuyor.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etkinliği silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu etkinlik sistemden kalıcı olarak silinecek ve
              tüm kayıtlar ve veriler kaybolacaktır.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-red-600 hover:bg-red-700">
              Etkinliği Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 