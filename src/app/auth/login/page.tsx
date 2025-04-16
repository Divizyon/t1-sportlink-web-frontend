"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Burada gerçek bir API çağrısı yapılabilir
    setTimeout(() => {
      setIsLoading(false)
      // Basit doğrulama için örnek
      if (email && password) {
        // Başarılı giriş
        toast.success("Başarılı giriş yapıldı")
        // Giriş bilgisini cookie'de sakla (7 gün geçerli)
        Cookies.set('isLoggedIn', 'true', { expires: 7 })
        // Dashboard'a yönlendir
        router.push("/dashboard")
      } else {
        // Başarısız giriş
        toast.error("Geçersiz e-posta veya şifre")
      }
    }, 1000)
  }

  return (
    <Card className="w-[350px] shadow-lg">
      <div className="flex justify-center pt-6">
        <div className="flex flex-col items-center">
          <div className="bg-primary rounded-full p-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M2 19h20"></path>
              <path d="M12 3v16"></path>
              <path d="M9 10a3 3 0 1 0 6 0 3 3 0 1 0 -6 0"></path>
              <path d="M5 19c.7 -1.7 3.3 -3 7 -3s6.3 1.3 7 3"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">Spor Yönetim Sistemi</h1>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-center">Giriş Yap</CardTitle>
        <CardDescription className="text-center">
          Admin paneline erişmek için giriş yapın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="email"
                placeholder="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Şifre"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="w-full">
          Şifremi Unuttum
        </Button>
      </CardFooter>
    </Card>
  )
} 