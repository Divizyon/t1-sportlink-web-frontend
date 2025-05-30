"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { Filter } from "lucide-react";
import { WarningModal } from "@/components/modals/WarningModal";
import {
  UserDetailModal,
  sampleUser,
} from "@/components/modals/UserDetailModal";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CheckedState } from "@radix-ui/react-checkbox";
import Cookies from "js-cookie";
import { RefreshCw } from "lucide-react";
import { useSingleFetch } from "@/hooks";
// import { columns } from "./components/columns"; // Commented out missing import
import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "bireysel_kullanici" | "antrenor" | "kulup_uyesi";
  status: "active" | "inactive";
  isLoading?: boolean; // Add isLoading flag
}

// Rol renkleri ve etiketleri
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  bireysel_kullanici: { bg: "bg-blue-100", text: "text-blue-800" },
  antrenor: { bg: "bg-yellow-100", text: "text-yellow-800" },
  kulup_uyesi: { bg: "bg-purple-100", text: "text-purple-800" },
};

// Restore ROLE_LABELS
const ROLE_LABELS: Record<string, string> = {
  bireysel_kullanici: "Bireysel Kullanıcı",
  antrenor: "Antrenör",
  kulup_uyesi: "Kulüp Üyesi",
};

interface UsersPageProps {
  searchParams: any;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  console.log("--- UsersPage Component Start ---"); // Log component start

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedUserForWarning, setSelectedUserForWarning] =
    useState<User | null>(null);
  // Use a ref to track if we've already fetched data to prevent double fetching
  const hasFetched = useRef(false);

  // Map backend role to frontend role
  const mapUserRole = (backendRole?: string): User["role"] => {
    if (!backendRole) return "bireysel_kullanici";

    // Convert to lowercase for case-insensitive comparison
    const roleLower = backendRole.toLowerCase();

    // Direct mappings for common role formats
    if (
      roleLower === "bireysel_kullanici" ||
      roleLower === "üye" ||
      roleLower === "user"
    ) {
      return "bireysel_kullanici";
    }

    if (
      roleLower === "antrenor" ||
      roleLower === "admin" ||
      roleLower === "staff"
    ) {
      return "antrenor";
    }

    if (
      roleLower === "kulup_uyesi" ||
      roleLower === "kulüp üyesi" ||
      roleLower === "member"
    ) {
      return "kulup_uyesi";
    }

    // For other unknown roles, default to bireysel_kullanici
    console.log(`Unknown role detected: ${backendRole}, using default`);
    return "bireysel_kullanici";
  };

  // Fetch users from API as a useCallback
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

      const response = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session-based auth
      });

      if (response.status === 401) {
        setError(
          "Oturum süresi doldu veya yetkiniz yok. Lütfen tekrar giriş yapın."
        );
        setUsers([]);
        toast.error("Yetkilendirme hatası, lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        // Check both possible response formats
        const userList = Array.isArray(data.data?.users)
          ? data.data.users
          : Array.isArray(data.data?.USER_DETAILS)
          ? data.data.USER_DETAILS
          : null;

        if (userList) {
          // Map backend user data to frontend format
          const mappedUsers: User[] = userList.map((user: any) => ({
            id: user.id?.toString() || String(Math.random()),
            name:
              user.name ||
              `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
              "Unknown Name",
            email: user.email || "no-email@example.com",
            role: mapUserRole(user.role),
            status: user.status === "aktif" ? "active" : "inactive",
          }));

          setUsers(mappedUsers);
          toast.success("Kullanıcı listesi güncellendi");
        } else {
          setError("Sunucudan gelen veri formatı hatalı.");
          setUsers([]);
          toast.error("API veri formatı hatalı, kullanıcılar gösterilemiyor");
        }
      } else {
        setError(
          "Kullanıcı verileri alınamadı: " + (data.message || "Bilinmeyen hata")
        );
        setUsers([]);
        toast.error("API hatası, kullanıcılar gösterilemiyor");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")
        ) {
          setError(
            "Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
          );
          toast.error("Sunucuya bağlanılamadı");
        } else if (err.message.includes("Timeout")) {
          setError(
            "Zaman aşımı: Sunucu yanıt vermek için çok uzun süre bekledi. Lütfen daha sonra tekrar deneyin."
          );
          toast.error("Bağlantı zaman aşımına uğradı");
        } else if (err.message.includes("API error: 500")) {
          setError(
            "Sunucu hatası: İşlem sırasında bir sorun oluştu. Teknik ekip bu konuda bilgilendirildi."
          );
          toast.error("Sunucu hatası");
        } else if (err.message.includes("API error: 403")) {
          setError(
            "Erişim reddedildi: Bu verilere erişim için yetkiniz bulunmuyor."
          );
          toast.error("Erişim reddedildi");
        } else if (err.message.includes("API error: 404")) {
          setError("Kaynak bulunamadı: İstenen veriler sunucuda bulunamadı.");
          toast.error("Kullanıcı verileri bulunamadı");
        } else {
          setError(`Bir hata oluştu: ${err.message}`);
          toast.error(`Hata: ${err.message}`);
        }
      } else {
        setError(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
        toast.error("Bilinmeyen bir hata oluştu");
      }

      // Always set users to empty array when there's an error - do not fall back to any mock data
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use our single fetch hook to prevent double fetching
  useSingleFetch(fetchUsers, "users-page-initial-fetch");

  // Track previous filter values to avoid unnecessary fetches
  const prevFiltersRef = useRef({
    searchQuery,
    selectedRoles,
    selectedStatuses,
  });

  // Handle filter changes after initial load
  useEffect(() => {
    // Skip first render (already handled by useSingleFetch)
    if (
      prevFiltersRef.current.searchQuery === "" &&
      prevFiltersRef.current.selectedRoles.length === 0 &&
      prevFiltersRef.current.selectedStatuses.length === 0
    ) {
      // Update reference to current values
      prevFiltersRef.current = {
        searchQuery,
        selectedRoles,
        selectedStatuses,
      };
      return;
    }

    // Check if filters actually changed
    if (
      prevFiltersRef.current.searchQuery !== searchQuery ||
      prevFiltersRef.current.selectedRoles.length !== selectedRoles.length ||
      prevFiltersRef.current.selectedStatuses.length !== selectedStatuses.length
    ) {
      // Update our reference
      prevFiltersRef.current = {
        searchQuery,
        selectedRoles,
        selectedStatuses,
      };

      // Debounce to prevent rapid API calls
      const debounceTimer = setTimeout(() => {
        console.log("Filters changed, fetching new user data...");
        fetchUsers();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, selectedRoles, selectedStatuses, fetchUsers]);

  console.log("--- UsersPage Before Return --- users state:", users);

  // State for user modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter((user) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery) ||
      user.id.includes(normalizedQuery) || // Match ID directly
      `#${user.id}`.includes(normalizedQuery); // Match ID with # prefix

    const matchesSelectedRole =
      selectedRoles.length === 0 || selectedRoles.includes(user.role);
    const matchesSelectedStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(user.status);
    return matchesSearch && matchesSelectedRole && matchesSelectedStatus;
  });

  const handleSendAlert = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      toast.success(`${user.name} kullanıcısına bildirim gönderildi`);
      // Burada gerçek bildirim gönderme işlemi yapılacak
      console.log(`Bildirim gönderildi: ${user.name}`);
    }
  };

  const handleUserStatusChange = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          toast.success(
            `${user.name} kullanıcısının durumu ${
              newStatus === "active" ? "Aktif" : "Devre Dışı"
            } olarak güncellendi`
          );
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  const handleOpenWarningModal = (user: User) => {
    setSelectedUserForWarning(user);
    setIsWarningModalOpen(true);
  };

  const handleSendWarning = (message: string) => {
    if (!selectedUserForWarning) return;

    toast.success(
      `${selectedUserForWarning.name} kullanıcısına uyarı gönderildi.`
    );
    console.log(
      `Uyarı gönderildi: Kullanıcı ID: ${selectedUserForWarning.id}, Mesaj: ${message}`
    );
    // TODO: Implement actual API call to send warning

    setIsWarningModalOpen(false);
    setSelectedUserForWarning(null);
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

  // Handler for Role Checkbox changes
  const handleRoleCheckedChange = (role: string) => (checked: CheckedState) => {
    setSelectedRoles(
      (prev) =>
        checked === true
          ? [...prev, role] // Add role
          : prev.filter((r) => r !== role) // Remove role
    );
  };

  // Handler for Status Checkbox changes
  const handleStatusCheckedChange =
    (status: string) => (checked: CheckedState) => {
      setSelectedStatuses(
        (prev) =>
          checked === true
            ? [...prev, status] // Add status
            : prev.filter((s) => s !== status) // Remove status
      );
    };

  // Function to fetch user details when clicking on a user
  const fetchUserDetails = async (user: User) => {
    // Create loading state
    const loadingUser = {
      ...user,
      isLoading: true,
    };

    // Update state and open modal
    setSelectedUser(loadingUser);
    setUserModalOpen(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create enriched user for display
      const detailedUser = {
        ...sampleUser,
        id: user.id,
        name: user.name,
        email: user.email,
        isLoading: false,
      };

      setSelectedUser(detailedUser);
    } catch (error) {
      console.error("Error fetching user details:", error);

      // Fallback to basic info
      setSelectedUser({
        ...user,
        isLoading: false,
      });
    }
  };

  const handleOpenUserDetails = (user: User) => {
    fetchUserDetails(user);
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };

  // Handler for deleting a user
  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    // Confirmation dialog
    if (
      window.confirm(
        `${userToDelete.name} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
      )
    ) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      handleCloseUserModal(); // Close the modal after deletion
      toast.success(`${userToDelete.name} kullanıcısı başarıyla silindi.`);
      console.log(`Kullanıcı silindi: ID ${userId}`);
      // TODO: Implement actual API call to delete user from backend
    }
  };

  const refreshUsers = () => {
    console.log("Manual refresh triggered...");
    setLoading(true);
    setError(null);

    const fetchUsers = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

        const response = await fetch(`${apiUrl}/users`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session-based auth
        });

        if (response.status === 401) {
          setError(
            "Oturum süresi doldu veya yetkiniz yok. Lütfen tekrar giriş yapın."
          );
          setUsers([]);
          toast.error("Yetkilendirme hatası, lütfen tekrar giriş yapın.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === "success") {
          // Check both possible response formats
          const userList = Array.isArray(data.data?.users)
            ? data.data.users
            : Array.isArray(data.data?.USER_DETAILS)
            ? data.data.USER_DETAILS
            : null;

          if (userList) {
            // Map backend user data to frontend format
            const mappedUsers: User[] = userList.map((user: any) => ({
              id: user.id?.toString() || String(Math.random()),
              name:
                user.name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                "Unknown Name",
              email: user.email || "no-email@example.com",
              role: mapUserRole(user.role),
              status: user.status === "aktif" ? "active" : "inactive",
            }));

            setUsers(mappedUsers);
            toast.success("Kullanıcı listesi güncellendi");
          } else {
            setError("Sunucudan gelen veri formatı hatalı.");
            setUsers([]);
            toast.error("API veri formatı hatalı, kullanıcılar gösterilemiyor");
          }
        } else {
          setError(
            "Kullanıcı verileri alınamadı: " +
              (data.message || "Bilinmeyen hata")
          );
          setUsers([]);
          toast.error("API hatası, kullanıcılar gösterilemiyor");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        // Provide more specific error messages based on the error type
        if (err instanceof Error) {
          if (
            err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch")
          ) {
            setError(
              "Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
            );
            toast.error("Sunucuya bağlanılamadı");
          } else if (err.message.includes("Timeout")) {
            setError(
              "Zaman aşımı: Sunucu yanıt vermek için çok uzun süre bekledi. Lütfen daha sonra tekrar deneyin."
            );
            toast.error("Bağlantı zaman aşımına uğradı");
          } else if (err.message.includes("API error: 500")) {
            setError(
              "Sunucu hatası: İşlem sırasında bir sorun oluştu. Teknik ekip bu konuda bilgilendirildi."
            );
            toast.error("Sunucu hatası");
          } else if (err.message.includes("API error: 403")) {
            setError(
              "Erişim reddedildi: Bu verilere erişim için yetkiniz bulunmuyor."
            );
            toast.error("Erişim reddedildi");
          } else if (err.message.includes("API error: 404")) {
            setError("Kaynak bulunamadı: İstenen veriler sunucuda bulunamadı.");
            toast.error("Kullanıcı verileri bulunamadı");
          } else {
            setError(`Bir hata oluştu: ${err.message}`);
            toast.error(`Hata: ${err.message}`);
          }
        } else {
          setError(
            "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
          );
          toast.error("Bilinmeyen bir hata oluştu");
        }

        // Always set users to empty array when there's an error - do not fall back to any mock data
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Kullanıcı Yönetimi
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-[300px]"
          />
          {/* Sadece Combined Filter Dropdown kalacak */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
                {/* Optional: Show badge if filters active */}
                {(selectedRoles.length > 0 || selectedStatuses.length > 0) && (
                  <Badge variant="secondary" className="ml-2 rounded-full">
                    {selectedRoles.length + selectedStatuses.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Role Göre Filtrele</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedRoles.includes("bireysel_kullanici")}
                onCheckedChange={handleRoleCheckedChange("bireysel_kullanici")}
              >
                Bireysel Kullanıcı
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRoles.includes("antrenor")}
                onCheckedChange={handleRoleCheckedChange("antrenor")}
              >
                Antrenör
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRoles.includes("kulup_uyesi")}
                onCheckedChange={handleRoleCheckedChange("kulup_uyesi")}
              >
                Kulüp Üyesi
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Duruma Göre Filtrele</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes("active")}
                onCheckedChange={handleStatusCheckedChange("active")}
              >
                Aktif
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes("inactive")}
                onCheckedChange={handleStatusCheckedChange("inactive")}
              >
                Devre Dışı
              </DropdownMenuCheckboxItem>
              {/* Optional: Clear Filters */}
              {(selectedRoles.length > 0 || selectedStatuses.length > 0) && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    size="sm"
                    onClick={() => {
                      setSelectedRoles([]);
                      setSelectedStatuses([]);
                    }}
                  >
                    Filtreleri Temizle
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={refreshUsers} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Yenile
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8 text-red-500">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p>{error}</p>
              <Button variant="outline" onClick={refreshUsers} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Kullanıcı bulunamadı</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="grid gap-4 md:hidden">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{user.name}</div>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                      >
                        {user.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="flex items-center justify-between">
                      <Select
                        value={user.role}
                        onValueChange={(value: User["role"]) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[180px] ${ROLE_COLORS[user.role].bg} ${
                            ROLE_COLORS[user.role].text
                          }`}
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
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSendAlert(user.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {!loading && !error && (
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </TableCell>
                    </TableRow>
                  )}
                  {error && !loading && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-red-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <AlertTriangle className="h-8 w-8" />
                          <p>{error}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        <p>Gösterilecek kullanıcı yok</p>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    filteredUsers.length > 0 &&
                    filteredUsers.map((user) => {
                      return (
                        <TableRow
                          key={user.id}
                          onClick={() => handleOpenUserDetails(user)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">{`#${user.id}`}</TableCell>
                          <TableCell className="font-medium">
                            {/* Make name clickable */}
                            <button
                              className={`text-left hover:underline ${
                                ROLE_COLORS[user.role]?.text || "text-gray-900"
                              }`}
                            >
                              {user.name}
                            </button>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 rounded-md ${
                                ROLE_COLORS[user.role]?.bg || "bg-transparent"
                              } ${
                                ROLE_COLORS[user.role]?.text || "text-gray-900"
                              }`}
                            >
                              {user.email}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value: User["role"]) =>
                                handleRoleChange(user.id, value)
                              }
                            >
                              <SelectTrigger
                                className={`w-[180px] ${
                                  ROLE_COLORS[user.role].bg
                                } ${ROLE_COLORS[user.role].text}`}
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
                                  className="text-yellow-800 hover:bg-yellow-100"
                                >
                                  Antrenör
                                </SelectItem>
                                <SelectItem
                                  value="kulup_uyesi"
                                  className="text-purple-800 hover:bg-purple-100"
                                >
                                  Kulüp Üyesi
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "border-green-200 bg-green-100 text-green-800"
                                  : "border-gray-200 bg-gray-100 text-gray-800"
                              }
                            >
                              {user.status === "active"
                                ? "Aktif"
                                : "Devre Dışı"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {/* Actions Column */}
                            <div className="flex items-center justify-end space-x-2">
                              {/* Warning Button */}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click when clicking button
                                  handleOpenWarningModal(user);
                                }}
                                title="Uyarı Gönder"
                              >
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              </Button>

                              {/* Status Switch */}
                              <Switch
                                checked={user.status === "active"}
                                onCheckedChange={() =>
                                  handleUserStatusChange(user.id)
                                }
                                onClick={(e) => e.stopPropagation()} // Prevent row click when clicking switch
                                aria-label="Kullanıcı durumu"
                                title={
                                  user.status === "active"
                                    ? "Kullanıcıyı devre dışı bırak"
                                    : "Kullanıcıyı aktif et"
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <WarningModal
        isOpen={isWarningModalOpen}
        onOpenChange={setIsWarningModalOpen}
        onSendWarning={handleSendWarning} // Corrected prop
        userName={selectedUserForWarning?.name || ""}
      />
      {/* Bilgi Mesajı */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true" // Add aria-hidden for decorative icons
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">
            Kullanıcı detayına ulaşmak için lütfen kullanıcı adına tıklayınız.
          </p>
        </div>
      </div>
      {/* Render User Details Modal */}
      {selectedUser && (
        <UserDetailModal
          open={userModalOpen}
          onOpenChange={handleCloseUserModal}
          userId={selectedUser.id}
        />
      )}
    </div>
  );
}
