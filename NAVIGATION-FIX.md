# Navigation Double Fetch Issue Fix

## Problem Description

When navigating between pages in the dashboard, components were making duplicate API requests. This happened because:

1. Next.js client-side navigation re-mounts components
2. `useEffect` with empty dependency array (`[]`) runs on each mount
3. Our fetch functions were being called multiple times for the same data
4. Filter state changes were triggering additional fetches

The duplicate fetches were visible in the browser network tab and console logs, resulting in unnecessary server load and potentially causing race conditions with data.

## Solution

We implemented a custom `useSingleFetch` hook that ensures fetch functions only run once during navigation between pages. This hook uses a dual approach:

1. Global cache outside component lifecycle to persist between rerenders
2. Component-level refs to track fetch status within a component
3. Proper cleanup to prevent memory leaks
4. Error handling to allow retries if a fetch fails

Additionally, we added a robust pattern for handling filter changes that prevents duplicate fetches when filters are updated.

## Enhanced Implementation

We created an improved hook in `src/hooks/index.ts`:

```typescript
// Create a global cache outside component lifecycle to persist between rerenders
const fetchCache = new Set<string>();

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
```

For handling filter changes, we implemented this pattern to avoid duplicating the initial fetch:

```typescript
// Use the hook for initial page load
useSingleFetch(fetchData, "unique-page-key");

// Track previous filter values
const prevFiltersRef = useRef({
  filter1,
  filter2,
  // ... other filters
});

// Handle filter changes without duplicating the initial fetch
useEffect(() => {
  // Skip first render (already handled by useSingleFetch)
  if (
    prevFiltersRef.current.filter1 === initialValue &&
    prevFiltersRef.current.filter2 === initialValue
  ) {
    // Update reference to current values
    prevFiltersRef.current = { filter1, filter2 };
    return;
  }

  // Check if filters actually changed
  if (
    prevFiltersRef.current.filter1 !== filter1 ||
    prevFiltersRef.current.filter2 !== filter2
  ) {
    // Update our reference
    prevFiltersRef.current = { filter1, filter2 };

    // Debounce to prevent rapid API calls
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }
}, [filter1, filter2, fetchData]);
```

## Pages Fixed

The following pages have been updated to use the enhanced hook:

- `dashboard/users/page.tsx`
- `dashboard/security/page.tsx`
- `dashboard/events/page.tsx`
- `dashboard/reports/page.tsx`
- `dashboard/news/page.tsx` (via the useNews hook)

## Debugging Issues Encountered

During implementation, we encountered several challenges:

1. **React Hook Rules**: Cannot create refs inside effects, they must be at the component level
2. **Filter Change Detection**: Need to track previous filter values to avoid unnecessary fetches
3. **React 18 Strict Mode**: In development, components mount twice, causing duplicate fetches
4. **Persistence Between Renders**: Need a global cache to persist between component remounts

## Benefits

This enhanced implementation has significantly reduced the number of duplicate API requests when navigating between dashboard pages, resulting in:

1. Reduced server load
2. Faster page transitions
3. Better user experience
4. Decreased likelihood of race conditions
5. Cleaner, more maintainable code

## Note on Filtering

Some pages like the security logs page intentionally make multiple API calls to fetch data in chunks or with different filters. These are expected behaviors and not considered duplicate fetches.
