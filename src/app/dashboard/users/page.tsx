"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { USERS } from "@/mocks";

interface User {
  id: string;
  name: string;
  email: string;
  role: "bireysel_kullanici" | "antrenor" | "kulup_uyesi";
  status: "active" | "inactive";
}

// Rol renkleri ve etiketleri
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  bireysel_kullanici: { bg: "bg-blue-100", text: "text-blue-800" },
  antrenor: { bg: "bg-green-100", text: "text-green-800" },
  kulup_uyesi: { bg: "bg-purple-100", text: "text-purple-800" },
  admin: { bg: "bg-red-100", text: "text-red-800" },
  moderator: { bg: "bg-orange-100", text: "text-orange-800" },
  user: { bg: "bg-blue-100", text: "text-blue-800" },
};

const ROLE_LABELS: Record<string, string> = {
  bireysel_kullanici: "Bireysel Kullanıcı",
  antrenor: "Antrenör",
  kulup_uyesi: "Kulüp Üyesi",
  admin: "Yönetici",
  moderator: "Moderatör",
  user: "Kullanıcı",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Convert the USERS from mock data to the expected format
  const [users, setUsers] = useState<User[]>(
    USERS.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as "bireysel_kullanici" | "antrenor" | "kulup_uyesi",
      status: user.status as "active" | "inactive",
    }))
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSendAlert = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      toast.success(`${user.name} kullanıcısına bildirim gönderildi`);
      // Burada gerçek bildirim gönderme işlemi yapılacak
      console.log(`Bildirim gönderildi: ${user.name}`);
    }
  };

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    const user = users.find((u) => u.id === userId);
    if (user) {
      toast.success(
        `${user.name} kullanıcısının rolü ${ROLE_LABELS[newRole]} olarak güncellendi`
      );
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Kullanıcı Yönetimi
        </h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="bireysel_kullanici">
                Bireysel Kullanıcı
              </SelectItem>
              <SelectItem value="antrenor">Antrenör</SelectItem>
              <SelectItem value="kulup_uyesi">Kulüp Üyesi</SelectItem>
              <SelectItem value="admin">Yönetici</SelectItem>
              <SelectItem value="moderator">Moderatör</SelectItem>
              <SelectItem value="user">Kullanıcı</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: User["role"]) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[180px] ${
                            ROLE_COLORS[user.role]?.bg || "bg-gray-100"
                          } ${ROLE_COLORS[user.role]?.text || "text-gray-800"}`}
                        >
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="bireysel_kullanici"
                            className="text-blue-800 hover:bg-blue-100"
                          >
                            Bireysel Kullanıcı
                          </SelectItem>
                          <SelectItem
                            value="antrenor"
                            className="text-green-800 hover:bg-green-100"
                          >
                            Antrenör
                          </SelectItem>
                          <SelectItem
                            value="kulup_uyesi"
                            className="text-purple-800 hover:bg-purple-100"
                          >
                            Kulüp Üyesi
                          </SelectItem>
                          <SelectItem
                            value="admin"
                            className="text-red-800 hover:bg-red-100"
                          >
                            Yönetici
                          </SelectItem>
                          <SelectItem
                            value="moderator"
                            className="text-orange-800 hover:bg-orange-100"
                          >
                            Moderatör
                          </SelectItem>
                          <SelectItem
                            value="user"
                            className="text-blue-800 hover:bg-blue-100"
                          >
                            Kullanıcı
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {user.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSendAlert(user.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
