"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, MailPlus, UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "+90 555 123 4567",
    avatar: "/avatars/01.png"
  })

  // State for Admin Invite Form
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Profil güncelleme işlemi burada yapılacak
    console.log("Profil güncellendi:", profile)
    toast.success("Profil başarıyla güncellendi!")
  }

  // Function to handle admin invitation
  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteFirstName || !inviteLastName || !inviteEmail) {
      toast.error("Lütfen tüm davet alanlarını doldurun.")
      return
    }

    setIsInviting(true)
    try {
      const response = await axios.post("/api/invite-admin", { 
        firstName: inviteFirstName,
        lastName: inviteLastName,
        email: inviteEmail 
      })
      
      // Assuming API returns a success message or status
      if (response.status === 200 || response.status === 201) { 
        toast.success(`${inviteFirstName} ${inviteLastName} (${inviteEmail}) başarıyla davet edildi!`)
        // Clear fields after successful invite
        setInviteFirstName("")
        setInviteLastName("")
        setInviteEmail("")
      } else {
        // Handle potential non-error statuses if API behaves differently
        toast.warning(response.data.message || "Davet gönderilirken bir sorun oluştu.")
      }
    } catch (error: any) {
      console.error("Admin davet hatası:", error)
      // More specific error from backend if available
      const errorMessage = error.response?.data?.message || "Davet gönderilemedi. Lütfen tekrar deneyin."
      toast.error(errorMessage)
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ayarlar</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil Ayarları</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Fotoğraf Değiştir
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Değişiklikleri Kaydet</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Güvenlik Ayarları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Mevcut Şifre</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password">Yeni Şifre</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end">
                <Button>Şifreyi Güncelle</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Invite Card - Added New Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Admin Daveti
            </CardTitle>
            <CardDescription>
              Yeni bir yöneticiyi platforma katılmaya davet edin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invite-first-name">İsim</Label>
                  <Input
                    id="invite-first-name"
                    value={inviteFirstName}
                    onChange={(e) => setInviteFirstName(e.target.value)}
                    placeholder="Ahmet"
                    disabled={isInviting}
                  />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="invite-last-name">Soyisim</Label>
                  <Input
                    id="invite-last-name"
                    value={inviteLastName}
                    onChange={(e) => setInviteLastName(e.target.value)}
                    placeholder="Yılmaz"
                    disabled={isInviting}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-email">E-posta Adresi</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ahmet.yilmaz@example.com"
                  disabled={isInviting}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isInviting}>
                  {isInviting ? (
                    <> 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Davet Gönderiliyor...
                    </>
                   ) : (
                    <> 
                      <MailPlus className="mr-2 h-4 w-4"/> Davet Gönder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 