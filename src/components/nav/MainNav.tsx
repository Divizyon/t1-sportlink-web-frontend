"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Settings, BarChart2, Flag } from "lucide-react";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const links = [
    {
      href: "/dashboard",
      label: "Ana Sayfa",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/events",
      label: "Etkinlikler",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/users",
      label: "Kullanıcılar",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/reports",
      label: "Raporlar",
      icon: <Flag className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/analytics",
      label: "Analitik",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      href: "/dashboard/settings",
      label: "Ayarlar",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {links.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          className="text-sm font-medium transition-colors hover:text-primary"
          asChild
        >
          <Link href={link.href}>
            {link.icon}
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
