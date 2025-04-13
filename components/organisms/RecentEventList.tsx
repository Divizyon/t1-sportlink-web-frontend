import React from "react";

interface Event {
  name: string;
  date: string;
  participants: number;
}

const events: Event[] = [
  { name: "Basketball Match", date: "2023-10-01", participants: 10 },
  { name: "Tennis Tournament", date: "2023-10-02", participants: 8 },
  { name: "Cycling Event", date: "2023-10-03", participants: 15 },
];

const RecentEventList: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
      <ul className="space-y-2">
        {events.map((event, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-gray-700">{event.name}</span>
            <span className="text-gray-500">{event.date}</span>
            <span className="text-gray-500">
              {event.participants} participants
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentEventList;
