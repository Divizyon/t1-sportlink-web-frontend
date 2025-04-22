"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Changed from sheet
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, User as UserIcon, Calendar, MapPin, Info, Activity, ThumbsUp, ListChecks, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Define a simple Event interface (replace with actual if available)
interface AttendedEvent {
  id: string;
  title: string;
  date: string; // Or Date object
  location?: string;
}

// Define User type matching the one in users/page.tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: "bireysel_kullanici" | "antrenor" | "kulup_uyesi";
  status: "active" | "inactive";
  avatar?: string; 
  phone?: string;
  gender?: string;
  age?: number;
  joinDate?: string;
  lastActivity?: string;
  address?: string;
  bio?: string;
  favoriteCategories?: string[];
  completedEvents?: number;
  totalEvents?: number;
}

// Define ROLE_LABELS matching the one in users/page.tsx
const ROLE_LABELS: Record<string, string> = {
  "bireysel_kullanici": "Bireysel Kullanıcı",
  "antrenor": "Antrenör",
  "kulup_uyesi": "Kulüp Üyesi"
};

// Helper function for initials
const getInitials = (name?: string) => {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '??';
};

interface UserDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  onDeleteUser: (userId: string) => void;
}

export function UserDetailsDialog({
  isOpen,
  onOpenChange,
  user,
  onDeleteUser
}: UserDetailsDialogProps) {

  const [activeTab, setActiveTab] = useState("profil");
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventsLoadedForUser, setEventsLoadedForUser] = useState<string | null>(null);

  useEffect(() => {
    // Reset tab to profile when user changes or dialog closes
    if (!isOpen || (user && user.id !== eventsLoadedForUser)) {
      setActiveTab("profil");
    }
  }, [isOpen, user, eventsLoadedForUser]);

  useEffect(() => {
    if (isOpen && activeTab === "etkinlikler" && user && user.id !== eventsLoadedForUser) {
      console.log(`Fetching events for user: ${user.id}`);
      setIsLoadingEvents(true);
      setAttendedEvents([]);

      setTimeout(() => {
        const mockEvents: AttendedEvent[] = [
          { id: "evt1", title: "Sabah Koşusu", date: "2024-05-10", location: "Parkur" },
          { id: "evt2", title: "Basketbol Turnuvası", date: "2024-04-22", location: "Spor Salonu" },
          { id: "evt3", title: "Yoga Seansı", date: "2024-03-15", location: "Stüdyo" },
        ];
        
        const userSpecificEvents = user.id === "1" ? mockEvents.slice(0, 2) : user.id === "2" ? mockEvents.slice(1,3) : [];

        console.log("Fetched events:", userSpecificEvents);
        setAttendedEvents(userSpecificEvents);
        setIsLoadingEvents(false);
        setEventsLoadedForUser(user.id);
      }, 1500);

    } else if (user && user.id !== eventsLoadedForUser) {
       setEventsLoadedForUser(null);
       setAttendedEvents([]);
    }
  }, [activeTab, user, eventsLoadedForUser, isOpen]);


  if (!user) return null;

  const participationPercentage = user.totalEvents && user.totalEvents > 0 
    ? ((user.completedEvents || 0) / user.totalEvents) * 100 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto"> {/* Adjusted width/height */}
        <DialogHeader className="mb-4">
          <div className="flex justify-between items-center">
            <DialogTitle>Kullanıcı Detayları</DialogTitle>
            <Badge variant={user.status === "active" ? "default" : "secondary"} 
                   className={`mr-8 ${user.status === "active" ? "border-green-200 bg-green-100 text-green-800" : "border-gray-200 bg-gray-100 text-gray-800"}`}>
              {user.status === "active" ? "Aktif" : "Devre Dışı"}
            </Badge>
          </div>
          <DialogDescription>
            Kullanıcı detaylarını görüntüleyin ve gerekirse düzenleyin.
          </DialogDescription>
        </DialogHeader>

        {/* Removed flex justify-center as Dialog is centered by default */}
        <Tabs 
            defaultValue="profil" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
           >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="profil">Profil</TabsTrigger>
              <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profil" className="mt-0 space-y-6 p-4 border rounded-md bg-card shadow-sm">
              {/* Profile Content - Same as Sheet */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-20 w-20 text-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-4 w-4" />
                  {user.email}
                </div>
                <Badge variant="outline">{ROLE_LABELS[user.role] || user.role}</Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm"> {/* Adjusted grid for dialog width */}
                <div className="space-y-1">
                  <p className="text-muted-foreground">Telefon</p>
                  <p className="font-medium flex items-center">
                    <Phone className="mr-1 h-4 w-4 text-gray-400" /> 
                    {user.phone || "Belirtilmemiş"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Cinsiyet</p>
                  <p className="font-medium flex items-center">
                    <UserIcon className="mr-1 h-4 w-4 text-gray-400" /> 
                    {user.gender || "Belirtilmemiş"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Yaş</p>
                  <p className="font-medium flex items-center">
                    <UserIcon className="mr-1 h-4 w-4 text-gray-400" />
                    {user.age || "Belirtilmemiş"}
                  </p>
                </div>
                 <div className="space-y-1">
                  <p className="text-muted-foreground">Katılım Tarihi</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                    {user.joinDate || "Bilinmiyor"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Son Aktivite</p>
                  <p className="font-medium flex items-center">
                    <Activity className="mr-1 h-4 w-4 text-gray-400" />
                    {user.lastActivity || "Yok"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Adres</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                    {user.address || "Belirtilmemiş"}
                  </p>
                </div>
              </div>
              
              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center"><Info className="mr-1 h-4 w-4 text-gray-400"/> Hakkında</h4>
                <p className="text-sm text-muted-foreground">
                  {user.bio || "Kullanıcı hakkında bilgi yok."}
                </p>
              </div>

              <div className="space-y-2">
                 <h4 className="font-semibold flex items-center"><ThumbsUp className="mr-1 h-4 w-4 text-gray-400"/> Favori Kategoriler</h4>
                 <div className="flex flex-wrap gap-2">
                   {user.favoriteCategories && user.favoriteCategories.length > 0 ? (
                     user.favoriteCategories.map(category => (
                       <Badge key={category} variant="secondary">{category}</Badge>
                     ))
                   ) : (
                     <p className="text-sm text-muted-foreground">Favori kategori belirtilmemiş.</p>
                   )}
                 </div>
               </div>

              <div className="space-y-2">
                 <h4 className="font-semibold flex items-center"><ListChecks className="mr-1 h-4 w-4 text-gray-400"/> Etkinlik Katılımı</h4>
                 <div className="flex justify-between items-center text-sm mb-1">
                   <span>Tamamlanan Etkinlikler</span>
                   <span>{user.completedEvents ?? 0} / {user.totalEvents ?? 0}</span>
                 </div>
                 <Progress value={participationPercentage} aria-label="Etkinlik katılım oranı" />
               </div>

            <Separator />

             <Button 
               variant="destructive" 
               className="w-full mt-4 flex items-center gap-2"
               onClick={() => onDeleteUser(user.id)} // Call passed delete function
             >
              <Trash2 className="h-4 w-4"/> Kullanıcıyı Sil
             </Button>
            </TabsContent>
            
            <TabsContent value="etkinlikler" className="mt-0 space-y-4 p-4 border rounded-md bg-card shadow-sm">
              {/* Attended Events Content */}
              <h4 className="font-semibold">Katıldığı Etkinlikler</h4>
              {isLoadingEvents ? (
                 <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : attendedEvents.length > 0 ? (
                 <ul className="space-y-3">
                  {attendedEvents.map((event) => (
                    <li key={event.id} className="border-b pb-2">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} {event.location ? `- ${event.location}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Kullanıcının katıldığı etkinlik bulunamadı.
                </p>
              )}
            </TabsContent>
          </Tabs>

        {/* Dialog Footer can be added if needed */}
        {/* <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
} 