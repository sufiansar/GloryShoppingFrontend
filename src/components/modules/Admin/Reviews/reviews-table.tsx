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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";

import { deleteReview, updateReview } from "@/action/review/review.action";
import { ReviewDetailsModal } from "./review-details-modal";
import { ReviewEditModal } from "./review-edit-modal";
import { ReviewDeleteModal } from "./review-delete-modal";
import { toast } from "sonner";
import Router from "next/router";
import Pagination from "@/components/Shared/Pagination";
import { formatDate } from "date-fns";

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

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview.id);
      setReviews((prev) =>
        prev.filter((review) => review.id !== selectedReview.id),
      );
      toast.success("Review deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete review");
      setIsDeleteModalOpen(false);
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
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
    params.set("page", "1"); // Reset to first page when changing items per page
    router.push(`/admin/dashboard/reviews?${params.toString()}`);
  }

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Review</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {review.title && (
                        <span className="font-medium">{review.title}</span>
                      )}
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.avatar} />
                        <AvatarFallback>
                          {review.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {review.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {review.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {review.product.image && (
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={review.product.image}
                            alt={review.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-sm">{review.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRatingStars(review.rating)}</TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {formatDate(new Date(review.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(new Date(review.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Review
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            itemsPerPageOptions={[12, 24, 48, 96]}
            onPageChange={handlePageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            className="mt-4"
          />
        )}
      </Card>
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
    </>
  );
}
