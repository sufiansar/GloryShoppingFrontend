// app/admin/dashboard/reviews/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download, Star } from "lucide-react";
import { ReviewsTableSkeleton } from "@/components/modules/Admin/Reviews/reviews-table-skeleton";
import { getAllReviews } from "@/action/review/review.action";
import { ReviewsTable } from "@/components/modules/Admin/Reviews/reviews-table";

export const metadata: Metadata = {
  title: "Review Management | Admin Dashboard",
  description: "Manage customer reviews and ratings",
};

interface ReviewsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    rating?: string;
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const queryString = new URLSearchParams({
    page: searchParams.page || "1",
    limit: searchParams.limit || "12",
    sortBy: searchParams.sortBy || "createdAt",
    sortOrder: searchParams.sortOrder || "desc",
    ...(searchParams.search && { search: searchParams.search }),
    ...(searchParams.rating && { rating: searchParams.rating }),
  }).toString();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Manage and moderate customer reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <form className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search by comment or product..."
                className="pl-8"
                defaultValue={searchParams.search}
              />
            </div>
            <Button variant="outline" size="icon" type="submit">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select name="rating" defaultValue={searchParams.rating}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="sortBy"
              defaultValue={searchParams.sortBy || "createdAt"}
            >
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="sortOrder"
              defaultValue={searchParams.sortOrder || "desc"}
            >
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </Card>

      <Suspense fallback={<ReviewsTableSkeleton />}>
        <ReviewsTableContainer queryString={queryString} />
      </Suspense>
    </div>
  );
}

async function ReviewsTableContainer({ queryString }: { queryString: string }) {
  const result = await getAllReviews(queryString);

  return (
    <ReviewsTable
      initialData={result?.data || []}
      pagination={result?.pagination}
    />
  );
}
