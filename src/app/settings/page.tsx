"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword, updateProfile, uploadAvatar } from "@/services/api"
import { useAuthStore } from "@/store/authStore"

const profileFormSchema = z.object({
  first_name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  last_name: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
})

const passwordFormSchema = z.object({
  current_password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  new_password: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Şifreler eşleşmiyor",
  path: ["confirm_password"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await updateProfile(data)
      setUser(response)
      toast.success("Profil bilgileriniz başarıyla güncellendi")

      // Email değişikliği varsa oturumu kapat
      if (user && user.email !== data.email) {
        toast.success("Email adresiniz değiştirildi. Lütfen yeni email adresiniz ile tekrar giriş yapın.")
        await useAuthStore.getState().logout()
        window.location.href = "/auth/login"
      }
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu")
      console.error("Profil güncelleme hatası:", error)
    }
  }

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword(data)
      toast.success("Şifreniz başarıyla değiştirildi")
      passwordForm.reset()
    } catch (error) {
      toast.error("Şifre değiştirilirken bir hata oluştu")
      console.error("Şifre değiştirme hatası:", error)
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsAvatarUploading(true)
      const response = await uploadAvatar(file)
      setUser({ ...user, avatar: response.data.avatar })
      toast.success("Profil fotoğrafınız başarıyla güncellendi")
    } catch (error) {
      toast.error("Profil fotoğrafı yüklenirken bir hata oluştu")
      console.error("Avatar yükleme hatası:", error)
    } finally {
      setIsAvatarUploading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profil</h3>
          <p className="text-sm text-muted-foreground">
            Profil bilgilerinizi buradan güncelleyebilirsiniz.
          </p>
        </div>

        {/* Avatar Yükleme */}
        <div className="space-y-2">
          <Label htmlFor="avatar">Profil Fotoğrafı</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isAvatarUploading}
          />
        </div>

        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">İsim</Label>
            <Input
              id="first_name"
              {...profileForm.register("first_name")}
              placeholder="İsminizi girin"
            />
            {profileForm.formState.errors.first_name && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.first_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Soyisim</Label>
            <Input
              id="last_name"
              {...profileForm.register("last_name")}
              placeholder="Soyisminizi girin"
            />
            {profileForm.formState.errors.last_name && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.last_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...profileForm.register("email")}
              placeholder="Email adresinizi girin"
            />
            {profileForm.formState.errors.email && (
              <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Şifre Değiştir</h3>
          <p className="text-sm text-muted-foreground">
            Hesap şifrenizi buradan değiştirebilirsiniz.
          </p>
        </div>

        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Mevcut Şifre</Label>
            <Input
              id="current_password"
              type="password"
              {...passwordForm.register("current_password")}
              placeholder="Mevcut şifrenizi girin"
            />
            {passwordForm.formState.errors.current_password && (
              <p className="text-sm text-red-500">{passwordForm.formState.errors.current_password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">Yeni Şifre</Label>
            <Input
              id="new_password"
              type="password"
              {...passwordForm.register("new_password")}
              placeholder="Yeni şifrenizi girin"
            />
            {passwordForm.formState.errors.new_password && (
              <p className="text-sm text-red-500">{passwordForm.formState.errors.new_password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Yeni Şifre (Tekrar)</Label>
            <Input
              id="confirm_password"
              type="password"
              {...passwordForm.register("confirm_password")}
              placeholder="Yeni şifrenizi tekrar girin"
            />
            {passwordForm.formState.errors.confirm_password && (
              <p className="text-sm text-red-500">{passwordForm.formState.errors.confirm_password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
          </Button>
        </form>
      </div>
    </div>
  )
} 