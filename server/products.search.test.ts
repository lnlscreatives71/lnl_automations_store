import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the database module
const mockProducts = [
  {
    id: 1,
    name: "Automation Script Bundle",
    description: "Complete collection of automation scripts for workflow optimization",
    price: 9900,
    type: "digital" as const,
    imageUrl: null,
    digitalFileKey: "scripts-bundle.zip",
    digitalFileName: "scripts-bundle.zip",
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Smart Home Controller",
    description: "Physical device for home automation control",
    price: 19900,
    type: "physical" as const,
    imageUrl: null,
    digitalFileKey: null,
    digitalFileName: null,
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "API Integration Templates",
    description: "Ready-to-use templates for common API integrations",
    price: 4900,
    type: "digital" as const,
    imageUrl: null,
    digitalFileKey: "api-templates.zip",
    digitalFileName: "api-templates.zip",
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock getAllProducts
vi.spyOn(db, "getAllProducts").mockResolvedValue(mockProducts);

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("products.search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all products when search query is empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "" });

    expect(result).toHaveLength(3);
    expect(result).toEqual(mockProducts);
  });

  it("filters products by name (case insensitive)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "automation" });

    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual([1, 2]);
  });

  it("filters products by description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "templates" });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe(3);
  });

  it("returns empty array when no products match", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "nonexistent" });

    expect(result).toHaveLength(0);
  });

  it("handles partial word matches", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "script" });

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Automation Script Bundle");
  });

  it("trims whitespace from search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "  automation  " });

    expect(result).toHaveLength(2);
  });
});
