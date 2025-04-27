/**
 * Script to test event creation with valid future dates
 *
 * To run this script:
 * 1. Make sure you have a valid auth token
 * 2. Run: node src/scripts/testEventCreation.js
 */

// Calculate future date/times (now + 2 hours)
const now = new Date();
const futureDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const date = futureDate.toISOString().split("T")[0];

// Start time (current time + 2 hours)
const startTime = new Date(futureDate);
const formattedStartTime = startTime.toISOString(); // Full ISO format

// End time (start time + 1 hour)
const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000);
const formattedEndTime = endTime.toISOString(); // Full ISO format

// Create event payload
const eventData = {
  title: "Test Event with Future Date",
  description:
    "This is a test event with future date to avoid validation errors",
  sport_id: 6,
  event_date: date,
  start_time: formattedStartTime,
  end_time: formattedEndTime,
  location_name: "Test Location",
  location_lat: 90,
  location_long: 180,
  max_participants: 1000,
};

console.log("Creating event with the following data:");
console.log(JSON.stringify(eventData, null, 2));

// You'll need a valid auth token to run this manually
const token = "YOUR_AUTH_TOKEN"; // Replace with your token when testing

// Fetch API to create event
fetch("http://localhost:3000/api/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(eventData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Response:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
