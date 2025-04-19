import { useState, useEffect, useMemo } from "react";
import {
  Report,
  ReportStatus,
  ReportPriority,
  ReportFilterType,
} from "@/types";
import { REPORTS } from "@/mocks/reports";
import { REPORT_FILTERS } from "@/constants/dashboard";

interface ReportFilters {
  entityType?: ReportFilterType;
  status?: ReportStatus | "all";
  priority?: ReportPriority | "all";
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function useReports(initialFilters: ReportFilters = {}) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);

  // Load reports data
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // In production, replace with actual API call
        // const response = await fetch('/api/reports');
        // const data = await response.json();
        // setReports(data);

        // Using mock data for now
        setReports(REPORTS);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch reports")
        );
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Apply filters to reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filter by entity type
      if (filters.entityType && filters.entityType !== REPORT_FILTERS.all) {
        const entityTypeMatch =
          // Convert from "users" -> "user" or "events" -> "event"
          report.entityType === filters.entityType.slice(0, -1);
        if (!entityTypeMatch) return false;
      }

      // Filter by status
      if (filters.status && filters.status !== "all") {
        if (report.status !== filters.status) return false;
      }

      // Filter by priority
      if (filters.priority && filters.priority !== "all") {
        if (report.priority !== filters.priority) return false;
      }

      // Filter by date range
      if (filters.dateRange) {
        const reportDate = new Date(report.reportedDate);
        if (
          reportDate < filters.dateRange.start ||
          reportDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      return true;
    });
  }, [reports, filters]);

  // Get summary statistics
  const statistics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const reviewing = reports.filter((r) => r.status === "reviewing").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const rejected = reports.filter((r) => r.status === "rejected").length;

    const highPriority = reports.filter((r) => r.priority === "high").length;
    const mediumPriority = reports.filter(
      (r) => r.priority === "medium"
    ).length;
    const lowPriority = reports.filter((r) => r.priority === "low").length;

    const userReports = reports.filter((r) => r.entityType === "user").length;
    const eventReports = reports.filter((r) => r.entityType === "event").length;

    return {
      total,
      byStatus: {
        pending,
        reviewing,
        resolved,
        rejected,
      },
      byPriority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
      byEntityType: {
        user: userReports,
        event: eventReports,
      },
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
    };
  }, [reports]);

  // Update a report's status
  const updateReportStatus = (reportId: number, newStatus: ReportStatus) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  // Set entity type filter
  const setEntityTypeFilter = (entityType: ReportFilterType) => {
    setFilters((prev) => ({
      ...prev,
      entityType,
    }));
  };

  // Set status filter
  const setStatusFilter = (status: ReportStatus | "all") => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  };

  // Set priority filter
  const setPriorityFilter = (priority: ReportPriority | "all") => {
    setFilters((prev) => ({
      ...prev,
      priority,
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
    reports,
    filteredReports,
    statistics,
    loading,
    error,
    filters,
    updateReportStatus,
    setEntityTypeFilter,
    setStatusFilter,
    setPriorityFilter,
    setDateRangeFilter,
    resetFilters,
  };
}
