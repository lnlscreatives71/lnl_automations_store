import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  products, InsertProduct, Product,
  orders, InsertOrder, Order,
  orderItems, InsertOrderItem, OrderItem,
  digitalDownloads, InsertDigitalDownload, DigitalDownload,
  reviews, InsertReview, Review,
  newsletterSubscribers, InsertNewsletterSubscriber, NewsletterSubscriber
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Product Queries =====

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products).where(eq(products.isActive, 1)).orderBy(desc(products.createdAt));
  return result;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  const insertedId = Number(result[0].insertId);
  
  const newProduct = await getProductById(insertedId);
  if (!newProduct) throw new Error("Failed to retrieve created product");
  
  return newProduct;
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(updates).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Soft delete
  await db.update(products).set({ isActive: 0 }).where(eq(products.id, id));
}

// ===== Order Queries =====

export async function createOrder(order: InsertOrder): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  const insertedId = Number(result[0].insertId);
  
  const newOrder = await getOrderById(insertedId);
  if (!newOrder) throw new Error("Failed to retrieve created order");
  
  return newOrder;
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function getOrderByPaymentIntent(paymentIntentId: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, paymentIntentId)).limit(1);
  return result[0];
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  return result;
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return result;
}

export async function updateOrderStatus(id: number, status: Order["status"]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set({ status }).where(eq(orders.id, id));
}

// ===== Order Item Queries =====

export async function createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orderItems).values(item);
  const insertedId = Number(result[0].insertId);
  
  const newItem = await getOrderItemById(insertedId);
  if (!newItem) throw new Error("Failed to retrieve created order item");
  
  return newItem;
}

export async function getOrderItemById(id: number): Promise<OrderItem | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orderItems).where(eq(orderItems.id, id)).limit(1);
  return result[0];
}

export async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return result;
}

// ===== Digital Download Queries =====

export async function createDigitalDownload(download: InsertDigitalDownload): Promise<DigitalDownload> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(digitalDownloads).values(download);
  const insertedId = Number(result[0].insertId);
  
  const newDownload = await getDigitalDownloadById(insertedId);
  if (!newDownload) throw new Error("Failed to retrieve created digital download");
  
  return newDownload;
}

export async function getDigitalDownloadById(id: number): Promise<DigitalDownload | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(digitalDownloads).where(eq(digitalDownloads.id, id)).limit(1);
  return result[0];
}

export async function getDigitalDownloadByToken(token: string): Promise<DigitalDownload | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(digitalDownloads).where(eq(digitalDownloads.downloadToken, token)).limit(1);
  return result[0];
}

export async function incrementDownloadCount(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const download = await getDigitalDownloadById(id);
  if (!download) throw new Error("Digital download not found");
  
  await db.update(digitalDownloads)
    .set({ downloadCount: download.downloadCount + 1 })
    .where(eq(digitalDownloads.id, id));
}

export async function getDigitalDownloadsByOrderItemId(orderItemId: number): Promise<DigitalDownload[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(digitalDownloads).where(eq(digitalDownloads.orderItemId, orderItemId));
  return result;
}

// ===== Review Queries =====

export async function createReview(review: InsertReview): Promise<Review> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reviews).values(review);
  const insertedId = Number(result[0].insertId);
  
  const newReview = await getReviewById(insertedId);
  if (!newReview) throw new Error("Failed to retrieve created review");
  
  return newReview;
}

export async function getReviewById(id: number): Promise<Review | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return result[0];
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      userId: reviews.userId,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

export async function hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select({ orderId: orderItems.orderId })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.productId, productId),
        eq(orders.status, "completed")
      )
    )
    .limit(1);
  
  return result.length > 0;
}

export async function hasUserReviewedProduct(userId: number, productId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(
        eq(reviews.userId, userId),
        eq(reviews.productId, productId)
      )
    )
    .limit(1);
  
  return result.length > 0;
}

export async function getProductAverageRating(productId: number): Promise<{ average: number; count: number }> {
  const db = await getDb();
  if (!db) return { average: 0, count: 0 };
  
  const productReviews = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(eq(reviews.productId, productId));
  
  if (productReviews.length === 0) {
    return { average: 0, count: 0 };
  }
  
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / productReviews.length;
  
  return { average: Math.round(average * 10) / 10, count: productReviews.length };
}

// Newsletter subscribers
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(newsletterSubscribers).values({
    email,
    isActive: 1,
  });
  
  const id = Number(result[0].insertId);
  const subscriber = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id)).limit(1);
  return subscriber[0];
}

export async function getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, 1)).orderBy(desc(newsletterSubscribers.subscribedAt));
}
