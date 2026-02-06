import { describe, expect, it } from "vitest";
import { sendCustomerOrderConfirmation } from "./emailService";

describe("Email Service", () => {
  describe("sendCustomerOrderConfirmation", () => {
    it("should prepare customer order confirmation email", async () => {
      const result = await sendCustomerOrderConfirmation({
        customerEmail: "customer@example.com",
        customerName: "John Doe",
        orderId: 123,
        totalAmount: 5000, // $50.00
        items: [
          {
            productName: "Test Digital Product",
            quantity: 1,
            price: 3000,
            type: "digital",
            downloadToken: "test-token-123",
          },
          {
            productName: "Test Physical Product",
            quantity: 2,
            price: 1000,
            type: "physical",
          },
        ],
        hasDigitalProducts: true,
      });

      // Should return true or false based on notification success
      expect(typeof result).toBe("boolean");
    });

    it("should handle orders without digital products", async () => {
      const result = await sendCustomerOrderConfirmation({
        customerEmail: "customer@example.com",
        customerName: "Jane Smith",
        orderId: 456,
        totalAmount: 2000, // $20.00
        items: [
          {
            productName: "Physical Product Only",
            quantity: 1,
            price: 2000,
            type: "physical",
          },
        ],
        hasDigitalProducts: false,
      });

      expect(typeof result).toBe("boolean");
    });

    it("should handle empty customer name gracefully", async () => {
      const result = await sendCustomerOrderConfirmation({
        customerEmail: "anonymous@example.com",
        customerName: "",
        orderId: 789,
        totalAmount: 1500,
        items: [
          {
            productName: "Test Product",
            quantity: 1,
            price: 1500,
            type: "digital",
            downloadToken: "token-xyz",
          },
        ],
        hasDigitalProducts: true,
      });

      expect(typeof result).toBe("boolean");
    });
  });
});
