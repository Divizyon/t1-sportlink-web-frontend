"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, error, clearError, isAuthenticated } = useAuthStore();

  // isAuthenticated değiştiğinde dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard...');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      console.log('Attempting login...');
      await login(email, password);
      console.log('Login successful, showing toast...');
      toast.success("Başarıyla giriş yapıldı");
    } catch (error) {
      console.error("Login error in component:", error);
      // Hata mesajı zaten store'da set edildi
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <div className="flex justify-center pt-6">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.avif"
            alt="SportLink Logo"
            width={100}
            height={120}
            className="rounded-lg mb-2"
          />
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
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <div className="mt-6">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <Button variant="link" className="p-0">
          Şifremi Unuttum
        </Button>
        <div className="flex items-center gap-1 pt-2">
          <span className="text-sm text-muted-foreground">Hesabınız yok mu?</span>
          <Link href="/auth/register">
            <Button variant="link" className="p-0">
              Kaydol
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
