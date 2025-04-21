"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryCount } from "@/types/dashboard";
import { formatNumber } from "@/lib/uiUtils";
import { USER_CATEGORIES, getCategoryGrowthStyle } from "@/mockups";

export function UserTable() {
  // Generate dynamic categories from schema or use static USER_CATEGORIES
  const [categories] = useState<CategoryCount[]>(() => {
    // Using static USER_CATEGORIES from mockups
    return USER_CATEGORIES;
  });

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
                <TableCell className="text-right">
                  {formatNumber(category.count)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge style={getCategoryGrowthStyle(category.change)}>
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
  );
}
