import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Pagination = ({
  totalItems,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  className,
  siblingCount = 1,
}: {
  totalItems: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}) => {
  // Ensure we have valid numbers
  const validTotalItems = Math.max(0, totalItems || 0);
  const validPageSize = Math.max(1, pageSize || 10);
  const totalPages = Math.max(1, Math.ceil(validTotalItems / validPageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Log debug info
  console.log(
    `Pagination: totalItems=${validTotalItems}, pageSize=${validPageSize}, totalPages=${totalPages}, currentPage=${validCurrentPage}`
  );

  const getPageNumbers = () => {
    if (totalPages <= 1) {
      return [1];
    }

    const totalPageNumbers = siblingCount * 2 + 3;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(validCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      validCurrentPage + siblingCount,
      totalPages
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "dots", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "dots", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "dots", ...middleRange, "dots", totalPages];
    }

    // Fallback
    return [1];
  };

  const pages = getPageNumbers();

  // If we have no items or just one page, don't render pagination
  if (validTotalItems <= 0 || totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, validCurrentPage - 1))}
        disabled={validCurrentPage === 1}
        className="h-8 w-8"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages?.map((page, i) => {
        if (page === "dots") {
          return (
            <span
              key={`dots-${i}`}
              className="flex h-8 w-8 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant={validCurrentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
            className={cn(
              "h-8 w-8",
              validCurrentPage === page ? "pointer-events-none" : ""
            )}
            aria-label={`Page ${page}`}
            aria-current={validCurrentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, validCurrentPage + 1))}
        disabled={validCurrentPage === totalPages}
        className="h-8 w-8"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export { Pagination };
