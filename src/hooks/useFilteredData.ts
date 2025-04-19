import { useState, useMemo } from "react";
import {
  toggleCategory,
  toggleStatus,
  isFilterActive,
  parseFilterParams,
  buildFilterQueryString,
} from "@/lib/filterUtils";

/**
 * Generic hook for managing filtered data with multiple filter types
 *
 * @param initialData - The initial array of data to filter
 * @param initialFilters - Initial filter state object
 * @param filterFunctions - Object with filter functions for each filter type
 */
export function useFilteredData<T, F extends Record<string, any>>(
  initialData: T[],
  initialFilters: F,
  filterFunctions: Record<keyof F, (item: T, filterValue: any) => boolean>
) {
  // State for current filters
  const [filters, setFilters] = useState<F>(initialFilters);

  // State for data (in case it needs to be updated externally)
  const [data, setData] = useState<T[]>(initialData);

  // Apply all active filters to the data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Item passes if it passes all active filters
      return Object.keys(filters).every((filterKey) => {
        const key = filterKey as keyof F;
        const filterValue = filters[key];

        // If filter is empty or "all", don't filter by this criteria
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0) ||
          filterValue === "all"
        ) {
          return true;
        }

        // Apply the specific filter function for this filter type
        return filterFunctions[key](item, filterValue);
      });
    });
  }, [data, filters, filterFunctions]);

  // Get count of active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      // Count active array filters by their length
      if (Array.isArray(value) && value.length > 0) {
        return count + 1;
      }
      // Count non-array filters that aren't empty or "all"
      if (value && value !== "all") {
        return count + 1;
      }
      return count;
    }, 0);
  }, [filters]);

  // Toggle a category in a category filter
  const toggleCategoryFilter = (category: string, filterKey: keyof F) => {
    setFilters((prev) => {
      const currentCategories = prev[filterKey] as string[];
      return {
        ...prev,
        [filterKey]: toggleCategory(category, currentCategories),
      };
    });
  };

  // Toggle a status in a status filter
  const toggleStatusFilter = (status: string, filterKey: keyof F) => {
    setFilters((prev) => {
      const currentStatuses = prev[filterKey] as string[];
      return {
        ...prev,
        [filterKey]: toggleStatus(status as any, currentStatuses as any),
      };
    });
  };

  // Set a specific filter value directly
  const setFilter = (filterKey: keyof F, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // Reset all filters to initial state
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Get URL parameters string for the current filters
  const getFilterUrlParams = () => {
    // Extract categories and statuses from filters object
    // This is a simplified version assuming specific filter structure
    const categories = (filters.categories || []) as string[];
    const statuses = (filters.statuses || []) as string[];

    return buildFilterQueryString(categories, statuses as any);
  };

  // Set filters from URL parameters
  const setFiltersFromUrl = (urlParams: URLSearchParams) => {
    const parsedFilters = parseFilterParams(urlParams);
    setFilters(
      (prev) =>
        ({
          ...prev,
          ...parsedFilters,
        } as F)
    );
  };

  return {
    data,
    setData,
    filteredData,
    filters,
    setFilters,
    activeFilterCount,
    toggleCategoryFilter,
    toggleStatusFilter,
    setFilter,
    resetFilters,
    getFilterUrlParams,
    setFiltersFromUrl,
  };
}
