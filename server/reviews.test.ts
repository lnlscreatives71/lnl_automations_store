import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock database functions
vi.mock("./db", () => ({
  getProductReviews: vi.fn(),
  getProductAverageRating: vi.fn(),
  hasUserPurchasedProduct: vi.fn(),
  hasUserReviewedProduct: vi.fn(),
  createReview: vi.fn(),
  getOrdersByUserId: vi.fn(),
  getOrderItemsByOrderId: vi.fn(),
}));

function createAuthenticatedContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getByProduct", () => {
    it("returns reviews for a product", async () => {
      const mockReviews = [
        {
          id: 1,
          rating: 5,
          comment: "Great product!",
          isVerified: 1,
          createdAt: new Date(),
          userId: 1,
          userName: "Test User",
        },
      ];

      vi.mocked(db.getProductReviews).mockResolvedValue(mockReviews);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.getByProduct({ productId: 1 });

      expect(result).toEqual(mockReviews);
      expect(db.getProductReviews).toHaveBeenCalledWith(1);
    });
  });

  describe("getAverageRating", () => {
    it("returns average rating for a product", async () => {
      const mockRating = { average: 4.5, count: 10 };

      vi.mocked(db.getProductAverageRating).mockResolvedValue(mockRating);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.getAverageRating({ productId: 1 });

      expect(result).toEqual(mockRating);
      expect(db.getProductAverageRating).toHaveBeenCalledWith(1);
    });
  });

  describe("canUserReview", () => {
    it("returns true when user purchased but hasn't reviewed", async () => {
      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(true);
      vi.mocked(db.hasUserReviewedProduct).mockResolvedValue(false);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.canUserReview({ productId: 1 });

      expect(result).toEqual({
        canReview: true,
        hasPurchased: true,
        hasReviewed: false,
      });
    });

    it("returns false when user hasn't purchased", async () => {
      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(false);
      vi.mocked(db.hasUserReviewedProduct).mockResolvedValue(false);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.canUserReview({ productId: 1 });

      expect(result).toEqual({
        canReview: false,
        hasPurchased: false,
        hasReviewed: false,
      });
    });

    it("returns false when user already reviewed", async () => {
      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(true);
      vi.mocked(db.hasUserReviewedProduct).mockResolvedValue(true);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.canUserReview({ productId: 1 });

      expect(result).toEqual({
        canReview: false,
        hasPurchased: true,
        hasReviewed: true,
      });
    });
  });

  describe("create", () => {
    it("creates a review for verified purchaser", async () => {
      const mockReview = {
        id: 1,
        productId: 1,
        userId: 1,
        orderId: 1,
        rating: 5,
        comment: "Excellent!",
        isVerified: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(true);
      vi.mocked(db.hasUserReviewedProduct).mockResolvedValue(false);
      vi.mocked(db.getOrdersByUserId).mockResolvedValue([
        {
          id: 1,
          userId: 1,
          customerEmail: "test@example.com",
          customerName: "Test User",
          stripePaymentIntentId: "pi_test",
          stripeCheckoutSessionId: "cs_test",
          totalAmount: 9900,
          status: "completed",
          shippingAddress: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      vi.mocked(db.getOrderItemsByOrderId).mockResolvedValue([
        {
          id: 1,
          orderId: 1,
          productId: 1,
          productName: "Test Product",
          productType: "digital",
          quantity: 1,
          priceAtPurchase: 9900,
          digitalFileKey: null,
          digitalFileName: null,
          createdAt: new Date(),
        },
      ]);
      vi.mocked(db.createReview).mockResolvedValue(mockReview);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.create({
        productId: 1,
        rating: 5,
        comment: "Excellent!",
      });

      expect(result).toEqual(mockReview);
      expect(db.createReview).toHaveBeenCalled();
    });

    it("throws error when user hasn't purchased product", async () => {
      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(false);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.create({
          productId: 1,
          rating: 5,
          comment: "Great!",
        })
      ).rejects.toThrow("You must purchase this product before leaving a review");
    });

    it("throws error when user already reviewed", async () => {
      vi.mocked(db.hasUserPurchasedProduct).mockResolvedValue(true);
      vi.mocked(db.hasUserReviewedProduct).mockResolvedValue(true);

      const ctx = createAuthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.create({
          productId: 1,
          rating: 5,
          comment: "Great!",
        })
      ).rejects.toThrow("You have already reviewed this product");
    });
  });
});
