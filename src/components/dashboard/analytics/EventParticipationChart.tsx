"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Layers } from "lucide-react";
import { WeeklyDailyStat, CategoryStat } from "@/services/statsService";
import { COLORS, DAYS_OF_WEEK } from "@/constants";
import { calculatePercentage, formatPercentage } from "@/lib/dashboardUtils";
import { applyColorOpacity } from "@/lib/uiUtils";

interface EventParticipationChartProps {
  weeklyData: WeeklyDailyStat[] | null;
  categoryData: CategoryStat[] | null;
  isLoading: boolean;
  error: string | null;
}

const dayMap: { [key: string]: string } = {
  Monday: "Pzt", Tuesday: "Sal", Wednesday: "Çar", Thursday: "Per",
  Friday: "Cum", Saturday: "Cmt", Sunday: "Paz"
};

const getDayName = (apiDay: string): string => {
  if (["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].includes(apiDay)) {
    return apiDay;
  }
  try {
    const date = new Date(apiDay);
    const dayIndex = date.getDay();
    return DAYS_OF_WEEK[(dayIndex + 6) % 7];
  } catch(e) {
    return apiDay;
  }
};

export function EventParticipationChart({
  weeklyData,
  categoryData,
  isLoading,
  error,
}: EventParticipationChartProps) {
  const [viewType, setViewType] = useState("daily");

  const dailyChartData = weeklyData?.map(item => ({
    ...item,
    name: getDayName(item.day)
  })) || [];
  
  const pieChartData = categoryData?.map((item, index) => ({
    ...item,
    color: COLORS.chart[index % COLORS.chart.length]
  })) || [];

  const totalEvents = dailyChartData.reduce(
    (sum, day) =>
      sum + (day.onaylanan || 0) + (day.bekleyen || 0) + (day.reddedilen || 0) + (day.tamamlanan || 0),
    0
  );

  const statusCounts = dailyChartData.reduce(
    (counts, day) => {
      counts.approved += day.onaylanan || 0;
      counts.pending += day.bekleyen || 0;
      counts.rejected += day.reddedilen || 0;
      counts.completed += day.tamamlanan || 0;
      return counts;
    },
    { approved: 0, pending: 0, rejected: 0, completed: 0 }
  );

  const totalCategoryEvents = pieChartData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-destructive">
        <p>Hata: {error}</p>
      </div>
    );
  }

  const noDailyData = !dailyChartData || dailyChartData.length === 0;
  const noCategoryData = !pieChartData || pieChartData.length === 0;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily" onValueChange={setViewType} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Günlük Özet</span>
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Kategori Dağılımı</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {noDailyData ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
               <p>Günlük özet verisi bulunamadı.</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 text-center my-4">
                 <div>
                   <Badge variant="outline" className="w-full bg-green-100 hover:bg-green-100 text-green-800 px-3 py-1.5">
                     <div className="flex items-center justify-center gap-2">
                       <span>Onaylı: {statusCounts.approved}</span>
                       <span className="text-xs opacity-75">({calculatePercentage(statusCounts.approved, totalEvents)}%)</span>
                     </div>
                   </Badge>
                 </div>
                 <div><Badge variant="outline" className="w-full bg-yellow-100 hover:bg-yellow-100 text-yellow-800 px-3 py-1.5"><div className="flex items-center justify-center gap-2"><span>Bekleyen: {statusCounts.pending}</span><span className="text-xs opacity-75">({calculatePercentage(statusCounts.pending, totalEvents)}%)</span></div></Badge></div>
                 <div><Badge variant="outline" className="w-full bg-red-100 hover:bg-red-100 text-red-800 px-3 py-1.5"><div className="flex items-center justify-center gap-2"><span>Reddedilen: {statusCounts.rejected}</span><span className="text-xs opacity-75">({calculatePercentage(statusCounts.rejected, totalEvents)}%)</span></div></Badge></div>
                 <div><Badge variant="outline" className="w-full bg-blue-100 hover:bg-blue-100 text-blue-800 px-3 py-1.5"><div className="flex items-center justify-center gap-2"><span>Tamamlanan: {statusCounts.completed}</span><span className="text-xs opacity-75">({calculatePercentage(statusCounts.completed, totalEvents)}%)</span></div></Badge></div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onaylanan" stackId="a" fill={COLORS.status.approved} name="Onaylı" />
                  <Bar dataKey="bekleyen" stackId="a" fill={COLORS.status.pending} name="Bekleyen" />
                  <Bar dataKey="reddedilen" stackId="a" fill={COLORS.status.rejected} name="Reddedilen" />
                  <Bar dataKey="tamamlanan" stackId="a" fill={COLORS.status.completed} name="Tamamlanan" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </TabsContent>

        <TabsContent value="category">
           {noCategoryData ? (
             <div className="h-[350px] flex items-center justify-center text-muted-foreground">
               <p>Kategori verisi bulunamadı.</p>
             </div>
           ) : (
             <div className="flex flex-col items-center space-y-6">
               <div className="w-full max-w-[300px] aspect-square mx-auto">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius="90%" fill="#8884d8" dataKey="count" nameKey="name" label={false}>
                       {pieChartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip formatter={(value, name) => [`${value} Etkinlik`, name]} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>

               <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-2">
                 {pieChartData.map((entry, index) => (
                   <Badge key={`legend-${index}`} variant="outline" className="flex items-center justify-between h-7 px-2 text-xs">
                     <div className="flex items-center gap-1.5">
                       <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                       <span className="truncate">{entry.name}</span>
                     </div>
                     <span>{formatPercentage(calculatePercentage(entry.count, totalCategoryEvents))}</span> 
                   </Badge>
                 ))}
               </div>
             </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
