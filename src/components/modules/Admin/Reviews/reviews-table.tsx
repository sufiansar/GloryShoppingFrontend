"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  Package,
  Calendar,
  Filter,
  User,
  History,
  ShoppingBag
} from "lucide-react";

import { deleteReview, updateReview } from "@/action/review/review.action";
import { ReviewDetailsModal } from "./review-details-modal";
import { ReviewEditModal } from "./review-edit-modal";
import { ReviewDeleteModal } from "./review-delete-modal";
import { toast } from "sonner";
import Pagination from "@/components/Shared/Pagination";
import { formatDate } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  rating: number;
  comment: string;
  title?: string;
  status: "published" | "pending" | "hidden";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  product: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ReviewsTableProps {
  initialData: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function ReviewsTable({ initialData, pagination }: ReviewsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [reviews, setReviews] = useState<Review[]>(initialData);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700"
              }`}
          />
        ))}
      </div>
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/dashboard/reviews?${params.toString()}`);
  };

  function onItemsPerPageChange(limit: number): void {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`/admin/dashboard/reviews?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      {/* Table Section - Premium Hybrid-List UI */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-premium">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-transparent">
                <TableHead className="py-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rating & Review</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</TableHead>
                <TableHead className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Temporal Data</TableHead>
                <TableHead className="text-right py-6 pr-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Empty Feedback Domain</span>
                        <p className="text-sm font-bold text-slate-500">No testimonials found for this query.</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id} className="premium-table-row border-b border-slate-100/30 dark:border-slate-800/20 group/row">
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="relative group/avatar">
                          <div className="absolute inset-0 bg-primary-custom/20 blur-lg rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                          <Avatar className="h-12 w-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow-sm relative z-10">
                            <AvatarImage src={review.user.avatar} className="object-cover" />
                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-400 font-black">
                              {review.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[140px]">
                            {review.user.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {review.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 max-w-[300px]">
                        <div className="flex items-center gap-3">
                           {getRatingStars(review.rating)}
                           <Badge className={`rounded-lg font-black text-[8px] uppercase tracking-[0.1em] px-2 py-0.5 ${
                              review.status === "published" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                              review.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                              "bg-slate-500/10 text-slate-600 border-slate-500/20"
                           }`}>
                             {review.status}
                           </Badge>
                        </div>
                        <div className="bg-white/30 dark:bg-slate-800/30 p-3 rounded-2xl border border-white/20 shadow-xs">
                          {review.title && (
                            <div className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-1 tracking-tight">
                              {review.title}
                            </div>
                          )}
                          <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 group/product cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs shrink-0 group-hover/product:scale-110 transition-transform duration-500">
                          {review.product.image ? (
                            <img
                              src={review.product.image}
                              alt={review.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-full w-full p-2 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 truncate max-w-[150px] group-hover/product:text-primary-custom transition-colors">
                            {review.product.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {review.product.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-500">
                           <Calendar className="h-3 w-3" />
                           <span className="text-[10px] font-black uppercase whitespace-nowrap">
                             {formatDate(new Date(review.createdAt), "MMM d, yyyy")}
                           </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                           <History className="h-3 w-3" />
                           <span className="text-[9px] font-bold">
                             Updated {formatDate(new Date(review.updatedAt), "HH:mm")}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all active:scale-90 p-0">
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-white/20 dark:border-slate-800/50 backdrop-blur-3xl glass-card">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Operations</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review);
                              setIsDetailsModalOpen(true);
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl focus:bg-primary-custom/10 focus:text-primary-custom transition-all cursor-pointer font-bold"
                          >
                             <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Eye className="h-4 w-4 text-blue-500" />
                            </div>
                            View Dossier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review);
                              setIsEditModalOpen(true);
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl focus:bg-amber-500/10 focus:text-amber-600 transition-all cursor-pointer font-bold"
                          >
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <Edit className="h-4 w-4 text-amber-500" />
                            </div>
                            Update Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="mx-2 bg-slate-100 dark:bg-slate-800/50" />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review);
                              setIsDeleteModalOpen(true);
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-all cursor-pointer font-bold text-rose-500"
                          >
                            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                              <Trash2 className="h-4 w-4" />
                            </div>
                            Purge Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && (
          <div className="p-8 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800/30">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              itemsPerPageOptions={[12, 24, 48, 96]}
              onPageChange={handlePageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      <ReviewDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        review={selectedReview}
      />

      {/* Edit Modal */}
      <ReviewEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        review={selectedReview}
        onSave={(updated) => {
          setReviews((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
          );
        }}
      />

      {/* Delete Modal */}
      <ReviewDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        review={selectedReview}
        onDelete={() => {
          setReviews((prev) => prev.filter((r) => r.id !== selectedReview?.id));
        }}
      />
    </div>
  );
}
