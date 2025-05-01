"use client";

import { NewsItem } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BellIcon, Edit } from "lucide-react";

interface AnnouncementCardProps {
  announcement: NewsItem;
  onEdit: (announcement: NewsItem) => void;
}

export function AnnouncementCard({ announcement, onEdit }: AnnouncementCardProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="flex">
        {announcement.hasImage && announcement.image && (
          <div className="w-[200px] h-[160px] relative overflow-hidden">
            <img 
              src={announcement.image} 
              alt={announcement.title} 
              className="h-full w-full object-cover"
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = "https://via.placeholder.com/200x160?text=Görsel+Yok";
              }}
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-primary">{announcement.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Duyuru
              </Badge>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(announcement)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{announcement.content}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {new Date(announcement.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {announcement.sendNotification && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                <BellIcon className="h-3 w-3 mr-1" />
                Bildirim Gönderildi
              </Badge>
            )}
          </div>
          
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {announcement.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 