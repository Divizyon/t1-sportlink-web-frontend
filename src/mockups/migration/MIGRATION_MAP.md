# Migration Mapping from @mocks to @mockups

This document tracks the mapping between old mock data in the `@mocks` folder and the new schema-based approach in `@mockups`.

## Usage Table

| Component Path                                                 | Imports from @mocks                                                                             | Internal Mock Data | Corresponding @mockups                                   |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| src/components/dashboard/home/TodaysEvents.tsx                 | TODAY_EVENTS, UPCOMING_EVENTS, EVENT_PARTICIPANTS                                               | None               | @mockups/components/dashboard/todaysEvents.ts            |
| src/components/dashboard/home/RecentParticipants.tsx           | RECENT_PARTICIPANTS, PARTICIPANT_DETAILS                                                        | None               | @mockups/components/dashboard/recentParticipants.ts      |
| src/components/dashboard/analytics/EventParticipationChart.tsx | DAILY_EVENT_DATA, filterEventDataByCategories, EVENT_CATEGORY_DISTRIBUTION, EVENT_STATUS_COUNTS | None               | @mockups/components/dashboard/eventParticipationChart.ts |
| src/components/dashboard/analytics/MonthlyEventsChart.tsx      | Need to analyze                                                                                 | Need to analyze    | @mockups/components/dashboard/analyticsCharts.ts         |

## Detailed Mapping

### events.ts → eventSchema.ts + component-specific files

- ALL_EVENTS → EVENT_SCHEMA.events
- filterEventsByDate() → Can be integrated into component-specific files
- filterTodayEvents() → No longer needed, TODAY_EVENTS already filtered in todaysEvents.ts
- filterEventsByStatus() → Can be integrated into component-specific files if needed
- filterEventsByCategory() → Can be integrated into component-specific files if needed
- filterUpcomingEvents() → No longer needed, UPCOMING_EVENTS already filtered in todaysEvents.ts
- EVENT_STATUS_COUNTS → EVENT_SCHEMA.stats (used in eventParticipationChart.ts)
- UserEvent interface → Can be moved to component-specific files that need it
- DEFAULT_USER_EVENTS → Can be moved to userProfile.ts or similar component-specific file

### users.ts → userSchema.ts + component-specific files

- USERS → USER_SCHEMA.users
- USER_DETAILS → Can move to component-specific files like userProfile.ts
- USER_STATUS_COUNTS → USER_SCHEMA.statusCounts

### participants.ts → userSchema.ts + component-specific files

- EVENT_PARTICIPANTS → Implemented in todaysEvents.ts using USER_SCHEMA
- RECENT_PARTICIPANTS → Implemented in recentParticipants.ts using USER_SCHEMA
- PARTICIPANT_DETAILS → Implemented in recentParticipants.ts with enriched data

### analytics.ts → component-specific files in dashboard/

- DAILY_EVENT_DATA → Implemented in eventParticipationChart.ts
- EVENT_CATEGORY_DISTRIBUTION → Implemented in eventParticipationChart.ts
- Additional analytics data structure needed for MonthlyEventsChart.tsx

### reports.ts → reportSchema.ts + component-specific files

- Need to analyze report data usage

### dashboard-reports.ts → reportSchema.ts + components/dashboard/dashboardReports.ts

- Need to analyze dashboard report usage

### detailed-events.ts → eventSchema.ts + components/events/eventDetails.ts

- Need to analyze detailed event usage

### modals.ts → Split into component-specific files under components/modals/

- Need to analyze modal data usage

## Schemas Progress

Existing schemas:

- ✅ eventSchema.ts - Contains core event data, status counts, and category information
- ✅ userSchema.ts - Contains user data and status information
- ✅ reportSchema.ts - Contains report data structure

Schema gaps to implement:

- participantSchema.ts? (Could be merged with userSchema.ts)
- modalSchema.ts
- analyticsSchema.ts? (Could be broken into component-specific files)

## Component-specific Files Implementation Status

Already implemented:

- ✅ components/dashboard/todaysEvents.ts
- ✅ components/dashboard/recentParticipants.ts
- ✅ components/dashboard/eventParticipationChart.ts
- ✅ components/dashboard/analyticsCharts.ts
- ✅ components/dashboard/dashboardReports.ts
- ✅ components/users/userProfile.ts

Needed:

- components/dashboard/userStats.ts
- components/events/eventDetails.ts
- components/events/eventList.ts
- components/events/eventForm.ts
- components/users/userList.ts
- components/users/userActivity.ts
- components/reports/reportDetails.ts
- components/reports/reportList.ts
- components/modals/eventModal.ts
- components/modals/userModal.ts
- components/modals/reportModal.ts

## Next Steps

1. Complete analysis of remaining components:
   - Events components
   - Users components
   - Reports components
   - Modal components
2. Create the missing component-specific mockup files
3. Complete the index.ts file to export all mockup data properly
4. Verify that each component's needs are met by the new mockup structure
5. Create test plan for component migration
