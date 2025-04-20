"use client"

import { NewsItem } from "@/types/news"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface NewsListProps {
  news: NewsItem[]
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Henüz haber bulunmuyor.
        </p>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Link href={`/news/${item.id}`} key={item.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant={item.status === "approved" ? "default" : "secondary"}>
                  {item.status === "approved" ? "Onaylandı" : "Onay Bekliyor"}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {formatDate(item.publishDate)}
              </p>
              <p className="mt-2 line-clamp-3">{item.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 