# Phase 2 Plan: Implementation

This document outlines the detailed plan for Phase 2 of the mockup migration, which involves implementing the new mockup structure and creating component-specific mockup files.

## Goals

1. **Complete component analysis** for all remaining component types
2. **Create missing component mockup files** that derive data from schemas
3. **Update central index.ts** to export all mockup data properly
4. **Document the implementation** in preparation for Phase 3

## Implementation Plan

### 1. Complete Component Analysis

Building on the analysis from Phase 1, we need to thoroughly examine remaining components that use mock data:

```bash
# Find all imports from @/mocks in Event components
grep -r "from '@/mocks" --include="*.tsx" --include="*.ts" ./src/components/events

# Find all imports from @/mocks in User components
grep -r "from '@/mocks" --include="*.tsx" --include="*.ts" ./src/components/users

# Find all imports from @/mocks in Report components
grep -r "from '@/mocks" --include="*.tsx" --include="*.ts" ./src/components/reports

# Find all imports from @/mocks in Modal components
grep -r "from '@/mocks" --include="*.tsx" --include="*.ts" ./src/components/modals
```

For each component category:

1. Document which mock data is used
2. Map to new mockup structure
3. Identify any unique requirements

### 2. Create Missing Component Mockups

Based on the MIGRATION_MAP.md document, implement the following component mockup files:

#### Dashboard Components

- `components/dashboard/userStats.ts` - Statistics and metrics for user dashboard

#### Event Components

- `components/events/eventDetails.ts` - Detailed event information
- `components/events/eventList.ts` - Event listings with filtering and sorting
- `components/events/eventForm.ts` - Form data for event creation/editing

#### User Components

- `components/users/userList.ts` - User listing with filtering and sorting
- `components/users/userActivity.ts` - User activity logs and history

#### Report Components

- `components/reports/reportDetails.ts` - Detailed report information
- `components/reports/reportList.ts` - Report listing with filtering and sorting

#### Modal Components

- `components/modals/eventModal.ts` - Event-related modal data
- `components/modals/userModal.ts` - User-related modal data
- `components/modals/reportModal.ts` - Report-related modal data

Each component mockup file should:

- Import relevant schema(s)
- Define TypeScript interfaces for component-specific data
- Implement utility functions for data manipulation
- Export properly named constants and functions
- Include detailed JSDoc comments

### 3. Implementation Pattern

For each component mockup file:

```typescript
/**
 * [Component Name] Mockup Data
 *
 * This file contains mockup data specifically for [component description].
 */

import { RELEVANT_SCHEMA } from "../../schemas/schemaFile";

// Define component-specific interfaces
export interface ComponentSpecificData {
  // Properties needed by the component
}

// Implement data transformation functions
export const transformSchemaData = (schemaData) => {
  // Transform logic
};

// Export mockup data for component
export const COMPONENT_DATA = transformSchemaData(RELEVANT_SCHEMA.data);

// Additional utility functions as needed
export const filterComponentData = (criteria) => {
  // Filtering logic
};
```

### 4. Update index.ts

Update the central `index.ts` file to export all mockup data:

```typescript
// Export schemas
export * from "./schemas";

// Dashboard component mockups
export * from "./components/dashboard/todaysEvents";
export * from "./components/dashboard/analyticsCharts";
export * from "./components/dashboard/recentParticipants";
export * from "./components/dashboard/eventParticipationChart";
export * from "./components/dashboard/dashboardReports";
export * from "./components/dashboard/userStats";

// Event component mockups
export * from "./components/events/eventDetails";
export * from "./components/events/eventList";
export * from "./components/events/eventForm";

// User component mockups
export * from "./components/users/userProfile";
export * from "./components/users/userList";
export * from "./components/users/userActivity";

// Report component mockups
export * from "./components/reports/reportDetails";
export * from "./components/reports/reportList";

// Modal component mockups
export * from "./components/modals/eventModal";
export * from "./components/modals/userModal";
export * from "./components/modals/reportModal";
```

Include usage examples in comments at the end of the file.

### 5. Documentation

Document the implementation process:

1. Create `PHASE2_SUMMARY.md` - Summarize what was implemented
2. Update `MIGRATION_CHECKLIST.md` - Mark completed tasks
3. Prepare for `PHASE2_VERIFICATION.md` - Verification criteria

## Timeline

| Task                                  | Estimated Time |
| ------------------------------------- | -------------- |
| Complete component analysis           | 1 day          |
| Implement dashboard component mockups | 0.5 day        |
| Implement event component mockups     | 1 day          |
| Implement user component mockups      | 1 day          |
| Implement report component mockups    | 0.5 day        |
| Implement modal component mockups     | 0.5 day        |
| Update index.ts                       | 0.5 day        |
| Documentation                         | 1 day          |
| **Total**                             | **6 days**     |

## Success Criteria

Phase 2 will be considered complete when:

1. All required component mockup files are created
2. Each file correctly imports and uses schema data
3. TypeScript interfaces are defined for all component-specific data
4. Utility functions are implemented for data manipulation
5. All mockups are properly exported from index.ts
6. Documentation is complete
7. MIGRATION_CHECKLIST.md is updated to reflect progress

The completion of Phase 2 will provide the foundation for Phase 3, where actual components will be updated to use the new mockup structure.
