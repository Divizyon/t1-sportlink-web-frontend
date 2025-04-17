"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, Edit, Trash, Save, CalendarCheck,
  Shield, MailWarning, UserX, UserCheck, Calendar,
  ArrowUpRight, Lock, Mail
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: string
  title: string
  date: string
  category: string
  status: "completed" | "upcoming" | "canceled"
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  gender?: string
  age?: number
  registeredDate: string
  lastActive: string
  status: "active" | "suspended" | "blocked"
  role?: "user" | "admin" | "moderator"
  bio?: string
  address?: string
  favoriteCategories?: string[]
  events?: Event[]
  eventCount?: number
  completedEvents?: number
}

interface UserDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSuccess?: () => void
}

export function UserDetailModal({ open, onOpenChange, user, onSuccess }: UserDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")
  const [blockReason, setBlockReason] = useState("")
  
  // Mock kullanıcı verisini kullan eğer gerçek bir kullanıcı yoksa
  const mockUser: User = user || {
    id: "usr-123",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    avatar: "/avatars/01.png",
    phone: "+90 555 123 4567",
    gender: "Erkek",
    age: 28,
    registeredDate: "01.01.2023",
    lastActive: "Bugün, 10:30",
    status: "active",
    role: "user",
    bio: "Spor ve açık hava aktivitelerine meraklı bir profesyonel.",
    address: "İstanbul, Türkiye",
    favoriteCategories: ["Futbol", "Koşu", "Bisiklet"],
    events: [
      { 
        id: "evt-1", 
        title: "Sahil Koşusu", 
        date: "15.08.2023", 
        category: "Koşu",
        status: "completed"
      },
      { 
        id: "evt-2", 
        title: "Hafta Sonu Basketbol", 
        date: "22.08.2023", 
        category: "Basketbol",
        status: "completed"
      },
      { 
        id: "evt-3", 
        title: "Bisiklet Turu", 
        date: "29.08.2023", 
        category: "Bisiklet",
        status: "completed"
      },
      { 
        id: "evt-4", 
        title: "Sabah Koşusu", 
        date: "10.09.2023", 
        category: "Koşu",
        status: "upcoming"
      }
    ],
    eventCount: 12,
    completedEvents: 8
  }
  
  const [formData, setFormData] = useState<User>(mockUser)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSave = () => {
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      toast.success("Kullanıcı bilgileri güncellendi")
      if (onSuccess) onSuccess()
    }, 1000)
  }
  
  const handleDelete = () => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      setLoading(true)
      
      // Simüle edilmiş API çağrısı
      setTimeout(() => {
        setLoading(false)
        toast.success("Kullanıcı silindi")
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 1000)
    }
  }

  const handleSuspendUser = () => {
    if (!suspendReason) {
      toast.error("Lütfen bir gerekçe girin")
      return
    }
    
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setFormData(prev => ({ ...prev, status: "suspended" }))
      setLoading(false)
      setShowSuspendDialog(false)
      toast.success("Kullanıcı askıya alındı")
      if (onSuccess) onSuccess()
    }, 1000)
  }

  const handleBlockUser = () => {
    if (!blockReason) {
      toast.error("Lütfen bir gerekçe girin")
      return
    }
    
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setFormData(prev => ({ ...prev, status: "blocked" }))
      setLoading(false)
      setShowBlockDialog(false)
      toast.success("Kullanıcı engellendi")
      if (onSuccess) onSuccess()
    }, 1000)
  }

  const handleActivateUser = () => {
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setFormData(prev => ({ ...prev, status: "active" }))
      setLoading(false)
      toast.success("Kullanıcı aktifleştirildi")
      if (onSuccess) onSuccess()
    }, 1000)
  }
  
  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aktif</Badge>
      case "suspended":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Askıya Alınmış</Badge>
      case "blocked":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Engellendi</Badge>
      default:
        return null
    }
  }

  const getEventStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Tamamlandı</Badge>
      case "upcoming":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Yaklaşan</Badge>
      case "canceled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">İptal Edildi</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{isEditing ? "Kullanıcıyı Düzenle" : "Kullanıcı Detayları"}</DialogTitle>
            {getStatusBadge(formData.status)}
          </div>
          <DialogDescription>
            {isEditing
              ? "Kullanıcı bilgilerini düzenleyebilirsiniz."
              : "Kullanıcı detaylarını görüntüleyin ve gerekirse düzenleyin."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="events">Etkinlikler</TabsTrigger>
            <TabsTrigger value="actions">İşlemler</TabsTrigger>
          </TabsList>
          
          {/* Profil Tab */}
          <TabsContent value="profile" className="space-y-4 pt-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback>{formData.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Cinsiyet</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cinsiyet seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Erkek">Erkek</SelectItem>
                        <SelectItem value="Kadın">Kadın</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Yaş</Label>
                    <Input 
                      id="age" 
                      name="age"
                      type="number"
                      min={1}
                      value={formData.age || ''}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Input 
                      id="address" 
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkında</Label>
                  <Textarea 
                    id="bio" 
                    name="bio"
                    className="min-h-[80px]"
                    value={formData.bio || ''}
                    onChange={handleChange}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{formData.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {formData.email}
                    </p>
                    {formData.role && (
                      <Badge variant="secondary" className="uppercase">
                        {formData.role}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <p>{formData.phone || "Belirtilmemiş"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cinsiyet</p>
                    <p>{formData.gender || "Belirtilmemiş"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Yaş</p>
                    <p>{formData.age || "Belirtilmemiş"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Katılım Tarihi</p>
                    <p>{formData.registeredDate}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Son Aktivite</p>
                    <p>{formData.lastActive}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Adres</p>
                    <p>{formData.address || "Belirtilmemiş"}</p>
                  </div>
                </div>
                
                {formData.bio && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Hakkında</h4>
                    <p className="text-muted-foreground">{formData.bio}</p>
                  </div>
                )}
                
                {formData.favoriteCategories && formData.favoriteCategories.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Favori Kategoriler</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.favoriteCategories.map(category => (
                        <Badge key={category} variant="outline" className="bg-blue-50 text-blue-700">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Etkinlik Katılımı</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tamamlanan Etkinlikler</span>
                      <span>{formData.completedEvents} / {formData.eventCount}</span>
                    </div>
                    <Progress value={(formData.completedEvents! / formData.eventCount!) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Etkinlikler Tab */}
          <TabsContent value="events" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Katıldığı Etkinlikler</h3>
                <Badge variant="outline">Toplam: {formData.events?.length || 0}</Badge>
              </div>
              
              {formData.events && formData.events.length > 0 ? (
                <div className="space-y-3">
                  {formData.events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.category}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {getEventStatusBadge(event.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md">
                  <CalendarCheck className="mx-auto h-8 w-8 opacity-30 mb-2" />
                  <p>Bu kullanıcı henüz hiçbir etkinliğe katılmamış.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* İşlemler Tab */}
          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Kullanıcı Durumu</h3>
                <div className="flex items-center gap-3">
                  <p className="text-muted-foreground">Mevcut Durum:</p>
                  {getStatusBadge(formData.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.status === "active" && (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => setShowSuspendDialog(true)}
                        disabled={loading}
                      >
                        <MailWarning className="mr-2 h-4 w-4" />
                        Askıya Al
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-red-200 text-red-700 hover:text-red-800 hover:bg-red-50" 
                        onClick={() => setShowBlockDialog(true)}
                        disabled={loading}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Engelle
                      </Button>
                    </>
                  )}

                  {(formData.status === "suspended" || formData.status === "blocked") && (
                    <Button 
                      className="flex-1" 
                      onClick={handleActivateUser}
                      disabled={loading}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Aktifleştir
                    </Button>
                  )}
                </div>

                <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kullanıcıyı Askıya Al</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem kullanıcının geçici olarak platforma erişimini engelleyecektir. Kullanıcı bu durumda bildirim alacaktır.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="suspendReason">Askıya Alma Nedeni</Label>
                      <Textarea 
                        id="suspendReason" 
                        placeholder="Kullanıcının neden askıya alındığını açıklayın..."
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={(e) => {
                          e.preventDefault()
                          handleSuspendUser()
                        }}
                        disabled={loading}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        {loading ? "İşleniyor..." : "Askıya Al"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kullanıcıyı Engelle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem kullanıcının platforma erişimini kalıcı olarak engelleyecektir. Bu işlem geri alınabilir, ancak önemli bir karardır.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="blockReason">Engelleme Nedeni</Label>
                      <Textarea 
                        id="blockReason" 
                        placeholder="Kullanıcının neden engellendiğini açıklayın..."
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={loading}>İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={(e) => {
                          e.preventDefault()
                          handleBlockUser()
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {loading ? "İşleniyor..." : "Engelle"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Profil Yönetimi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    className="flex-1" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Düzenleme Modundasınız" : "Profili Düzenle"}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="flex-1" 
                    disabled={loading}
                    onClick={handleDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Kullanıcıyı Sil
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`/dashboard/users/${formData.id}/logs`, "_blank")}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Kullanıcı Loglarını Görüntüle
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button 
                type="button" 
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Kapat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 