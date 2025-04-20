# Mockups Directory

This directory serves as the central location for all mockup data used in components. The structure is designed to:

1. Document the data types components use
2. Provide a clear interface for backend developers
3. Maintain consistency in data structure across the application

## Directory Structure

```
mockups/
├── README.md                  # This documentation
├── schemas/                   # Complete data schemas
│   ├── index.ts               # Exports all schemas
│   ├── eventSchema.ts         # Full event data structure
│   └── userSchema.ts          # Full user data structure
├── components/                # Component-specific mock data
│   ├── dashboard/             # Dashboard components
│   │   ├── todaysEvents.ts    # Data for TodaysEvents component
│   │   ├── analyticsCharts.ts # Data for analytics charts
│   │   └── ...
│   ├── events/                # Event components
│   └── users/                 # User components
└── index.ts                   # Main export file
```

## Usage Guidelines

1. The `schemas` directory contains the full data models for each entity type
2. Component mockups should always reference and subset the main schemas
3. Each component mockup file should:
   - Document which component it's for
   - Only include the specific data needed for that component
   - Maintain the same property names as the main schema

## Adding New Mockups

When creating a new component that needs mock data:

1. Check if your data fits in an existing schema
2. Create a component-specific mock file in the appropriate directory
3. Import the schema and create a subset of the data
4. Document which component uses this data

## Example

```typescript
// mockups/components/dashboard/todaysEvents.ts
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// Mock data for TodaysEvents component (/components/dashboard/TodaysEvents.tsx)
export const TODAY_EVENTS = EVENT_SCHEMA.events.slice(0, 5).map((event) => ({
  id: event.id,
  title: event.title,
  time: event.time,
  location: event.location,
  participants: event.participants,
  maxParticipants: event.maxParticipants,
  status: event.status,
}));
```

This structure ensures we maintain consistent data structures while making it clear what data each component requires.
