"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"

export function Navbar() {
  const { user } = useAuthStore()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center mr-6">
            <Image
              src="/logo.png"
              alt="SportLink Logo"
              width={100}
              height={0}
              className="object-contain"
            />
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}`} 
                    alt={user?.first_name || "User"} 
                  />
                  <AvatarFallback>
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
} 