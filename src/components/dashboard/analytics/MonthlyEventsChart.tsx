"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { MONTHLY_EVENT_DATA, EVENT_STATUS_COLORS } from "@/mockups";
import { formatNumber } from "@/lib/uiUtils";

// Define valid data keys
type DataKey = "onaylanan" | "bekleyen" | "reddedilen" | "tamamlanan";

export function MonthlyEventsChart() {
  // Labels for the data keys
  const labels: Record<DataKey, string> = {
    onaylanan: "Onaylanan",
    bekleyen: "Bekleyen",
    reddedilen: "Reddedilen",
    tamamlanan: "Tamamlanan",
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={MONTHLY_EVENT_DATA}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatNumber(value)}
        />
        <Tooltip
          formatter={(value, name: string) => {
            // Cast name to DataKey if it's a valid key
            const key = name as DataKey;
            return [
              `${formatNumber(value as number)} Etkinlik`,
              labels[key] || name,
            ];
          }}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend
          formatter={(value: string) => {
            // Cast value to DataKey if it's a valid key
            return labels[value as DataKey] || value;
          }}
        />
        <Bar
          dataKey="onaylanan"
          fill={EVENT_STATUS_COLORS.approved}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="bekleyen"
          fill={EVENT_STATUS_COLORS.pending}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="reddedilen"
          fill={EVENT_STATUS_COLORS.rejected}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="tamamlanan"
          fill={EVENT_STATUS_COLORS.completed}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Export with the old name as well for backwards compatibility
export const Overview = MonthlyEventsChart;
