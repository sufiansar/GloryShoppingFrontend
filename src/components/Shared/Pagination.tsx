// components/shared/Pagination.tsx

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  showPageNumbers?: boolean;
  showItemsPerPage?: boolean;
  showTotalItems?: boolean;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  showPageNumbers = true,
  showItemsPerPage = true,
  showTotalItems = true,
  className = "",
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Normalize to numbers to avoid string concatenation issues (e.g., "1" + 1 = "11")
  const current = Number(currentPage) || 1;
  const itemsLimit = Number(itemsPerPage) || 10;
  
  // Robust total pages calculation: prioritize backend's totalPages if it's greater than 1, 
  // otherwise calculate from totalItems and itemsPerPage.
  const calculatedTotal = Math.ceil(Number(totalItems) / itemsLimit);
  const total = Math.max(Number(totalPages), calculatedTotal) || 0;
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > total || page === current) return;

    if (onPageChange) {
      onPageChange(page);
    } else {
      // Update URL if no callback provided
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = parseInt(value);

    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    } else {
      // Update URL if no callback provided
      const params = new URLSearchParams(searchParams);
      params.set("limit", value);
      params.set("page", "1"); // Reset to first page when changing items per page
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const startItem = totalItems > 0 ? (current - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(current * itemsPerPage, totalItems);

  if (total <= 1 && !showItemsPerPage && !showTotalItems) {
    return null;
  }

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-[2rem] border border-white/40 dark:border-slate-800/50 shadow-sm transition-all duration-500 ${className}`}
    >
      {/* Left side - Items per page selector */}
      {showItemsPerPage && (
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-inner w-full md:w-auto justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-3">Rows</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20 h-9 bg-white dark:bg-slate-900 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary-custom/30 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/20 dark:border-slate-700 backdrop-blur-xl glass-card">
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()} className="rounded-xl font-bold focus:bg-primary-custom/10 focus:text-primary-custom cursor-pointer">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Right/Center - Page info and navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-center">
        {/* Total items info */}
        {showTotalItems && totalItems > 0 && (
          <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            Showing <span className="text-slate-800 dark:text-slate-200">{startItem}</span> - <span className="text-slate-800 dark:text-slate-200">{endItem}</span> of <span className="text-primary-custom">{totalItems}</span>
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/50 dark:bg-slate-800/50 p-1 sm:p-1.5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-inner">
          {/* First page button */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={current === 1}
            aria-label="First page"
            className="h-10 w-10 min-w-[2.5rem] rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-primary-custom hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 hidden xl:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="ghost"
            type="button"
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            aria-label="Previous page"
            className="h-10 px-4 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-primary-custom hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          {/* Page numbers */}
          {showPageNumbers && total > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 sm:mx-1">
              {getPageNumbers().map((page: any, index: any) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 py-2 text-slate-400 font-bold"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handlePageChange(page as number)}
                    className={`h-10 min-w-[2.5rem] rounded-xl font-black text-sm transition-all duration-300 ${current === page ? 'bg-primary-custom text-white shadow-lg shadow-primary-custom/30 hover:bg-primary-custom hover:text-white scale-105' : 'hover:bg-white dark:hover:bg-slate-700 hover:text-primary-custom hover:shadow-sm text-slate-600 dark:text-slate-300'}`}
                    aria-label={`Page ${page}`}
                    aria-current={current === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
          )}

          {/* Next page button */}
          <Button
            variant="ghost"
            type="button"
            onClick={() => handlePageChange(current + 1)}
            disabled={current === total || total === 0}
            aria-label="Next page"
            className="h-10 px-4 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-primary-custom hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page button */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => handlePageChange(total)}
            disabled={current === total || total === 0}
            aria-label="Last page"
            className="h-10 w-10 min-w-[2.5rem] rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-primary-custom hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-300 hidden xl:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
