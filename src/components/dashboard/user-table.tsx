"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const categories = [
  { name: "Futbol", count: 156, change: "+12%" },
  { name: "Basketbol", count: 98, change: "+5%" },
  { name: "Yüzme", count: 65, change: "+22%" },
  { name: "Tenis", count: 54, change: "-3%" },
  { name: "Koşu", count: 42, change: "+9%" },
  { name: "Yoga", count: 36, change: "+18%" },
  { name: "Fitness", count: 28, change: "+7%" },
]

export function UserTable() {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Kullanıcı</TableHead>
              <TableHead className="text-right">Değişim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">{category.count}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      category.change.startsWith("+")
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {category.change}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Son 30 günde kategorilere göre kullanıcı değişimi
      </div>
    </div>
  )
} 