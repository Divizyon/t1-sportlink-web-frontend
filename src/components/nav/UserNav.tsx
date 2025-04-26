"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function UserNav() {
  const { user, logout, loadProfile } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        await loadProfile();
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
        toast.error("Profil bilgileri yüklenemedi");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [loadProfile, user]);

  // Get first letter(s) of name for avatar fallback
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Başarıyla çıkış yapıldı");
      router.push("/auth/login");
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  // Kullanıcı adını oluştur
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : "";

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
              8
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Bildirimler</p>
              <p className="text-xs leading-none text-muted-foreground">8 yeni bildiriminiz var</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 1</p>
                  <p className="text-xs text-muted-foreground">2 dakika önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 2</p>
                  <p className="text-xs text-muted-foreground">15 dakika önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 3</p>
                  <p className="text-xs text-muted-foreground">30 dakika önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 4</p>
                  <p className="text-xs text-muted-foreground">1 saat önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 5</p>
                  <p className="text-xs text-muted-foreground">2 saat önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 6</p>
                  <p className="text-xs text-muted-foreground">3 saat önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 7</p>
                  <p className="text-xs text-muted-foreground">5 saat önce</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Bildirim 8</p>
                  <p className="text-xs text-muted-foreground">1 gün önce</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(fullName || "User")}&format=svg`}
                alt={fullName || "User"}
              />
              <AvatarFallback>
                {fullName ? getInitials(fullName) : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {fullName || "Kullanıcı"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "kullanici@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
