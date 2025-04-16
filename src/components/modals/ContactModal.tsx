"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Mail, Phone, MapPin, User, Calendar, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  read: boolean
}

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockMessages: ContactMessage[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "0532 123 4567",
    subject: "Etkinlik İptali Hakkında",
    message: "Merhaba, 15 Nisan tarihinde kayıt olduğum basketbol etkinliği iptal edildi ancak hala iade alamadım. Yardımcı olabilir misiniz?",
    date: "15 Nisan 2024",
    read: false
  },
  {
    id: 2,
    name: "Ayşe Demir",
    email: "ayse.demir@example.com",
    phone: "0533 456 7890",
    subject: "Uygulama Önerisi",
    message: "Uygulamanızı çok beğendim, sadece etkinlik filtreleme özelliğinin geliştirilmesi gerektiğini düşünüyorum. Tarih aralığı seçimi yapabilmek çok faydalı olurdu.",
    date: "13 Nisan 2024",
    read: false
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    email: "mehmet.kaya@example.com",
    phone: "0535 789 0123",
    subject: "Teknik Sorun Bildirimi",
    message: "Etkinlik oluşturma sayfasında resim yükleme kısmında hata alıyorum. Lütfen bu sorunu çözebilir misiniz?",
    date: "10 Nisan 2024",
    read: true
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    phone: "0536 890 1234",
    subject: "İş Birliği Teklifi",
    message: "Merhaba, spor malzemeleri üreten bir firmada pazarlama yöneticisiyim. Sizinle iş birliği yapmak istiyoruz. Uygun olduğunuzda görüşmek için iletişime geçebilir misiniz?",
    date: "8 Nisan 2024",
    read: true
  },
  {
    id: 5,
    name: "Can Öztürk",
    email: "can.ozturk@example.com",
    phone: "0537 234 5678",
    subject: "Üyelik Sorunları",
    message: "Premium üyelik için ödeme yaptım ancak hesabıma yansımadı. Lütfen yardımcı olabilir misiniz?",
    date: "5 Nisan 2024",
    read: true
  }
]

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("unread")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyForm, setReplyForm] = useState({
    subject: "",
    message: ""
  })

  const filteredMessages = messages.filter(message => {
    // Arama filtreleme
    const matchesSearch = searchQuery === "" || 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Okunma durumu filtreleme
    const matchesStatus = 
      activeTab === "all" || 
      (activeTab === "unread" && !message.read) ||
      (activeTab === "read" && message.read)
    
    return matchesSearch && matchesStatus
  })

  const handleMessageClick = (message: ContactMessage) => {
    // Mesajı oku olarak işaretle
    if (!message.read) {
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ))
    }
    setSelectedMessage(message)
  }

  const handleReply = () => {
    if (!selectedMessage) return
    
    // Mesaj gönderildi olarak işaretle ve form temizle
    toast.success(`"${selectedMessage.name}" kişisine yanıt gönderildi.`)
    setReplyForm({ subject: "", message: "" })
    setSelectedMessage(null)
  }

  const handleMarkAsRead = (messageId: number) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ))
    toast.success("Mesaj okundu olarak işaretlendi")
  }

  const handleMarkAsUnread = (messageId: number) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: false } : m
    ))
    toast.success("Mesaj okunmadı olarak işaretlendi")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>İletişim Mesajları</DialogTitle>
          <DialogDescription>
            Kullanıcılardan gelen mesajları görüntüleyin ve yanıtlayın.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sol Panel - Mesaj Listesi */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Mesaj ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="unread" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="unread">Okunmamış</TabsTrigger>
                <TabsTrigger value="read">Okunmuş</TabsTrigger>
                <TabsTrigger value="all">Tümü</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[350px] overflow-y-auto divide-y">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id 
                        ? 'bg-primary/10' 
                        : message.read ? 'hover:bg-gray-50' : 'bg-primary/5 hover:bg-primary/10'
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-medium truncate ${!message.read ? 'font-semibold' : ''}`}>
                          {message.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">{message.date}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>Mesaj bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Seçili Mesaj */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-start border-b pb-2">
                  <h3 className="font-semibold">{selectedMessage.subject}</h3>
                  <div className="space-x-2">
                    {selectedMessage.read ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsUnread(selectedMessage.id)}
                      >
                        Okunmadı Olarak İşaretle
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                      >
                        Okundu Olarak İşaretle
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.date}</span>
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <p className="whitespace-pre-line text-sm">{selectedMessage.message}</p>
                </div>
                
                <div className="border-t pt-3 space-y-3">
                  <h4 className="font-medium">Yanıt Ver</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="reply-subject">Konu</Label>
                      <Input 
                        id="reply-subject"
                        value={`RE: ${selectedMessage.subject}`}
                        readOnly
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="reply-message">Mesaj</Label>
                      <Textarea 
                        id="reply-message"
                        placeholder="Yanıtınızı buraya yazın..."
                        value={replyForm.message}
                        onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleReply}>
                      <Mail className="mr-2 h-4 w-4" />
                      Yanıt Gönder
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-md flex items-center justify-center h-full p-8">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>Görüntülemek için bir mesaj seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 