"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Cookies from "js-cookie"

export default function LogoutPage() {
  const router = useRouter()

  const handleLogout = () => {
    // Cookie'den giriş bilgisini kaldır
    Cookies.remove('isLoggedIn')
    
    // Çıkış bildirimini göster
    toast.success("Başarıyla çıkış yapıldı")
    
    // Ana sayfaya yönlendir
    router.push("/auth/login")
  }

  const handleCancel = () => {
    // Kullanıcıyı dashboard'a yönlendir
    router.push("/dashboard")
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Çıkış Yap</CardTitle>
          <CardDescription>
            Hesabınızdan çıkış yapmak istediğinize emin misiniz?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Çıkış yaptıktan sonra tekrar giriş yapmanız gerekecektir. İşlemlerinizi kaybetmemek için tüm değişiklikleri kaydettiğinizden emin olun.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            İptal
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 