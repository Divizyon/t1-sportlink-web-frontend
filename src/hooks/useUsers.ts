import { useState, useEffect, useMemo } from "react";
import { User } from "@/types";
import { USERS } from "@/mocks/users";
import { sortUsersByActivity } from "@/lib/userUtils";

interface UserFilters {
  status?: string | string[];
  role?: string | string[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function useUsers(initialFilters: UserFilters = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // Load users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Try to fetch from backend first
        try {
          const response = await fetch(
            "http://localhost:3000/api/users/details",
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              credentials: "include", // Include cookies for session-based auth
            }
          );

          // Immediately fall back to mock data if we get a 401
          if (response.status === 401) {
            console.warn(
              "Authentication failed (401 Unauthorized), using mock data"
            );
            setUsers(USERS);
            setLoading(false);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && Array.isArray(data.data?.users)) {
              // Map backend data format to frontend format
              const mappedUsers = data.data.users.map((user: any) => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                status: user.status || "active",
                avatar: user.avatar_url || "/avatars/default.png",
                phone: user.phone || "",
                role: user.role || "user",
                joinDate: new Date(user.created_at).toISOString().split("T")[0],
                lastActive: user.last_login_at || new Date().toISOString(),
                eventCount: user.event_count || 0,
                completedEvents: user.completed_events || 0,
              }));

              setUsers(mappedUsers);
              setLoading(false);
              return;
            }
          }
          throw new Error("API returned invalid format");
        } catch (apiError) {
          console.warn(
            "Failed to fetch users from API, using mock data:",
            apiError
          );

          // Fallback to mock data if API fails
          setUsers(USERS);
          setLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch users")
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters to users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter by status
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          if (
            filters.status.length > 0 &&
            !filters.status.includes(user.status)
          ) {
            return false;
          }
        } else if (filters.status !== "all" && user.status !== filters.status) {
          return false;
        }
      }

      // Filter by role
      if (filters.role) {
        if (Array.isArray(filters.role)) {
          if (filters.role.length > 0 && !filters.role.includes(user.role)) {
            return false;
          }
        } else if (filters.role !== "all" && user.role !== filters.role) {
          return false;
        }
      }

      // Filter by search term
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by date range (join date)
      if (filters.dateRange) {
        const joinDate = new Date(user.joinDate);
        if (
          joinDate < filters.dateRange.start ||
          joinDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

  // Get active users (those active in the last 7 days)
  const activeUsers = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return filteredUsers.filter((user) => {
      if (!user.lastActive) return false;
      const lastActive = new Date(user.lastActive);
      return lastActive >= sevenDaysAgo;
    });
  }, [filteredUsers]);

  // Get recently joined users (joined in the last 30 days)
  const recentUsers = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return filteredUsers.filter((user) => {
      const joinDate = new Date(user.joinDate);
      return joinDate >= thirtyDaysAgo;
    });
  }, [filteredUsers]);

  // Get sorted users by activity
  const usersByActivity = useMemo(() => {
    return sortUsersByActivity([...filteredUsers]);
  }, [filteredUsers]);

  // Get user statistics
  const statistics = useMemo(() => {
    const total = users.length;

    // Count users by status
    const statuses = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count users by role
    const roles = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate active user percentage
    const activeCount = activeUsers.length;
    const activePercentage = total > 0 ? (activeCount / total) * 100 : 0;

    // Calculate recent users percentage
    const recentCount = recentUsers.length;
    const growthRate = total > 0 ? (recentCount / total) * 100 : 0;

    return {
      total,
      active: activeCount,
      recent: recentCount,
      activePercentage,
      growthRate,
      byStatus: statuses,
      byRole: roles,
    };
  }, [users, activeUsers.length, recentUsers.length]);

  // Set status filter
  const setStatusFilter = (status: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  // Set role filter
  const setRoleFilter = (role: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      role,
    }));
  };

  // Set search filter
  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  };

  // Set date range filter
  const setDateRangeFilter = (start: Date, end: Date) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { start, end },
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  return {
    users,
    filteredUsers,
    activeUsers,
    recentUsers,
    usersByActivity,
    statistics,
    loading,
    error,
    filters,
    setStatusFilter,
    setRoleFilter,
    setSearchFilter,
    setDateRangeFilter,
    resetFilters,
  };
}
