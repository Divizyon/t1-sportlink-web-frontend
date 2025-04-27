import React, { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";

interface PaginatedListProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  listClassName?: string;
  paginationClassName?: string;
}

export function PaginatedList<T>({
  items,
  pageSize = 10,
  renderItem,
  emptyMessage = "No items found",
  className,
  listClassName,
  paginationClassName,
}: PaginatedListProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">{emptyMessage}</div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className={className}>
      <div className={listClassName}>
        {currentItems.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          totalItems={items.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className={paginationClassName}
        />
      </div>
    </div>
  );
}
