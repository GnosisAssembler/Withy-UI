"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ page, pages, onPageChange, className }: PaginationProps) {
  const items = Array.from({ length: pages }, (_, index) => index + 1);
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <Button
        icon
        size="sm"
        color="white"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      {items.map((item) => (
        <Button
          key={item}
          size="sm"
          color={item === page ? "primary" : "white"}
          active={item === page}
          aria-label={`Page ${item}`}
          aria-current={item === page ? "page" : undefined}
          onClick={() => onPageChange(item)}
          className="min-w-8"
        >
          {item}
        </Button>
      ))}
      <Button
        icon
        size="sm"
        color="white"
        aria-label="Next page"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
