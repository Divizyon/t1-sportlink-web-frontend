"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Newspaper, Shield, Settings, LayoutDashboard } from "lucide-react"

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
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <Link href="/dashboard" className="mb-8 flex items-center">
          <h1 className="text-xl font-semibold">
            Admin Panel
          </h1>
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
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
} 