import { useState, useEffect, useMemo } from "react";
import {
  Report,
  ReportStatus,
  ReportPriority,
  ReportEntityType,
  REPORT_SCHEMA,
} from "@/mockups/schemas/reportSchema";
import {
  ReportListItemMock,
  filterReportsByEntityType,
  filterReportsByStatus,
  filterReportsByPriority,
  sortReportsByDate,
  searchReports,
  REPORT_STATUS_OPTIONS,
  REPORT_ENTITY_TYPE_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
} from "@/mockups/components/reports/reportList";
import { REPORT_FILTERS } from "@/constants/dashboard";

interface ReportFilters {
  entityType?: ReportEntityType | "all";
  status?: ReportStatus | "all";
  priority?: ReportPriority | "all";
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function useReports(initialFilters: ReportFilters = {}) {
  const [reports, setReports] = useState<ReportListItemMock[]>([]);
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

        // Using mock data from the new mockups structure
        const allReports = REPORT_SCHEMA.reports.map((report) => ({
          id: report.id,
          subject: report.subject,
          description: report.description,
          reportedDate: report.reportedDate,
          priority: report.priority,
          status: report.status,
          reportedBy: report.reportedBy,
          assignedTo: report.assignedTo,
          entityId: report.entityId,
          entityType: report.entityType,
          resolution: report.resolution,
          resolutionDate: report.resolutionDate,
        }));

        setReports(allReports);
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
    let filtered = [...reports];

    // Filter by entity type
    if (filters.entityType && filters.entityType !== "all") {
      filtered = filtered.filter(
        (report) => report.entityType === filters.entityType
      );
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    // Filter by priority
    if (filters.priority && filters.priority !== "all") {
      filtered = filtered.filter(
        (report) => report.priority === filters.priority
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.reportedDate);
        return (
          reportDate >= filters.dateRange!.start &&
          reportDate <= filters.dateRange!.end
        );
      });
    }

    return filtered;
  }, [reports, filters]);

  // Get summary statistics
  const statistics = useMemo(() => {
    // Use the pre-calculated stats from REPORT_SCHEMA
    const { stats } = REPORT_SCHEMA;

    // Calculate resolution rate
    const resolutionRate =
      stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0;

    return {
      total: stats.total,
      byStatus: {
        pending: stats.pending,
        reviewing: stats.reviewing,
        resolved: stats.resolved,
        rejected: stats.rejected,
      },
      byPriority: stats.byPriority,
      byEntityType: stats.byEntityType,
      resolutionRate,
    };
  }, []);

  // Update a report's status
  const updateReportStatus = (
    reportId: number | string,
    newStatus: ReportStatus
  ) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  // Set entity type filter
  const setEntityTypeFilter = (entityType: ReportEntityType | "all") => {
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
    filterOptions: {
      status: REPORT_STATUS_OPTIONS,
      entityType: REPORT_ENTITY_TYPE_OPTIONS,
      priority: REPORT_PRIORITY_OPTIONS,
    },
    updateReportStatus,
    setEntityTypeFilter,
    setStatusFilter,
    setPriorityFilter,
    setDateRangeFilter,
    resetFilters,
  };
}
