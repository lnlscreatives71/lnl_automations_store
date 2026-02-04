import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "../db";
import { nanoid } from "nanoid";
import { notifyOwner } from "../_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ 
      verified: true,
    });
  }

  console.log(`[Stripe Webhook] Event type: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Stripe Webhook] Error processing event:`, error);
    res.status(500).send("Webhook handler failed");
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Processing checkout session: ${session.id}`);

  const paymentIntentId = session.payment_intent as string;
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email || "";
  const customerName = session.customer_details?.name || session.metadata?.customer_name || "";
  const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id) : null;
  const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];

  // Check if order already exists
  const existingOrder = await db.getOrderByPaymentIntent(paymentIntentId);
  if (existingOrder) {
    console.log(`[Stripe Webhook] Order already exists for payment intent: ${paymentIntentId}`);
    return;
  }

  // Create order
  const order = await db.createOrder({
    userId,
    customerEmail,
    customerName,
    stripePaymentIntentId: paymentIntentId,
    stripeCheckoutSessionId: session.id,
    totalAmount: session.amount_total || 0,
    status: "completed",
    shippingAddress: (session as any).shipping_details ? JSON.stringify((session as any).shipping_details) : null,
  });

  console.log(`[Stripe Webhook] Created order: ${order.id}`);

  // Create order items and digital downloads
  let hasPhysicalProducts = false;
  let hasDigitalProducts = false;

  for (const item of items) {
    const product = await db.getProductById(item.productId);
    if (!product) {
      console.warn(`[Stripe Webhook] Product not found: ${item.productId}`);
      continue;
    }

    const orderItem = await db.createOrderItem({
      orderId: order.id,
      productId: product.id,
      productName: product.name,
      productType: product.type,
      quantity: item.quantity,
      priceAtPurchase: product.price,
      digitalFileKey: product.digitalFileKey || null,
      digitalFileName: product.digitalFileName || null,
    });

    // Create digital download token for digital products
    if (product.type === "digital" && product.digitalFileKey) {
      const downloadToken = nanoid(32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

      await db.createDigitalDownload({
        orderItemId: orderItem.id,
        downloadToken,
        downloadCount: 0,
        maxDownloads: 5,
        expiresAt,
      });

      hasDigitalProducts = true;
      console.log(`[Stripe Webhook] Created digital download token for order item: ${orderItem.id}`);
    }

    if (product.type === "physical") {
      hasPhysicalProducts = true;
    }
  }

  // Send email notification to owner for physical products
  if (hasPhysicalProducts) {
    const orderDetails = `
New Order Received - Order #${order.id}

Customer Information:
- Name: ${customerName || 'N/A'}
- Email: ${customerEmail}

Order Details:
- Total Amount: $${(order.totalAmount / 100).toFixed(2)}
- Payment Intent: ${paymentIntentId}
- Shipping Address: ${order.shippingAddress ? (JSON.parse(order.shippingAddress).address?.line1 || 'N/A') : 'N/A'}

Items:
${items.map((item: any) => `- ${item.quantity}x Product ID: ${item.productId}`).join('\n')}

Please process this order and arrange shipment.
    `.trim();

    await notifyOwner({
      title: `New Order #${order.id} - Physical Products`,
      content: orderDetails,
    });

    console.log(`[Stripe Webhook] Sent owner notification for physical product order: ${order.id}`);
  }

  // TODO: Send confirmation email to customer
  console.log(`[Stripe Webhook] Order processing completed for: ${order.id}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
  
  // Update order status if needed
  const order = await db.getOrderByPaymentIntent(paymentIntent.id);
  if (order && order.status === "pending") {
    await db.updateOrderStatus(order.id, "completed");
    console.log(`[Stripe Webhook] Updated order status to completed: ${order.id}`);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
  
  // Update order status
  const order = await db.getOrderByPaymentIntent(paymentIntent.id);
  if (order) {
    await db.updateOrderStatus(order.id, "failed");
    console.log(`[Stripe Webhook] Updated order status to failed: ${order.id}`);
  }
}
