import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("newsletter.subscribe", () => {
  it("accepts valid email addresses", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.newsletter.subscribe({ email: `test${Date.now()}@example.com` });

    expect(result.success).toBe(true);
    expect(result.message).toContain("subscribed");
  });

  it("rejects duplicate email addresses", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const email = `duplicate${Date.now()}@example.com`;
    
    // First subscription should succeed
    await caller.newsletter.subscribe({ email });

    // Second subscription should fail with an error
    await expect(
      caller.newsletter.subscribe({ email })
    ).rejects.toThrow();
  });
});
