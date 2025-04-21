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
  LOADING_DELAYS,
  DAILY_EVENT_DATA,
  filterEventDataByCategories,
  EVENT_CATEGORY_DISTRIBUTION,
  EVENT_STATUS_COUNTS,
  EVENT_STATUS_COLORS,
} from "@/mockups";

import { calculatePercentage, formatPercentage } from "@/lib/dashboardUtils";
import { applyColorOpacity } from "@/lib/uiUtils";

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
      // Use mockups data instead of generators from mocks
      const mockData =
        categories.length > 0
          ? filterEventDataByCategories(categories)
          : DAILY_EVENT_DATA;

      setCategoryData(EVENT_CATEGORY_DISTRIBUTION);
      setData(mockData);
      setLoading(false);
    }, LOADING_DELAYS.long);
  }, [categories]);

  // Toplam etkinlik sayısını hesapla
  const totalEvents = data.reduce(
    (sum, day) =>
      sum + day.onaylanan + day.bekleyen + day.reddedilen + day.tamamlanan,
    0
  );

  // Use EVENT_STATUS_COUNTS if available, otherwise calculate from data
  const statusCounts =
    EVENT_STATUS_COUNTS ||
    data.reduce(
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
                  (
                  {calculatePercentage(
                    statusCounts.approved,
                    statusCounts.total || totalEvents
                  )}
                  %)
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
                  (
                  {calculatePercentage(
                    statusCounts.pending,
                    statusCounts.total || totalEvents
                  )}
                  %)
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
                  (
                  {calculatePercentage(
                    statusCounts.rejected,
                    statusCounts.total || totalEvents
                  )}
                  %)
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
                  (
                  {calculatePercentage(
                    statusCounts.completed,
                    statusCounts.total || totalEvents
                  )}
                  %)
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
                fill={EVENT_STATUS_COLORS.approved}
                name="Onaylı"
              />
              <Bar
                dataKey="bekleyen"
                stackId="a"
                fill={EVENT_STATUS_COLORS.pending}
                name="Bekleyen"
              />
              <Bar
                dataKey="reddedilen"
                stackId="a"
                fill={EVENT_STATUS_COLORS.rejected}
                name="Reddedilen"
              />
              <Bar
                dataKey="tamamlanan"
                stackId="a"
                fill={EVENT_STATUS_COLORS.completed}
                name="Tamamlanan"
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="category">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} Etkinlik`, "Toplam"]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="px-4 space-y-2 mt-4 md:mt-0">
              <h3 className="text-sm font-medium">En Popüler Kategoriler</h3>
              <div className="space-y-4">
                {categoryData.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1">
                      <div className="text-sm">{category.name}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${
                              (category.value /
                                Math.max(...categoryData.map((d) => d.value))) *
                              100
                            }%`,
                            backgroundColor: applyColorOpacity(
                              category.color,
                              0.7
                            ),
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-2 text-sm font-medium">
                      {((category.value / totalCategoryEvents) * 100).toFixed(
                        1
                      )}
                      %
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
