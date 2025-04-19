"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, CreditCard, CalendarIcon, FileText, ArrowUpDown, CheckCircle, XCircle, InfoIcon } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PaymentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock ödeme verileri
const mockPayments = [
  { 
    id: "TRX-1234",
    userId: "USR-5678",
    userName: "Ahmet Yılmaz",
    amount: 250,
    date: "12 Nisan 2023",
    type: "Etkinlik Kaydı",
    status: "Tamamlandı",
    paymentMethod: "Kredi Kartı",
    details: "Basketbol Turnuvası - 15 Nisan",
  },
  { 
    id: "TRX-1235",
    userId: "USR-9012",
    userName: "Ayşe Kaya",
    amount: 150,
    date: "14 Nisan 2023",
    type: "Üyelik",
    status: "Tamamlandı",
    paymentMethod: "Banka Transferi",
    details: "6 Aylık Üyelik",
  },
  { 
    id: "TRX-1236",
    userId: "USR-3456",
    userName: "Mehmet Demir",
    amount: 350,
    date: "15 Nisan 2023",
    type: "Etkinlik Kaydı",
    status: "Beklemede",
    paymentMethod: "Havale",
    details: "Yüzme Kampı - 20 Nisan",
  },
  { 
    id: "TRX-1237",
    userId: "USR-7890",
    userName: "Zeynep Şahin",
    amount: 200,
    date: "16 Nisan 2023",
    type: "Ekipman Kiralama",
    status: "Tamamlandı",
    paymentMethod: "Kredi Kartı",
    details: "Tenis Raketi Kiralama - 1 Hafta",
  },
  { 
    id: "TRX-1238",
    userId: "USR-1234",
    userName: "Ali Yıldız",
    amount: 400,
    date: "16 Nisan 2023",
    type: "Üyelik",
    status: "Reddedildi",
    paymentMethod: "Kredi Kartı",
    details: "Yıllık Üyelik - Yetersiz Bakiye",
  },
  { 
    id: "TRX-1239",
    userId: "USR-5678",
    userName: "Ahmet Yılmaz",
    amount: 75,
    date: "17 Nisan 2023",
    type: "Ekipman Kiralama",
    status: "Tamamlandı",
    paymentMethod: "Kredi Kartı",
    details: "Futbol Topu Kiralama - 1 Gün",
  },
  { 
    id: "TRX-1240",
    userId: "USR-9012",
    userName: "Ayşe Kaya",
    amount: 120,
    date: "18 Nisan 2023",
    type: "Özel Ders",
    status: "Beklemede",
    paymentMethod: "Mobil Ödeme",
    details: "Yoga Özel Ders - 19 Nisan",
  }
]

export function PaymentsModal({ open, onOpenChange }: PaymentsModalProps) {
  const [payments, setPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  
  const filteredPayments = payments.filter(payment => {
    // Arama sorgusu filtrelemesi
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.details.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Durum filtrelemesi
    const matchesStatus = 
      statusFilter === "all" || 
      payment.status.toLowerCase() === statusFilter.toLowerCase()
    
    // Tür filtrelemesi
    const matchesType = 
      typeFilter === "all" || 
      payment.type.toLowerCase() === typeFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesType
  })

  const viewPaymentDetails = (payment: typeof mockPayments[0]) => {
    setSelectedPayment(payment)
    setShowDetails(true)
  }

  const handleApprovePayment = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: "Tamamlandı" } : payment
    ))
    toast.success("Ödeme onaylandı")
    if (selectedPayment?.id === id) {
      setSelectedPayment({...selectedPayment, status: "Tamamlandı"})
    }
  }

  const handleRejectPayment = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: "Reddedildi" } : payment
    ))
    toast.success("Ödeme reddedildi")
    if (selectedPayment?.id === id) {
      setSelectedPayment({...selectedPayment, status: "Reddedildi"})
    }
  }

  const handleRefundPayment = (id: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: "İade Edildi" } : payment
    ))
    toast.success("Ödeme iade edildi")
    if (selectedPayment?.id === id) {
      setSelectedPayment({...selectedPayment, status: "İade Edildi"})
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Tamamlandı": return "success"
      case "Beklemede": return "warning"
      case "Reddedildi": return "destructive"
      case "İade Edildi": return "secondary"
      default: return "default"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Ödeme İşlemleri</DialogTitle>
          <DialogDescription>
            Tüm ödeme işlemlerini görüntüleyin ve yönetin.
          </DialogDescription>
        </DialogHeader>
        
        {showDetails ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">Ödeme Detayları</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                Listeye Dön
              </Button>
            </div>
            
            {selectedPayment && (
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{selectedPayment.type} - {selectedPayment.details}</h4>
                    <p className="text-sm text-muted-foreground">İşlem ID: {selectedPayment.id}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(selectedPayment.status)}>
                    {selectedPayment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Ödeme Yapan</p>
                    <p>{selectedPayment.userName}</p>
                    <p className="text-sm text-muted-foreground">Kullanıcı ID: {selectedPayment.userId}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Ödeme Bilgileri</p>
                    <p>{selectedPayment.amount} TL - {selectedPayment.paymentMethod}</p>
                    <p className="text-sm text-muted-foreground">Tarih: {selectedPayment.date}</p>
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium">Ödeme Detayları</p>
                    <p>{selectedPayment.details}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {selectedPayment.status === "Beklemede" && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => handleRejectPayment(selectedPayment.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reddet
                      </Button>
                      <Button 
                        onClick={() => handleApprovePayment(selectedPayment.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Onayla
                      </Button>
                    </>
                  )}
                  
                  {selectedPayment.status === "Tamamlandı" && (
                    <Button 
                      variant="outline"
                      onClick={() => handleRefundPayment(selectedPayment.id)}
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      İade Et
                    </Button>
                  )}
                  
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      toast.success("Ödeme makbuzu gönderildi")
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Makbuz Gönder
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="İsim, ID veya detay ara..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="tamamlandı">Tamamlandı</SelectItem>
                  <SelectItem value="beklemede">Beklemede</SelectItem>
                  <SelectItem value="reddedildi">Reddedildi</SelectItem>
                  <SelectItem value="iade edildi">İade Edildi</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="İşlem Türü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm İşlemler</SelectItem>
                  <SelectItem value="etkinlik kaydı">Etkinlik Kaydı</SelectItem>
                  <SelectItem value="üyelik">Üyelik</SelectItem>
                  <SelectItem value="ekipman kiralama">Ekipman Kiralama</SelectItem>
                  <SelectItem value="özel ders">Özel Ders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">İşlem ID</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead className="text-right">Tutar</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <CreditCard className="h-8 w-8 text-muted-foreground opacity-40" />
                          <p className="text-sm text-muted-foreground">İşlem bulunamadı</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.userName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.type}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.amount} TL
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              {payment.status === "Beklemede" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRejectPayment(payment.id)}
                                    title="Reddet"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleApprovePayment(payment.id)}
                                    title="Onayla"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => viewPaymentDetails(payment)}
                                title="Detaylar"
                              >
                                <InfoIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 