"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { getProfile, updateProfile, uploadAvatar, changePassword, inviteAdmin } from "@/services/api"

interface ProfileForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar: string
}

interface PasswordData {
  current_password: string
  new_password: string
  confirm_password: string
}

interface AdminInviteForm {
  first_name: string
  last_name: string
  email: string
  password: string
}

export default function SettingsPage() {
  const { user, updateProfile: updateStoreProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isInvitingAdmin, setIsInvitingAdmin] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar: ""
  })

  const [passwordForm, setPasswordForm] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  const [adminInviteForm, setAdminInviteForm] = useState<AdminInviteForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })

  // Profil bilgilerini yükle
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getProfile();
        console.log('Yüklenen profil bilgileri:', data);
        
        if (data) {
          // Form state'ini güncelle
          setProfileForm({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar || ""
          });

          // Auth store'u güncelle
          updateStoreProfile({
            ...data,
            role: user?.role || 'user' // Mevcut rolü koru
          });
        }
      } catch (error) {
        console.error('Profil yükleme hatası:', error);
        toast.error("Profil bilgileri yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Profil güncelleme
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(profileForm);
      
      // Auth store'u güncelle
      updateStoreProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar: profileForm.avatar
      });
      
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar yükleme
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin')
      return
    }

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır')
      return
    }

    try {
      setIsUploading(true)
      console.log('Avatar yükleniyor:', file.name);
      
      const response = await uploadAvatar(file)
      console.log('Avatar yükleme yanıtı:', response);

      if (response && response.avatarUrl) {
        // Store'u güncelle
        updateStoreProfile({
          avatar: response.avatarUrl
        });
        
        setProfileForm(prev => ({
          ...prev,
          avatar: response.avatarUrl
        }));

        toast.success('Profil fotoğrafı başarıyla güncellendi');
      }
    } catch (error: any) {
      console.error('Avatar yükleme hatası:', error);
      toast.error(error.message || 'Profil fotoğrafı güncellenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
      // Input'u temizle
      if (event.target) {
        event.target.value = '';
      }
    }
  }

  // Şifre değiştirme
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalıdır");
      return;
    }

    if (passwordForm.new_password === passwordForm.current_password) {
      toast.error("Yeni şifre mevcut şifre ile aynı olamaz");
      return;
    }

    setIsChangingPassword(true);

    try {
      console.log('Şifre değiştirme formu:', {
        ...passwordForm,
        current_password: '***',
        new_password: '***',
        confirm_password: '***'
      });

      await changePassword(passwordForm);
      
      toast.success("Şifre başarıyla değiştirildi");
      
      // Formu sıfırla
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
      
      // Göster/gizle durumunu sıfırla
      setShowPassword({
        current: false,
        new: false,
        confirm: false
      });
    } catch (error: any) {
      console.error('Şifre değiştirme hatası:', error);
      toast.error(error.message || "Şifre değiştirilirken bir hata oluştu");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Admin davet etme
  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInvitingAdmin(true)

    try {
      await inviteAdmin(adminInviteForm)
      toast.success("Admin başarıyla davet edildi")
      setAdminInviteForm({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
      })
    } catch (error) {
      toast.error("Admin davet edilirken bir hata oluştu")
    } finally {
      setIsInvitingAdmin(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
            <CardDescription>
              Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileForm.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profileForm.first_name + " " + profileForm.last_name)} />
                  <AvatarFallback>
                    {profileForm.first_name?.charAt(0)}{profileForm.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profil Fotoğrafı</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG veya GIF. Maksimum 5MB.
                  </p>
                </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Ad</Label>
                  <Input
                    id="first_name"
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Soyad</Label>
                  <Input
                    id="last_name"
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

    

        <Card>
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
            <CardDescription>
              Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirmenizi öneririz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    autoComplete="current-password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Yeni Şifre (Tekrar)</Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Şifre Değiştiriliyor...
                    </>
                  ) : (
                    "Şifreyi Değiştir"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin Davet Et</CardTitle>
            <CardDescription>
              Yeni bir admin kullanıcısı davet edin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName">Ad</Label>
                  <Input
                    id="adminFirstName"
                    placeholder="Admin adı"
                    value={adminInviteForm.first_name}
                    onChange={(e) => setAdminInviteForm({ ...adminInviteForm, first_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminLastName">Soyad</Label>
                  <Input
                    id="adminLastName"
                    placeholder="Admin soyadı"
                    value={adminInviteForm.last_name}
                    onChange={(e) => setAdminInviteForm({ ...adminInviteForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">E-posta</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="ornek@email.com"
                  value={adminInviteForm.email}
                  onChange={(e) => setAdminInviteForm({ ...adminInviteForm, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Şifre</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Güçlü bir şifre belirleyin"
                  value={adminInviteForm.password}
                  onChange={(e) => setAdminInviteForm({ ...adminInviteForm, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isInvitingAdmin}>
                  {isInvitingAdmin ? (
                    <> 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Davet Gönderiliyor...
                    </>
                   ) : (
                    <> 
                      <UserPlus className="mr-2 h-4 w-4" />
                      Admin Davet Et
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