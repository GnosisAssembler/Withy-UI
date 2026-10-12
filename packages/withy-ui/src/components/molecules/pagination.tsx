"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../atoms/button";
import { cn } from "../../lib/cn";

type PaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function pageItems(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "gap", pages];
  if (page >= pages - 3) return [1, "gap", pages - 4, pages - 3, pages - 2, pages - 1, pages];
  return [1, "gap", page - 1, page, page + 1, "gap", pages];
}

export function Pagination({ page, pages, onPageChange, className }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <Button
        icon
        size="sm"
        color="white"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      {pageItems(page, pages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden className="px-1 text-[13px] text-text-3">
            …
          </span>
        ) : (
          <Button
            key={item}
            size="sm"
            color={item === page ? "primary" : "white"}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className="min-w-8 px-2"
          >
            {item}
          </Button>
        ),
      )}
      <Button
        icon
        size="sm"
        color="white"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
