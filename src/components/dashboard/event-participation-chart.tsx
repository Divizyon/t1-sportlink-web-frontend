"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, Layers, Trophy } from "lucide-react"

// Etkinlik kategorileri
const EVENT_CATEGORIES = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Yoga",
  "Fitness",
  "Diğer"
]

// Renk paleti
const COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f97316", "#6366f1"]

interface ChartData {
  name: string
  onaylanan: number
  bekleyen: number
  reddedilen: number
  tamamlanan: number
  [key: string]: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

interface EventParticipationProps {
  categories?: string[]
}

export function EventParticipation({ categories = [] }: EventParticipationProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [viewType, setViewType] = useState("daily")

  // Mock veri yükleme işlevi
  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true)
    
    // Filtrelenmiş verileri yükleme simülasyonu
    setTimeout(() => {
      // Her gün için farklı kategoriler için rastgele veriler
      const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
      const mockData: ChartData[] = days.map(day => {
        const baseData: ChartData = {
          name: day,
          onaylanan: Math.floor(Math.random() * 20) + 10,
          bekleyen: Math.floor(Math.random() * 10) + 5,
          reddedilen: Math.floor(Math.random() * 5) + 1,
          tamamlanan: Math.floor(Math.random() * 15) + 5
        }
        
        // Kategoriye göre filtreleme
        if (categories && categories.length > 0) {
          let filteredData: ChartData = { name: day, onaylanan: 0, bekleyen: 0, reddedilen: 0, tamamlanan: 0 }
          
          // Her kategori için ağırlıklandırılmış veriler
          categories.forEach(category => {
            const weight = (EVENT_CATEGORIES.indexOf(category) + 1) / EVENT_CATEGORIES.length
            filteredData.onaylanan += Math.floor(baseData.onaylanan * weight)
            filteredData.bekleyen += Math.floor(baseData.bekleyen * weight)
            filteredData.reddedilen += Math.floor(baseData.reddedilen * weight)
            filteredData.tamamlanan += Math.floor(baseData.tamamlanan * weight)
          })
          
          return filteredData
        }
        
        return baseData
      })
      
      // Kategori verilerini oluştur
      const mockCategoryData: CategoryData[] = EVENT_CATEGORIES.slice(0, categories.length > 0 ? categories.length : 8).map((category, index) => ({
        name: category,
        value: Math.floor(Math.random() * 50) + 20,
        color: COLORS[index % COLORS.length]
      }))
      
      setData(mockData)
      setCategoryData(mockCategoryData)
      setLoading(false)
    }, 1000)
  }, [categories])

  // Toplam etkinlik sayısını hesapla
  const totalEvents = data.reduce(
    (sum, day) => sum + day.onaylanan + day.bekleyen + day.reddedilen + day.tamamlanan, 
    0
  )
  
  // Duruma göre etkinlik sayılarını hesapla
  const statusCounts = data.reduce(
    (counts, day) => {
      counts.approved += day.onaylanan
      counts.pending += day.bekleyen
      counts.rejected += day.reddedilen
      counts.completed += day.tamamlanan
      return counts
    },
    { approved: 0, pending: 0, rejected: 0, completed: 0 }
  )

  // Kategorilere göre toplam etkinlik sayısı
  const totalCategoryEvents = categoryData.reduce((sum, item) => sum + item.value, 0)

  // Yüzde hesaplama
  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
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
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                Onaylı: {statusCounts.approved} <span className="text-xs ml-1">({getPercentage(statusCounts.approved, totalEvents)}%)</span>
              </Badge>
            </div>
            <div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                Bekleyen: {statusCounts.pending} <span className="text-xs ml-1">({getPercentage(statusCounts.pending, totalEvents)}%)</span>
              </Badge>
            </div>
            <div>
              <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">
                Reddedilen: {statusCounts.rejected} <span className="text-xs ml-1">({getPercentage(statusCounts.rejected, totalEvents)}%)</span>
              </Badge>
            </div>
            <div>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">
                Tamamlanan: {statusCounts.completed} <span className="text-xs ml-1">({getPercentage(statusCounts.completed, totalEvents)}%)</span>
              </Badge>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis width={30} />
              <Tooltip 
                formatter={(value, name) => {
                  const labels = {
                    onaylanan: "Onaylı",
                    bekleyen: "Bekleyen",
                    reddedilen: "Reddedilen",
                    tamamlanan: "Tamamlanan"
                  }
                  return [value, labels[name as keyof typeof labels] || name]
                }}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Legend formatter={(value) => {
                const labels = {
                  onaylanan: "Onaylı",
                  bekleyen: "Bekleyen",
                  reddedilen: "Reddedilen",
                  tamamlanan: "Tamamlanan"
                }
                return labels[value as keyof typeof labels] || value
              }} />
              <Bar dataKey="onaylanan" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bekleyen" fill="#eab308" radius={[4, 4, 0, 0]} />
              <Bar dataKey="reddedilen" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tamamlanan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="category">
          <div className="flex justify-between items-center my-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-medium">En Popüler Kategoriler</span>
            </div>
            <div>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                Toplam: {totalCategoryEvents} Etkinlik
              </Badge>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Etkinlik`, 'Toplam']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="space-y-2">
                {categoryData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.value}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getPercentage(entry.value, totalCategoryEvents)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-muted-foreground text-center">
        Toplam {totalEvents} etkinlik {categories.length > 0 ? `(${categories.join(", ")})` : "(tüm kategoriler)"}
      </div>
    </div>
  )
} 