import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading: reviewsLoading } = trpc.reviews.getByProduct.useQuery({ productId });
  const { data: averageRating } = trpc.reviews.getAverageRating.useQuery({ productId });
  const { data: canReview } = trpc.reviews.canUserReview.useQuery(
    { productId },
    { enabled: isAuthenticated }
  );

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    createReview.mutate({
      productId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? (hoverRating || rating) : count)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      {averageRating && averageRating.count > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              {averageRating.average.toFixed(1)} out of 5 stars ({averageRating.count} review
              {averageRating.count !== 1 ? "s" : ""})
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStars(Math.round(averageRating.average))}</CardContent>
        </Card>
      )}

      {/* Write a Review Form */}
      {isAuthenticated && canReview?.canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience with this product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                {renderStars(rating, true)}
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Your Review (Optional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you think about this product..."
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={createReview.isPending}>
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Message for users who can't review */}
      {isAuthenticated && canReview && !canReview.canReview && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              {canReview.hasReviewed
                ? "You have already reviewed this product."
                : "Purchase this product to leave a review."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {reviewsLoading ? (
          <p className="text-muted-foreground">Loading reviews...</p>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {review.userName || "Anonymous"}
                      {review.isVerified === 1 && (
                        <span className="ml-2 text-xs text-green-600 font-normal">
                          Verified Purchase
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </CardHeader>
              {review.comment && (
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
