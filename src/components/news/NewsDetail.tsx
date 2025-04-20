"use client";

import { NewsItem } from "@/types/news";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";

interface NewsDetailProps {
  news: NewsItem;
}

const WORDS_PER_PAGE = 300; // Her sayfada gösterilecek yaklaşık kelime sayısı

export function NewsDetail({ news }: NewsDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: tr });
  };

  // İçeriği sayfalara böl
  const pages = useMemo(() => {
    const words = news.content.split(/\s+/);
    const pages: string[] = [];
    let currentPageWords: string[] = [];
    let wordCount = 0;

    words.forEach((word) => {
      if (wordCount >= WORDS_PER_PAGE) {
        pages.push(currentPageWords.join(" "));
        currentPageWords = [];
        wordCount = 0;
      }
      currentPageWords.push(word);
      wordCount++;
    });

    if (currentPageWords.length > 0) {
      pages.push(currentPageWords.join(" "));
    }

    return pages.map((page) => {
      return page
        .split("\n\n")
        .filter(Boolean)
        .map((paragraph) => paragraph.trim());
    });
  }, [news.content]);

  const totalPages = pages.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <Card className="shadow-lg">
      {currentPage === 1 && news.image && news.image !== "/placeholder.jpg" && (
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover rounded-t-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader
        className={`space-y-6 ${currentPage === 1 ? "pt-6" : "pt-8"}`}
      >
        {currentPage === 1 && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-base px-4 py-1">
                {news.category}
              </Badge>
              {news.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight">
              {news.title}
            </CardTitle>
            <p className="text-base text-muted-foreground">
              {formatDate(news.publishDate)}
            </p>
          </>
        )}
        {currentPage > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Devamı...</p>
            <p className="text-sm font-medium">{news.title}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {pages[currentPage - 1]?.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Önceki Sayfa
            </Button>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium">
                Sayfa {currentPage} / {totalPages}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round((currentPage / totalPages) * 100)}% Tamamlandı
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Sonraki Sayfa
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
