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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !surname || !email || !password) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    const fullName = `${name} ${surname}`;
    
    const success = await signup({
      name: fullName,
      email,
      password,
      role: "admin",
    });

    if (success) {
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      router.push("/auth/login");
    }
  };

  return (
    <Card className="w-[400px] shadow-lg">
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
        <CardTitle className="text-center">Yeni Admin Kaydı</CardTitle>
        <CardDescription className="text-center">
          Yönetici paneline erişmek için hesap oluşturun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="name"
                placeholder="Adınız"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="surname"
                placeholder="Soyadınız"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
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
              {isLoading ? "Kaydediliyor..." : "Kaydol"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Zaten hesabınız var mı?
        </p>
        <Link href="/auth/login">
          <Button variant="link" className="p-0">
            Giriş Yap
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 