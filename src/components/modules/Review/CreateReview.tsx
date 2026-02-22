"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, Send, Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { createReview } from "@/action/review/review.action";

// Form validation schema
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const baseColor = "oklch(52.801% 0.15987 344.323)";

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const watchedRating = form.watch("rating");

  const onSubmit = async (values: ReviewFormValues) => {
    if (status !== "authenticated" || !session?.user) {
      toast.error("Please login to submit a review");
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId,
        userId: session.user.id,
        rating: values.rating,
        comment: values.comment || undefined,
      };

      const result = await createReview(reviewData);

      if (result?.id) {
        toast.success("Review submitted successfully!");
        form.reset();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        throw new Error(result?.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(
        error.message || "Failed to submit review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>; // or a spinner
  }

  if (status === "unauthenticated") {
    return (
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${baseColor}, #db2777)`,
          }}
        />
        <CardContent className="p-6 text-center">
          <AlertCircle
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: baseColor }}
          />
          <h3 className="text-lg font-semibold mb-2">
            Want to share your experience?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Please login to write a review for this product.
          </p>
          <Button
            onClick={() =>
              router.push(
                "/login?redirect=" +
                  encodeURIComponent(window.location.pathname),
              )
            }
            style={{
              background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
            }}
            className="text-white"
          >
            Login to Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${baseColor}, #db2777)` }}
      />

      <CardHeader className="pb-4">
        <CardTitle className="text-xl" style={{ color: baseColor }}>
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience with this product
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Stars */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Your Rating <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-all transform hover:scale-110"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                          >
                            <Star
                              className={`w-10 h-10 transition-colors ${
                                star <= (hoveredRating || field.value)
                                  ? "fill-current"
                                  : "fill-none"
                              }`}
                              style={{
                                color:
                                  star <= (hoveredRating || field.value)
                                    ? baseColor
                                    : "#cbd5e1",
                              }}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Rating Text */}
                      <div className="text-center">
                        {field.value === 0 && (
                          <p className="text-sm text-slate-500">
                            Click a star to rate
                          </p>
                        )}
                        {field.value === 1 && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: baseColor }}
                          >
                            Poor - Not satisfied
                          </p>
                        )}
                        {field.value === 2 && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: baseColor }}
                          >
                            Fair - Could be better
                          </p>
                        )}
                        {field.value === 3 && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: baseColor }}
                          >
                            Good - Satisfied
                          </p>
                        )}
                        {field.value === 4 && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: baseColor }}
                          >
                            Very Good - Happy with purchase
                          </p>
                        )}
                        {field.value === 5 && (
                          <p
                            className="text-sm font-medium"
                            style={{ color: baseColor }}
                          >
                            Excellent - Absolutely love it!
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Review Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    Your Review{" "}
                    <span className="text-slate-400 text-xs font-normal">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell others what you think about this product..."
                      className="min-h-32 resize-none bg-slate-50 border-slate-200 rounded-xl transition-all focus:outline"
                      style={{ outlineColor: `${baseColor}40` }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 border-slate-200"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || watchedRating === 0}
                className="flex-1 h-11 text-white transition-all transform hover:scale-[1.02] shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}, #db2777)`,
                  opacity: isSubmitting || watchedRating === 0 ? 0.7 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
