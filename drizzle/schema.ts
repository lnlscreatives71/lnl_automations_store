import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - stores both digital and physical products
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: int("price").notNull(), // Price in cents
  type: mysqlEnum("type", ["digital", "physical"]).notNull(),
  category: mysqlEnum("category", [
    "agent_workflows",
    "automated_workflows",
    "voice_chat_bots",
    "websites",
    "personal_assistant_agents",
    "social_media_post_packs",
    "social_media_content_topics",
    "talking_avatars",
    "branded_assets"
  ]).notNull(),
  imageUrl: text("imageUrl"), // S3 URL for product image
  digitalFileKey: text("digitalFileKey"), // S3 key for digital product file
  digitalFileName: varchar("digitalFileName", { length: 255 }), // Original filename for downloads
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table - stores customer orders with Stripe payment info
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Null for guest checkouts
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
  totalAmount: int("totalAmount").notNull(), // Total in cents
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  shippingAddress: text("shippingAddress"), // JSON string for physical products
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table - individual products in each order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(), // Snapshot at purchase time
  productType: mysqlEnum("productType", ["digital", "physical"]).notNull(),
  quantity: int("quantity").notNull().default(1),
  priceAtPurchase: int("priceAtPurchase").notNull(), // Price in cents at time of purchase
  digitalFileKey: text("digitalFileKey"), // S3 key snapshot for digital products
  digitalFileName: varchar("digitalFileName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Digital downloads table - secure download tokens with expiry
 */
export const digitalDownloads = mysqlTable("digitalDownloads", {
  id: int("id").autoincrement().primaryKey(),
  orderItemId: int("orderItemId").notNull(),
  downloadToken: varchar("downloadToken", { length: 64 }).notNull().unique(),
  downloadCount: int("downloadCount").default(0).notNull(),
  maxDownloads: int("maxDownloads").default(5).notNull(),
  expiresAt: timestamp("expiresAt").notNull(), // Token expiry (e.g., 30 days from purchase)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DigitalDownload = typeof digitalDownloads.$inferSelect;
export type InsertDigitalDownload = typeof digitalDownloads.$inferInsert;

/**
 * Product reviews table - customer reviews and ratings
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(), // Ensures only verified purchasers can review
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  isVerified: int("isVerified").default(1).notNull(), // 1 = verified purchase
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;