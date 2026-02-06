import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { storagePut, storageGet } from "./storage";
import { nanoid } from "nanoid";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product management
  products: router({
    list: publicProcedure.query(async () => {
      return await db.getAllProducts();
    }),

    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const allProducts = await db.getAllProducts();
        const trimmedQuery = input.query.trim();
        if (!trimmedQuery) {
          return allProducts;
        }
        const searchTerm = trimmedQuery.toLowerCase();
        return allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        return product;
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        type: z.enum(['digital', 'physical']),
        category: z.enum([
          'agent_workflows',
          'automated_workflows',
          'voice_chat_bots',
          'websites',
          'personal_assistant_agents',
          'social_media_post_packs',
          'social_media_content_topics',
          'talking_avatars',
          'branded_assets'
        ]),
        imageUrl: z.string().optional(),
        digitalFileKey: z.string().optional(),
        digitalFileName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createProduct(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        type: z.enum(['digital', 'physical']).optional(),
        category: z.enum([
          'agent_workflows',
          'automated_workflows',
          'voice_chat_bots',
          'websites',
          'personal_assistant_agents',
          'social_media_post_packs',
          'social_media_content_topics',
          'talking_avatars',
          'branded_assets'
        ]).optional(),
        imageUrl: z.string().optional(),
        digitalFileKey: z.string().optional(),
        digitalFileName: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        return await db.updateProduct(id, updates);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // Checkout and payment
  checkout: router({
    createSession: publicProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        // Fetch products and calculate total
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        let totalAmount = 0;

        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: `Product ${item.productId} not found` });
          }

          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
                images: product.imageUrl ? [product.imageUrl] : [],
              },
              unit_amount: product.price,
            },
            quantity: item.quantity,
          });

          totalAmount += product.price * item.quantity;
        }

        // Create Stripe checkout session
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
          mode: 'payment',
          line_items: lineItems,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cart`,
          allow_promotion_codes: true,
          metadata: {
            items: JSON.stringify(input.items),
          },
        };

        // Add customer info if authenticated
        if (ctx.user) {
          sessionParams.customer_email = ctx.user.email || undefined;
          sessionParams.client_reference_id = ctx.user.id.toString();
          sessionParams.metadata!.user_id = ctx.user.id.toString();
          sessionParams.metadata!.customer_email = ctx.user.email || '';
          sessionParams.metadata!.customer_name = ctx.user.name || '';
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return {
          sessionId: session.id,
          url: session.url!,
        };
      }),

    getSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return session;
      }),
  }),

  // Order management
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getOrdersByUserId(ctx.user.id);
    }),

    listAll: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        // Check authorization
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        const items = await db.getOrderItemsByOrderId(order.id);
        return { ...order, items };
      }),

    getItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        // Check authorization
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        return await db.getOrderItemsByOrderId(input.orderId);
      }),
  }),

  // Digital downloads
  downloads: router({
    getDownloadUrl: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const download = await db.getDigitalDownloadByToken(input.token);
        if (!download) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Download not found' });
        }

        // Check expiry
        if (new Date() > download.expiresAt) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Download link has expired' });
        }

        // Check download limit
        if (download.downloadCount >= download.maxDownloads) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Download limit reached' });
        }

        // Get order item to verify ownership
        const orderItem = await db.getOrderItemById(download.orderItemId);
        if (!orderItem) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order item not found' });
        }

        const order = await db.getOrderById(orderItem.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        // Verify user owns this order
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        // Increment download count
        await db.incrementDownloadCount(download.id);

        // Generate presigned URL for download
        if (!orderItem.digitalFileKey) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'No file available for download' });
        }

        const { url } = await storageGet(orderItem.digitalFileKey); // Generate presigned URL

        return {
          url,
          filename: orderItem.digitalFileName || 'download',
          remainingDownloads: download.maxDownloads - download.downloadCount - 1,
        };
      }),

    listByOrder: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }

        // Verify ownership
        if (ctx.user.role !== 'admin' && order.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        const items = await db.getOrderItemsByOrderId(input.orderId);
        const digitalItems = items.filter(item => item.productType === 'digital');

        const downloads = await Promise.all(
          digitalItems.map(async (item) => {
            const downloadTokens = await db.getDigitalDownloadsByOrderItemId(item.id);
            return {
              item,
              downloads: downloadTokens,
            };
          })
        );

        return downloads;
      }),
  }),

  // Reviews
  reviews: router({
    getByProduct: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductReviews(input.productId);
      }),

    getAverageRating: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProductAverageRating(input.productId);
      }),

    canUserReview: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ ctx, input }) => {
        const hasPurchased = await db.hasUserPurchasedProduct(ctx.user.id, input.productId);
        const hasReviewed = await db.hasUserReviewedProduct(ctx.user.id, input.productId);
        
        return {
          canReview: hasPurchased && !hasReviewed,
          hasPurchased,
          hasReviewed,
        };
      }),

    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify user has purchased the product
        const hasPurchased = await db.hasUserPurchasedProduct(ctx.user.id, input.productId);
        if (!hasPurchased) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must purchase this product before leaving a review',
          });
        }

        // Check if user already reviewed
        const hasReviewed = await db.hasUserReviewedProduct(ctx.user.id, input.productId);
        if (hasReviewed) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You have already reviewed this product',
          });
        }

        // Get the order ID for this user and product
        const userOrders = await db.getOrdersByUserId(ctx.user.id);
        let orderId: number | null = null;
        
        for (const order of userOrders) {
          if (order.status === 'completed') {
            const items = await db.getOrderItemsByOrderId(order.id);
            const hasProduct = items.some(item => item.productId === input.productId);
            if (hasProduct) {
              orderId = order.id;
              break;
            }
          }
        }

        if (!orderId) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found for this product',
          });
        }

        // Create the review
        const review = await db.createReview({
          productId: input.productId,
          userId: ctx.user.id,
          orderId,
          rating: input.rating,
          comment: input.comment || null,
          isVerified: 1,
        });

        return review;
      }),
  }),

  // Newsletter
  newsletter: router({  
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          await db.subscribeToNewsletter(input.email);
          return { success: true, message: 'Successfully subscribed to newsletter!' };
        } catch (error: any) {
          // Check for duplicate entry error (MySQL error code or message)
          if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry') || error.message?.includes('unique constraint')) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'This email is already subscribed to our newsletter',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to subscribe. Please try again later.',
          });
        }
      }),

    list: adminProcedure.query(async () => {
      return await db.getAllNewsletterSubscribers();
    }),
  }),
});

export type AppRouter = typeof appRouter;
