"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Newspaper, Shield, Settings, LayoutDashboard, Flag } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { REPORTS } from "@/mocks/reports"

// Demo kullanıcılar
const demoUsers = [
  { id: 1, name: "Ahmet Koç", email: "ahmet@example.com", role: "üye", status: "aktif", joinDate: "2023-01-15" },
  { id: 2, name: "Ayşe Yılmaz", email: "ayse@example.com", role: "üye", status: "aktif", joinDate: "2023-02-20" },
  { id: 3, name: "Mehmet Can", email: "mehmet@example.com", role: "üye", status: "aktif", joinDate: "2023-03-10" },
]

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    label: "Kullanıcılar",
    icon: Users,
    href: "/dashboard/users",
    color: "text-violet-500",
  },
  {
    label: "Etkinlikler",
    icon: Calendar,
    href: "/dashboard/events",
    color: "text-pink-700",
  },
  {
    label: "Haberler",
    icon: Newspaper,
    href: "/dashboard/news",
    color: "text-orange-700",
  },
  {
    label: "Güvenlik",
    icon: Shield,
    href: "/dashboard/security",
    color: "text-emerald-500",
  },
  {
    label: "Ayarlar",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
  {
    label: "Raporlar",
    icon: Flag,
    href: "/dashboard/reports",
    color: "text-red-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 ">
        <Link href="/dashboard" className="mb-8 flex items-center justify-center gap-2">
          <Image
            src="/logo.avif"
            alt="SportLink Logo"
            width={100}
            height={120}
            className="rounded-lg"
          />
        </Link>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname === route.href || pathname.startsWith(`${route.href}/`)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <route.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  route.color,
                  pathname === route.href || pathname.startsWith(`${route.href}/`)
                    ? "opacity-100"
                    : "opacity-75 group-hover:opacity-100"
                )}
              />
              {route.label}
              {route.label === "Raporlar" && (
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4">
                  {REPORTS.filter((r) => r.status === "pending").length}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Kullanıcı Avatar ve Bilgileri */}
      <div className="mt-auto pt-6 border-t">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/01.png" alt="@admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Yönetici</span>
            <span className="text-xs text-muted-foreground">admin@sportlink.com</span>
          </div>
        </div>
      </div>
    </div>
  )
} 