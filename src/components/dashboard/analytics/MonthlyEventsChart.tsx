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
import { COLORS } from "@/constants";
import { formatNumber } from "@/lib/uiUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Type for the incoming data from the hook
interface MonthlyStat {
  month: string; // Matches API response
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
}

// Type for the props the component accepts
interface MonthlyEventsChartProps {
  data: MonthlyStat[] | null;
  isLoading: boolean;
  error: string | null;
}

// Define valid data keys used in the chart
type DataKey = "onaylanan" | "bekleyen" | "reddedilen" | "tamamlanan";

export function MonthlyEventsChart({ data, isLoading, error }: MonthlyEventsChartProps) {
  // Labels for the data keys
  const labels: Record<DataKey, string> = {
    onaylanan: "Onaylanan",
    bekleyen: "Bekleyen",
    reddedilen: "Reddedilen",
    tamamlanan: "Tamamlanan",
  };

  // Prepare data for the chart by mapping 'month' to 'name'
  const chartData = data?.map(item => ({ ...item, name: item.month })) || [];

  if (isLoading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-destructive">
        <p>Hata: {error}</p>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
        <p>Gösterilecek veri bulunamadı.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
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
            return labels[value as DataKey] || value;
          }}
        />
        <Bar
          dataKey="onaylanan"
          fill={COLORS.status.approved}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="bekleyen"
          fill={COLORS.status.pending}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="reddedilen"
          fill={COLORS.status.rejected}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
        <Bar
          dataKey="tamamlanan"
          fill={COLORS.status.completed}
          radius={[4, 4, 0, 0]}
          barSize={30}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Keep the export for backwards compatibility if needed, though it might be confusing
export const Overview = MonthlyEventsChart;
