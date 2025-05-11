"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, Award, DollarSign, Calendar, Tag, Package, CheckCircle, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Equipment {
  id: number
  name: string
  category: string
  status: "available" | "in-use" | "maintenance" | "reserved"
  condition: "excellent" | "good" | "fair" | "poor"
  location: string
  purchaseDate: string
  lastMaintenance?: string
  nextMaintenance?: string
  value: number
  brand: string
  model: string
  serialNumber: string
  image: string
}

interface EquipmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockEquipment: Equipment[] = [
  {
    id: 1,
    name: "Taktik Tahtası",
    category: "Eğitim Ekipmanları",
    status: "available",
    condition: "excellent",
    location: "Antrenman Salonu",
    purchaseDate: "12.01.2023",
    lastMaintenance: "05.03.2024",
    nextMaintenance: "05.06.2024",
    value: 750,
    brand: "SportMaster",
    model: "Pro Coach XL",
    serialNumber: "SM-PC-2023-4589",
    image: "/equipment/tactical-board.jpg"
  },
  {
    id: 2,
    name: "Basketbol Topu (5 Adet)",
    category: "Toplar",
    status: "in-use",
    condition: "good",
    location: "A Sahası",
    purchaseDate: "05.08.2023",
    value: 2500,
    brand: "Wilson",
    model: "Evolution",
    serialNumber: "WL-EV-2023-7845",
    image: "/equipment/basketballs.jpg"
  },
  {
    id: 3,
    name: "Portatif Basketbol Potası",
    category: "Antrenman Ekipmanları",
    status: "maintenance",
    condition: "fair",
    location: "Ekipman Deposu",
    purchaseDate: "20.03.2022",
    lastMaintenance: "15.01.2024",
    nextMaintenance: "15.04.2024",
    value: 5000,
    brand: "Spalding",
    model: "The Beast",
    serialNumber: "SP-TB-2022-1256",
    image: "/equipment/portable-hoop.jpg"
  },
  {
    id: 4,
    name: "Fitness Topu (10 Adet)",
    category: "Antrenman Ekipmanları",
    status: "available",
    condition: "good",
    location: "Fitness Salonu",
    purchaseDate: "10.11.2023",
    value: 1200,
    brand: "FitPro",
    model: "Balance",
    serialNumber: "FP-BL-2023-3256",
    image: "/equipment/fitness-balls.jpg"
  },
  {
    id: 5,
    name: "Basketbol Forması Takımı (15 Adet)",
    category: "Giyim",
    status: "reserved",
    condition: "excellent",
    location: "Malzeme Odası",
    purchaseDate: "01.09.2023",
    value: 7500,
    brand: "Nike",
    model: "Dri-FIT",
    serialNumber: "NK-DF-2023-9874",
    image: "/equipment/jersey-set.jpg"
  },
  {
    id: 6,
    name: "Atış Makinesi",
    category: "Antrenman Ekipmanları",
    status: "available",
    condition: "good",
    location: "B Sahası",
    purchaseDate: "25.05.2022",
    lastMaintenance: "12.02.2024",
    nextMaintenance: "12.05.2024",
    value: 12000,
    brand: "Dr. Dish",
    model: "Rebel",
    serialNumber: "DD-RB-2022-5634",
    image: "/equipment/shooting-machine.jpg"
  }
]

const categories = [
  "Tümü",
  "Antrenman Ekipmanları", 
  "Toplar", 
  "Eğitim Ekipmanları", 
  "Giyim"
]

export function EquipmentModal({ open, onOpenChange }: EquipmentModalProps) {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [selectedCondition, setSelectedCondition] = useState("all")

  // Filtreleme fonksiyonu
  const filteredEquipment = equipment.filter(item => {
    // Arama sorgusu filtresi
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Durum filtresi
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    // Kategori filtresi
    const matchesCategory = selectedCategory === "Tümü" || item.category === selectedCategory
    
    // Durum filtresi
    const matchesCondition = selectedCondition === "all" || item.condition === selectedCondition
    
    return matchesSearch && matchesStatus && matchesCategory && matchesCondition
  })

  const handleDelete = (id: number) => {
    setEquipment(prev => prev.filter(item => item.id !== id))
    toast.success("Ekipman başarıyla silindi.")
  }

  const handleStatusChange = (id: number, newStatus: Equipment["status"]) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? {...item, status: newStatus} : item
    ))
    toast.success("Ekipman durumu güncellendi.")
  }

  const getStatusBadge = (status: Equipment["status"]) => {
    switch(status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Kullanılabilir</Badge>
      case "in-use":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Kullanımda</Badge>
      case "maintenance":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Bakımda</Badge>
      case "reserved":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Rezerve</Badge>
      default:
        return null
    }
  }

  const getConditionBadge = (condition: Equipment["condition"]) => {
    switch(condition) {
      case "excellent":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Mükemmel</Badge>
      case "good":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">İyi</Badge>
      case "fair":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Orta</Badge>
      case "poor":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Kötü</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Ekipman Yönetimi</DialogTitle>
          <DialogDescription>
            Ekipmanların durumunu görüntüleyin, düzenleyin veya yeni ekipman ekleyin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Kontrol Paneli */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ekipman ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tümü" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="available">Kullanılabilir</SelectItem>
                  <SelectItem value="in-use">Kullanımda</SelectItem>
                  <SelectItem value="maintenance">Bakımda</SelectItem>
                  <SelectItem value="reserved">Rezerve</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Kondisyon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kondisyonlar</SelectItem>
                  <SelectItem value="excellent">Mükemmel</SelectItem>
                  <SelectItem value="good">İyi</SelectItem>
                  <SelectItem value="fair">Orta</SelectItem>
                  <SelectItem value="poor">Kötü</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ekipman
              </Button>
            </div>
          </div>

          {/* Ekipman Listesi */}
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredEquipment.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-40 bg-muted relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      <Package className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "available")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            <span>Kullanılabilir Olarak İşaretle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "in-use")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Kullanımda Olarak İşaretle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "maintenance")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-orange-500" />
                            <span>Bakımda Olarak İşaretle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "reserved")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Rezerve Olarak İşaretle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            <span>Sil</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Award className="h-3 w-3" />
                        <span>{item.brand} {item.model}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Konum:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kondisyon:</span>
                        <span>{getConditionBadge(item.condition)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Değer:</span>
                        <span className="font-medium">{item.value.toLocaleString()} TL</span>
                      </div>
                      {item.lastMaintenance && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Son Bakım:</span>
                          <span>{item.lastMaintenance}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit2 className="mr-2 h-3 w-3" />
                      Düzenle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">Ekipman Bulunamadı</h3>
              <p className="text-muted-foreground">Arama kriterlerinize uygun ekipman bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 