import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronRight,
  Plus,
  Flag,
  Settings,
  Shield,
  Newspaper,
} from "lucide-react";
import { REPORTS } from "@/mocks/reports";

export function Sidebar() {
  const [openEvents, setOpenEvents] = useState(false);

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setOpenEvents(!openEvents)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Etkinlikler
        <ChevronRight
          className={`ml-auto h-4 w-4 transition-transform ${
            openEvents ? "rotate-90" : ""
          }`}
        />
      </Button>
      {openEvents && (
        <div className="ml-4 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/events">
              <Calendar className="mr-2 h-4 w-4" />
              Tüm Etkinlikler
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Etkinlik
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/reports">
              <Flag className="mr-2 h-4 w-4" />
              Raporlar
              <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4">
                {REPORTS.filter((r) => r.status === "pending").length}
              </Badge>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/security">
              <Shield className="mr-2 h-4 w-4" />
              Güvenlik
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href="/dashboard/news">
              <Newspaper className="mr-2 h-4 w-4" />
              Haberler
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 