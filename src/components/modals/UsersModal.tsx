"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, UserX, Edit, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UsersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock kullanıcı verileri
const mockUsers = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", role: "Admin", status: "Aktif" },
  { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", role: "Moderatör", status: "Aktif" },
  { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", role: "Kullanıcı", status: "Aktif" },
  { id: 4, name: "Zeynep Çelik", email: "zeynep@example.com", role: "Kullanıcı", status: "Beklemede" },
  { id: 5, name: "Ali Öztürk", email: "ali@example.com", role: "Kullanıcı", status: "Engellendi" },
]

export function UsersModal({ open, onOpenChange }: UsersModalProps) {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddUser = () => {
    // Yeni kullanıcı ekleme işlemi
    alert("Yeni kullanıcı ekle")
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const handleEditUser = (id: number) => {
    // Kullanıcı düzenleme işlemi
    alert(`${id} ID'li kullanıcıyı düzenle`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Kullanıcı Yönetimi</DialogTitle>
          <DialogDescription>
            Sistem kullanıcılarını görüntüleyin, düzenleyin veya silin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Kullanıcı ara..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Kullanıcı Ekle
          </Button>
        </div>
        
        <div className="max-h-[400px] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">İsim</th>
                <th className="text-left py-2 px-3 font-medium">E-posta</th>
                <th className="text-left py-2 px-3 font-medium">Rol</th>
                <th className="text-left py-2 px-3 font-medium">Durum</th>
                <th className="text-right py-2 px-3 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">
                    <Badge variant={user.role === "Admin" ? "default" : "outline"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-2 px-3">
                    <Badge 
                      variant={
                        user.status === "Aktif" ? "success" :
                        user.status === "Beklemede" ? "warning" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-muted-foreground">
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 