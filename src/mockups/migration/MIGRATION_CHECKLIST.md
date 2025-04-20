# Mock Data Migration Checklist

This document outlines the concrete steps to complete the migration from `@/mocks` to `@/mockups`.

## Phase 1: Analysis (COMPLETED)

- ✅ Identify all components using @/mocks
- ✅ Document the structure and usage of existing mock data
- ✅ Create mapping between old and new mock data structures

## Phase 2: Implementation (COMPLETED)

### 2.1 Complete Components Analysis

- ✅ Analyze Events components (@/components/events/\*)
- ✅ Analyze Users components (@/components/users/\*)
- ✅ Analyze Reports components (@/components/reports/\*)
- ✅ Analyze Modal components (@/components/modals/\*)

### 2.2 Create Missing Component Mockups

- ✅ components/dashboard/userStats.ts
- ✅ components/events/eventDetails.ts
- ✅ components/events/eventList.ts
- ✅ components/events/eventForm.ts
- ✅ components/users/userList.ts
- ✅ components/users/userActivity.ts
- ✅ components/reports/reportDetails.ts
- ✅ components/reports/reportList.ts
- ✅ components/modals/eventModal.ts
- ✅ components/modals/userModal.ts
- ✅ components/modals/reportModal.ts
- ✅ components/modals/newsModal.ts

### 2.3 Update index.ts

- ✅ Ensure all component mockups are exported from @/mockups/index.ts
- ✅ Add additional usage examples and documentation to index.ts

## Phase 3: Component Migration (COMPLETED)

- ✅ @/components/layout/Sidebar.tsx
- ✅ @/app/dashboard/page.tsx
- ✅ @/components/modals/UserDetailModal.tsx
- ✅ @/hooks/useDashboardEvents.ts
- ✅ @/components/modals/EventDetailModal.tsx
- ✅ @/hooks/useMessages.ts
- ✅ @/hooks/useReports.ts
- ✅ @/hooks/useUsers.ts
- ✅ @/components/modals/ReportsModal.tsx
- ✅ @/components/modals/NewsModal.tsx
- ✅ @/components/dashboard/analytics/EventParticipationChart.tsx (already using mockups, verified)
- ✅ @/components/dashboard/analytics/MonthlyEventsChart.tsx (already using mockups, verified)

## Phase 4: Testing and Validation (COMPLETED)

- ✅ Run the application and test all components
- ✅ Verify that all data is consistent and formatted correctly
- ✅ Check for any console errors or warnings
- ✅ Fixed issues with missing exports in index.ts
- ✅ Fixed issues with calculatePercentage from utils.ts
- ✅ Fixed missing "use client" directive in NewsDetail.tsx
- ✅ Created temporary placeholder for Event Detail page (not critical for mockup testing)
- ✅ Verified UI functioning with new mockup structure
- ⚠️ Non-critical 404 errors for avatar images (expected)
- ⚠️ Some issues with Next.js build cache (not affecting testing)

## Phase 5: Cleanup (COMPLETED)

- ✅ Add deprecation warnings to @/mocks directory
- ✅ Document migration completion in project documentation
- ✅ Provide team members with guidance on using the new structure

## Migration Tracking

| Category  | Total Components | Analyzed | Migrated | Issues |
| --------- | ---------------- | -------- | -------- | ------ |
| Dashboard | 5                | 5        | 5        | 0      |
| Events    | 3                | 3        | 3        | 1      |
| Users     | 3                | 3        | 3        | 0      |
| Reports   | 2                | 2        | 2        | 0      |
| Modals    | 5                | 5        | 5        | 0      |
| Hooks     | 6                | 6        | 6        | 0      |

## Notes for Developers

1. **Component-Specific Approach**: Each component should only import the specific mockup data it needs, not the entire schema.

2. **Schema Consistency**: Always maintain the same property names between schemas and component-specific mockups.

3. **Documentation**: Each mockup file should clearly document which component it's intended for.

4. **Referencing Schemas**: Component mockups should derive their data from the main schemas to ensure consistency.

5. **Backend API Alignment**: The schema structure should align with expected backend API responses.

6. **Import Strategy**:

   - For components with potential naming conflicts, import directly from component-specific files
   - For simple imports, use the main mockups index
   - Always ensure proper type conversions when mapping between schema data and component props
   - When importing from '@/mockups', make sure the items are properly exported from index.ts
   - Use explicit imports to avoid potential name conflicts

7. **Troubleshooting Common Issues**:
   - If data is undefined, check that the export exists in index.ts
   - For type errors, ensure both types and values are properly exported
   - When working with dates, ensure proper conversion between string and Date objects
