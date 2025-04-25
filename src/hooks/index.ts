/**
 * Hooks Index
 * Central export point for all custom hooks
 */

import { useAnalytics } from "./useAnalytics";
import { useDashboard } from "./useDashboard";
import { useDashboardEvents } from "./useDashboardEvents";
import { useFilteredData } from "./useFilteredData";
import { useMessages } from "./useMessages";
import { useNews } from "./useNews";
import { useNotifications } from "./useNotifications";
import { useReports } from "./useReports";
import { useSecurity } from "./useSecurity";
import { useSettings } from "./useSettings";
import { useUsers } from "./useUsers";
import { useRef, useEffect, useCallback } from "react";

// Create a global cache outside component lifecycle to persist between rerenders
// This helps prevent duplicate fetches in React 18's strict mode
const fetchCache = new Set<string>();

/**
 * Custom hook to prevent double fetching when navigating between pages
 * @param fetchFunction The function to fetch data
 * @param cacheKey Optional unique key to identify this fetch (defaults to function name)
 */
export function useSingleFetch(
  fetchFunction: () => Promise<void>,
  cacheKey?: string
) {
  // Generate a stable cache key for this particular fetch
  const key = cacheKey || fetchFunction.name || Math.random().toString();
  const hasFetchedRef = useRef(false);

  // Wrap the fetch function to handle caching
  const cachedFetch = useCallback(async () => {
    // Skip if this specific fetch was already called
    if (fetchCache.has(key) || hasFetchedRef.current) {
      console.debug(
        `[useSingleFetch] Skipping duplicate fetch for key: ${key}`
      );
      return;
    }

    console.debug(`[useSingleFetch] Running fetch for key: ${key}`);
    // Mark as fetched both locally and in global cache
    fetchCache.add(key);
    hasFetchedRef.current = true;

    try {
      await fetchFunction();
    } catch (error) {
      console.error(`[useSingleFetch] Error in fetch for key ${key}:`, error);
      // In case of error, allow retrying
      fetchCache.delete(key);
      hasFetchedRef.current = false;
    }
  }, [fetchFunction, key]);

  // Run fetch on mount
  useEffect(() => {
    cachedFetch();

    // Cleanup when component unmounts
    return () => {
      fetchCache.delete(key);
      hasFetchedRef.current = false;
    };
  }, [cachedFetch, key]);
}

export {
  useAnalytics,
  useDashboard,
  useDashboardEvents,
  useFilteredData,
  useMessages,
  useNews,
  useNotifications,
  useReports,
  useSecurity,
  useSettings,
  useUsers,
};
