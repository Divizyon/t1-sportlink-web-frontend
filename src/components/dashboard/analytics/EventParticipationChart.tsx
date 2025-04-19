"use client";

import { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, Layers, Trophy } from "lucide-react";
import {
  ChartData,
  CategoryData,
  EventParticipationChartProps,
} from "@/types/dashboard";
import {
  EVENT_CATEGORIES,
  COLORS,
  DAYS_OF_WEEK,
  LOADING_DELAYS,
} from "@/constants";
import {
  generateDailyChartData,
  generateCategoryData,
} from "@/mocks/analytics";

export function EventParticipationChart({
  categories = [],
}: EventParticipationChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("daily");

  // Mock veri yükleme işlevi
  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true);

    // Mock verileri yükleme simülasyonu
    setTimeout(() => {
      // Mock veri jeneratörlerini kullan
      const mockData = generateDailyChartData(categories);
      const mockCategoryData = generateCategoryData(
        categories.length > 0 ? categories.length : 8
      );

      setData(mockData);
      setCategoryData(mockCategoryData);
      setLoading(false);
    }, LOADING_DELAYS.long);
  }, [categories]);

  // Toplam etkinlik sayısını hesapla
  const totalEvents = data.reduce(
    (sum, day) =>
      sum + day.onaylanan + day.bekleyen + day.reddedilen + day.tamamlanan,
    0
  );

  // Duruma göre etkinlik sayılarını hesapla
  const statusCounts = data.reduce(
    (counts, day) => {
      counts.approved += day.onaylanan;
      counts.pending += day.bekleyen;
      counts.rejected += day.reddedilen;
      counts.completed += day.tamamlanan;
      return counts;
    },
    { approved: 0, pending: 0, rejected: 0, completed: 0 }
  );

  // Kategorilere göre toplam etkinlik sayısı
  const totalCategoryEvents = categoryData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // Yüzde hesaplama
  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

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
          <div className="grid grid-cols-4 gap-2 text-center my-4">
            <div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
              >
                Onaylı: {statusCounts.approved}{" "}
                <span className="text-xs ml-1">
                  ({getPercentage(statusCounts.approved, totalEvents)}%)
                </span>
              </Badge>
            </div>
            <div>
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
              >
                Bekleyen: {statusCounts.pending}{" "}
                <span className="text-xs ml-1">
                  ({getPercentage(statusCounts.pending, totalEvents)}%)
                </span>
              </Badge>
            </div>
            <div>
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
              >
                Reddedilen: {statusCounts.rejected}{" "}
                <span className="text-xs ml-1">
                  ({getPercentage(statusCounts.rejected, totalEvents)}%)
                </span>
              </Badge>
            </div>
            <div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
              >
                Tamamlanan: {statusCounts.completed}{" "}
                <span className="text-xs ml-1">
                  ({getPercentage(statusCounts.completed, totalEvents)}%)
                </span>
              </Badge>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 5,
              }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="onaylanan"
                stackId="a"
                fill={COLORS.status.approved}
                name="Onaylı"
              />
              <Bar
                dataKey="bekleyen"
                stackId="a"
                fill={COLORS.status.pending}
                name="Bekleyen"
              />
              <Bar
                dataKey="reddedilen"
                stackId="a"
                fill={COLORS.status.rejected}
                name="Reddedilen"
              />
              <Bar
                dataKey="tamamlanan"
                stackId="a"
                fill={COLORS.status.completed}
                name="Tamamlanan"
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="category">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 h-[300px]">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Etkinlik`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-2 justify-center sm:flex-col sm:min-w-[150px]">
              {categoryData.map((entry, index) => (
                <Badge
                  key={`legend-${index}`}
                  variant="outline"
                  className="flex items-center gap-1"
                  style={{
                    backgroundColor: `${entry.color}20`,
                    color: entry.color,
                    borderColor: entry.color,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  {entry.name} ({entry.value})
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
