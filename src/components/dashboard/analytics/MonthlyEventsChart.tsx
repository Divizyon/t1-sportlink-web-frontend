"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Demo verileri - son 12 ayın etkinlik sayıları (sabit değerler)
const monthlyEventData = [
  {
    name: "Oca",
    total: 32,
  },
  {
    name: "Şub",
    total: 28,
  },
  {
    name: "Mar",
    total: 35,
  },
  {
    name: "Nis",
    total: 42,
  },
  {
    name: "May",
    total: 49,
  },
  {
    name: "Haz",
    total: 53,
  },
  {
    name: "Tem",
    total: 47,
  },
  {
    name: "Ağu",
    total: 43,
  },
  {
    name: "Eyl",
    total: 38,
  },
  {
    name: "Eki",
    total: 45,
  },
  {
    name: "Kas",
    total: 40,
  },
  {
    name: "Ara",
    total: 37,
  },
];

export function MonthlyEventsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyEventData}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          formatter={(value) => [`${value} Etkinlik`, "Toplam"]}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Bar
          dataKey="total"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Export with the old name as well for backwards compatibility
export const Overview = MonthlyEventsChart;
