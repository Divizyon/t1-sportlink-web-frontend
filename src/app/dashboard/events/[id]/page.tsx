"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  status: "pending" | "resolved" | "rejected"
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  category: string
  maxParticipants: number
  currentParticipants: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "pending"
  image: string
  participants: Participant[]
  reports: Report[]
}

// Demo veri
const eventData: Event = {
  id: "1",
  title: "Kadıköy Parkı Sabah Koşusu",
  description: "Her yaş ve seviyeden koşucuların katılabileceği haftalık koşu etkinliği. Kadıköy parkında gerçekleşecek olan bu etkinlikte, temel koşu teknikleri paylaşılacak ve ardından grup halinde 5 km'lik bir koşu yapılacaktır.",
  date: "2023-08-25",
  time: "08:00",
  location: "Kadıköy Parkı, İstanbul",
  organizer: "Koşu Kulübü",
  category: "Spor",
  maxParticipants: 30,
  currentParticipants: 18,
  status: "upcoming",
  image: "/events/running.jpg",
  participants: [
    { id: "1", name: "Ahmet Yılmaz", email: "ahmet@mail.com", avatar: "/avatars/01.png", status: "approved", registrationDate: "2023-08-01" },
    { id: "2", name: "Ayşe Demir", email: "ayse@mail.com", avatar: "/avatars/02.png", status: "approved", registrationDate: "2023-08-02" },
    { id: "3", name: "Mehmet Can", email: "mehmet@mail.com", avatar: "/avatars/03.png", status: "pending", registrationDate: "2023-08-03" },
    { id: "4", name: "Zeynep Kaya", email: "zeynep@mail.com", avatar: "/avatars/04.png", status: "declined", registrationDate: "2023-08-04" },
    { id: "5", name: "Ali Yılmaz", email: "ali@mail.com", avatar: "/avatars/05.png", status: "attended", registrationDate: "2023-08-05" },
  ],
  reports: [
    { id: "1", userId: "10", userName: "Mehmet Demir", reason: "Etkinlik Bilgisi Yanlış", description: "Etkinlik saati yanlış belirtilmiş.", date: "2023-08-20", status: "pending" },
    { id: "2", userId: "11", userName: "Ayşe Yılmaz", reason: "Organizatör Sorun Çıkardı", description: "Organizatör katılım ücretini önceden belirtmemişti.", date: "2023-08-21", status: "resolved" }
  ]
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [event, setEvent] = useState<Event>(eventData);
  const [formData, setFormData] = useState({
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    maxParticipants: eventData.maxParticipants.toString(),
    category: eventData.category
  });

  // Gerçek uygulamada, etkinlik verilerini burada alacaksınız
  // const { data: event, isLoading } = useSWR(`/api/events/${params.id}`, fetcher)
  // if (isLoading) return <div>Yükleniyor...</div>
  // if (!event) return <div>Etkinlik bulunamadı</div>

  // Demo amaçlı, gerçek API kullanımında bu işlem backend'de yapılacaktır
  const handleParticipantStatusChange = (participantId: string, status: "approved" | "pending" | "declined" | "attended") => {
    setEvent(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId ? { ...p, status } : p
      )
    }));
    
    toast({
      title: "Katılımcı durumu güncellendi",
      description: `Katılımcı durumu "${status}" olarak güncellendi.`,
    });
  };

  const handleReportStatusChange = (reportId: string, status: "pending" | "resolved" | "rejected") => {
    setEvent(prev => ({
      ...prev,
      reports: prev.reports.map(r => 
        r.id === reportId ? { ...r, status } : r
      )
    }));
    
    toast({
      title: "Rapor durumu güncellendi",
      description: `Rapor durumu "${status}" olarak güncellendi.`,
    });
  };

  const handleEventStatusChange = (status: "upcoming" | "ongoing" | "completed" | "cancelled" | "pending") => {
    setEvent(prev => ({
      ...prev,
      status
    }));
    
    toast({
      title: "Etkinlik durumu güncellendi",
      description: `Etkinlik durumu "${status}" olarak güncellendi.`,
    });
  };

  const handleDeleteEvent = () => {
    // Gerçek uygulamada API çağrısı yapılacak
    toast({
      title: "Etkinlik silindi",
      description: "Etkinlik başarıyla silindi.",
    });
    
    // Ana sayfaya yönlendir
    router.push("/dashboard");
  };

  const handleEventUpdate = () => {
    // Güncellenen verileri kaydet
    setEvent(prev => ({
      ...prev,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      maxParticipants: parseInt(formData.maxParticipants),
      category: formData.category
    }));
    
    setIsEditing(false);
    
    toast({
      title: "Etkinlik güncellendi",
      description: "Etkinlik bilgileri başarıyla güncellendi.",
    });
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Etkinlik Detayı</h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </Button>
                <Button onClick={() => setShowDeleteDialog(true)} variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  İptal
                </Button>
                <Button onClick={handleEventUpdate}>
                  Kaydet
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Etkinlik Detayları</TabsTrigger>
            <TabsTrigger value="participants" className="relative">
              Katılımcılar
              <Badge className="ml-1 bg-blue-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                {event.currentParticipants}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              Raporlar
              {event.reports.filter(r => r.status === "pending").length > 0 && (
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
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <span>{event.title}</span>
                  )}
                  {getStatusBadge(event.status)}
                </CardTitle>
                <CardDescription>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input 
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-auto"
                          />
                          <Input 
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-auto"
                          />
                        </div>
                      ) : (
                        <span>{new Date(event.date).toLocaleDateString('tr-TR')} {event.time}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <Input 
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        />
                      ) : (
                        <span>{event.location}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <Input 
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                          className="w-20"
                        />
                      ) : (
                        <span>{event.currentParticipants}/{event.maxParticipants} Katılımcı</span>
                      )}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Input 
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea 
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold mb-2">Kategori</h3>
                      <p>{event.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Açıklama</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
              {!isEditing && (
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant={event.status === "upcoming" ? "default" : "outline"}
                      onClick={() => handleEventStatusChange("upcoming")}
                    >
                      Yaklaşan
                    </Button>
                    <Button
                      variant={event.status === "ongoing" ? "default" : "outline"}
                      onClick={() => handleEventStatusChange("ongoing")}
                    >
                      Devam Ediyor
                    </Button>
                    <Button
                      variant={event.status === "completed" ? "default" : "outline"}
                      onClick={() => handleEventStatusChange("completed")}
                    >
                      Tamamlandı
                    </Button>
                    <Button
                      variant={event.status === "cancelled" ? "destructive" : "outline"}
                      onClick={() => handleEventStatusChange("cancelled")}
                    >
                      İptal Edildi
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Katılımcılar ({event.participants.length})</CardTitle>
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
                    {event.participants.map((participant) => (
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Raporlar ve Şikayetler ({event.reports.length})</CardTitle>
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
                    {event.reports.map((report) => (
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
                            {report.status === "pending" && (
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
                    {event.reports.length === 0 && (
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