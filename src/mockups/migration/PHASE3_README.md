# Phase 3 Migration Guide

This document provides guidance for continuing the Phase 3 migration from `@/mocks` to `@/mockups`.

## Current Status

Phase 3 is **in progress**. Several key components have been migrated, but there is more work to be done.

## Completed Components

- ✅ `@/components/layout/Sidebar.tsx`
- ✅ `@/app/dashboard/page.tsx`
- ✅ `@/components/modals/UserDetailModal.tsx`
- ✅ `@/hooks/useDashboardEvents.ts`

## Components to Migrate Next

The following components still need migration:

1. **Modal Components**:

   - `@/components/modals/EventDetailModal.tsx`
   - `@/components/modals/ReportsModal.tsx`
   - `@/components/modals/NewsModal.tsx`

2. **Hooks**:

   - `@/hooks/useMessages.ts`
   - `@/hooks/useReports.ts`
   - `@/hooks/useUsers.ts`

3. **Dashboard Components**:
   - Various dashboard analytics components
   - Event participation charts

## Migration Guidelines

### Import Strategy

Two approaches have been found to work well:

1. **Direct imports** from component-specific files:

   ```typescript
   import { PENDING_REPORTS } from "@/mockups/components/reports/reportList";
   ```

2. **Central imports** from mockups index for non-conflicting names:
   ```typescript
   import { USER_PROFILES } from "@/mockups";
   ```

Choose the approach that causes the fewest conflicts for each component.

### Type Handling

When migrating components:

1. Pay attention to type differences between old and new mockups
2. Add proper conversions where needed (e.g., string dates to Date objects)
3. Use TypeScript assertions carefully when necessary

Example from useDashboardEvents.ts:

```typescript
const mappedEvents: Event[] = EVENT_SCHEMA.events.map((event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  date: new Date(event.startDate), // Convert string to Date object
  time: event.time,
  location: event.location.name,
  category: event.category,
  maxParticipants: event.maxParticipants,
  currentParticipants: event.participants,
  status: event.status as EventStatus,
  organizer: event.organizer.name,
  participants: event.participants,
}));
```

### Troubleshooting Common Issues

1. **Export conflicts**:

   - Use direct imports from specific files
   - Rename exports to avoid conflicts

2. **"X is not exported from @/mockups"**:

   - Check if the variable is being properly exported in mockups/index.ts
   - Consider importing directly from the component file

3. **Type mismatches**:

   - Map data to match the expected component types
   - Convert types as needed (e.g., dates, statuses)

4. **Undefined values**:
   - Add null checking for optional properties
   - Provide default values where appropriate

## Documentation

For each migrated component:

1. Update the MIGRATION_CHECKLIST.md
2. Add verification details to PHASE3_VERIFICATION.md
3. Note any major issues or solutions in PHASE3_SUMMARY.md

## Resources

- **PHASE3_PLAN.md**: The detailed migration plan
- **MIGRATION_MAP.md**: Mapping between old and new structures
- **PHASE3_SUMMARY.md**: Current progress and challenges
- **PHASE3_VERIFICATION.md**: Testing and verification details

## Final Note

This migration is best done incrementally, component by component, with testing after each migration to ensure no functionality is broken.
