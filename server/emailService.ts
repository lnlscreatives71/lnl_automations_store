import { notifyOwner } from "./_core/notification";

/**
 * Email service for sending customer notifications
 * Currently uses the Manus notification system as a fallback
 * In production with external hosting, replace with SendGrid, Mailgun, or similar
 */

interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number;
  totalAmount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    type: string;
    downloadToken?: string;
  }>;
  hasDigitalProducts: boolean;
}

/**
 * Send order confirmation email to customer
 */
export async function sendCustomerOrderConfirmation(data: OrderEmailData): Promise<boolean> {
  const {
    customerEmail,
    customerName,
    orderId,
    totalAmount,
    items,
    hasDigitalProducts,
  } = data;

  // Format items list
  const itemsList = items
    .map((item) => {
      const itemTotal = (item.price * item.quantity) / 100;
      let itemText = `  • ${item.quantity}x ${item.productName} - $${itemTotal.toFixed(2)}`;
      
      if (item.type === "digital" && item.downloadToken) {
        const downloadUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://your-domain.com'}/api/download/${item.downloadToken}`;
        itemText += `\n    Download: ${downloadUrl}`;
      }
      
      return itemText;
    })
    .join("\n");

  // Create email content
  const emailContent = `
Thank you for your purchase, ${customerName}!

Your order has been confirmed and is being processed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: #${orderId}
Order Total: $${(totalAmount / 100).toFixed(2)}
Customer Email: ${customerEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${itemsList}

${
  hasDigitalProducts
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIGITAL DOWNLOADS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your digital products are ready for download! Click the download links above or visit your order history page to access your files.

Download links are valid for 30 days and can be used up to 5 times per product.
`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions about your order, please contact us through our website.

Thank you for shopping with LNL Automations!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  try {
    // For now, send notification to owner with customer email details
    // In production, this would be replaced with actual email service
    const result = await notifyOwner({
      title: `Order Confirmation for ${customerEmail}`,
      content: `CUSTOMER EMAIL TO BE SENT:\n\nTo: ${customerEmail}\nSubject: Order Confirmation #${orderId}\n\n${emailContent}`,
    });

    console.log(`[Email Service] Customer confirmation email prepared for: ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(`[Email Service] Failed to send customer email:`, error);
    return false;
  }
}

/**
 * Send download link email for digital products
 */
export async function sendDownloadLinkEmail(
  customerEmail: string,
  productName: string,
  downloadToken: string
): Promise<boolean> {
  const downloadUrl = `${process.env.VITE_FRONTEND_FORGE_API_URL || 'https://your-domain.com'}/api/download/${downloadToken}`;

  const emailContent = `
Your digital product is ready for download!

Product: ${productName}
Download Link: ${downloadUrl}

This link is valid for 30 days and can be used up to 5 times.

Thank you for your purchase!

LNL Automations
  `.trim();

  try {
    const result = await notifyOwner({
      title: `Download Link for ${customerEmail}`,
      content: `CUSTOMER EMAIL TO BE SENT:\n\nTo: ${customerEmail}\nSubject: Your Download Link - ${productName}\n\n${emailContent}`,
    });

    console.log(`[Email Service] Download link email prepared for: ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(`[Email Service] Failed to send download link email:`, error);
    return false;
  }
}
