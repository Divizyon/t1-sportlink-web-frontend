"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  lastEvent: string
  amount?: string
}

interface RecentSalesProps {
  onUserSelect?: (user: User) => void
}

export function RecentSales({ onUserSelect }: RecentSalesProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true)
    
    // Demo verilerini yükleme simülasyonu
    setTimeout(() => {
      const demoUsers: User[] = [
        {
          id: "usr-1",
          name: "Zeynep Yılmaz",
          email: "zeynep@example.com",
          avatar: "/avatars/01.png",
          lastEvent: "Sabah Koşusu",
          amount: "₺120"
        },
        {
          id: "usr-2",
          name: "Ahmet Demir",
          email: "ahmet@example.com",
          avatar: "/avatars/02.png",
          lastEvent: "Basketbol Turnuvası",
          amount: "₺225"
        },
        {
          id: "usr-3",
          name: "Ayşe Kaya",
          email: "ayse@example.com",
          avatar: "/avatars/03.png",
          lastEvent: "Yüzme Etkinliği",
          amount: "₺150"
        },
        {
          id: "usr-4",
          name: "Mehmet Öz",
          email: "mehmet@example.com",
          avatar: "/avatars/04.png",
          lastEvent: "Yoga Dersi",
          amount: "₺90"
        },
        {
          id: "usr-5",
          name: "Elif Şahin",
          email: "elif@example.com",
          avatar: "/avatars/05.png",
          lastEvent: "Akşam Bisiklet Turu",
          amount: "₺75"
        }
      ]
      
      setUsers(demoUsers)
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="ml-auto h-4 w-[50px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md -mx-2"
          onClick={() => onUserSelect && onUserSelect(user)}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <div className="text-sm text-muted-foreground mb-1">{user.lastEvent}</div>
            {user.amount && <div className="text-sm">{user.amount}</div>}
          </div>
        </div>
      ))}
    </div>
  )
} 