import { useState, useEffect, useMemo } from "react";
import {
  USER_SCHEMA,
  UserRole,
  UserStatus,
} from "@/mockups/schemas/userSchema";
import {
  UserListItemMock,
  filterUsersByRole,
  filterUsersByStatus,
  sortUsersByJoinDate,
  sortUsersByLastActive,
  searchUsers,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from "@/mockups/components/users/userList";

interface UserFilters {
  status?: UserStatus | "all" | UserStatus[];
  role?: UserRole | "all" | UserRole[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function useUsers(initialFilters: UserFilters = {}) {
  const [users, setUsers] = useState<UserListItemMock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // Load users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In production, replace with actual API call
        // const response = await fetch('/api/users');
        // const data = await response.json();
        // setUsers(data);

        // Using mock data from the new mockups structure
        const allUsers = USER_SCHEMA.users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "/avatars/default.png",
          role: user.role,
          status: user.status,
          joinDate: user.joinDate,
          lastActive: user.lastActive,
          eventsAttended: user.stats.eventsAttended,
          eventsOrganized: user.stats.eventsOrganized,
          membershipType: user.membership?.type,
        }));

        setUsers(allUsers);
        setLoading(false);
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
    let filtered = [...users];

    // Filter by status
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        if (filters.status.length > 0) {
          filtered = filtered.filter((user) =>
            (filters.status as UserStatus[]).includes(user.status as UserStatus)
          );
        }
      } else if (filters.status !== "all") {
        filtered = filtered.filter((user) => user.status === filters.status);
      }
    }

    // Filter by role
    if (filters.role) {
      if (Array.isArray(filters.role)) {
        if (filters.role.length > 0) {
          filtered = filtered.filter((user) =>
            (filters.role as UserRole[]).includes(user.role as UserRole)
          );
        }
      } else if (filters.role !== "all") {
        filtered = filtered.filter((user) => user.role === filters.role);
      }
    }

    // Filter by search term
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by date range (join date)
    if (filters.dateRange) {
      filtered = filtered.filter((user) => {
        const joinDate = new Date(user.joinDate);
        return (
          joinDate >= filters.dateRange!.start &&
          joinDate <= filters.dateRange!.end
        );
      });
    }

    return filtered;
  }, [users, filters]);

  // Get active users (those active in the last 7 days)
  const activeUsers = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return filteredUsers.filter((user) => {
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
    return sortUsersByLastActive(filteredUsers);
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
  const setStatusFilter = (status: UserStatus | "all" | UserStatus[]) => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  // Set role filter
  const setRoleFilter = (role: UserRole | "all" | UserRole[]) => {
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
    filterOptions: {
      role: ROLE_OPTIONS,
      status: STATUS_OPTIONS,
    },
    setStatusFilter,
    setRoleFilter,
    setSearchFilter,
    setDateRangeFilter,
    resetFilters,
  };
}
