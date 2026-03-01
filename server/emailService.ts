import { notifyOwner } from "./_core/notification";

/**
 * Email service for sending customer notifications
 * Emails are branded with LNL Automations and sent through Humanic
 * Humanic handles the actual email delivery
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

  // Create email content with LNL Automations branding
  const emailContent = `
╔════════════════════════════════════════════════════════╗
║                  LNL AUTOMATIONS STUDIO                ║
║            Thank you for your purchase!                ║
╚════════════════════════════════════════════════════════╝

Hi ${customerName},

Your order has been confirmed and is being processed. Below are your order details:

┌────────────────────────────────────────────────────────┐
│ ORDER CONFIRMATION                                     │
└────────────────────────────────────────────────────────┘

Order Number:  #${orderId}
Order Total:   $${(totalAmount / 100).toFixed(2)}
Customer Email: ${customerEmail}

┌────────────────────────────────────────────────────────┐
│ ORDER ITEMS                                            │
└────────────────────────────────────────────────────────┘

${itemsList}

${
  hasDigitalProducts
    ? `
┌────────────────────────────────────────────────────────┐
│ DIGITAL DOWNLOADS                                      │
└────────────────────────────────────────────────────────┘

Your digital products are ready for download! Click the download links above or visit your order history page to access your files.

✓ Download links are valid for 30 days
✓ Each link can be used up to 5 times
✓ Access your downloads anytime from your account
`
    : ""
}

┌────────────────────────────────────────────────────────┐
│ WHAT'S NEXT?                                           │
└────────────────────────────────────────────────────────┘

1. Check your email for any additional setup instructions
2. Visit your account to view order history and downloads
3. Contact us if you need any assistance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
LNL Automations Studio Team

For support, visit: store.lnlautomations.cloud

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  try {
    // Send notification to owner with customer email details
    // Humanic will handle the actual email delivery with LNL Automations branding
    const result = await notifyOwner({
      title: `Order Confirmation - ${customerEmail}`,
      content: `CUSTOMER EMAIL (Sent via Humanic):\n\nTo: ${customerEmail}\nSubject: Order Confirmation #${orderId}\nFrom: LNL Automations Studio\n\n${emailContent}`,
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
╔════════════════════════════════════════════════════════╗
║                  LNL AUTOMATIONS STUDIO                ║
║         Your Digital Product is Ready!                 ║
╚════════════════════════════════════════════════════════╝

Hi there,

Your digital product is ready for download!

┌────────────────────────────────────────────────────────┐
│ PRODUCT DETAILS                                        │
└────────────────────────────────────────────────────────┘

Product: ${productName}
Download Link: ${downloadUrl}

✓ Link is valid for 30 days
✓ Can be used up to 5 times
✓ Access anytime from your account

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your purchase!

LNL Automations Studio Team
Visit: lnlautomations.cloud

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  try {
    const result = await notifyOwner({
      title: `Digital Download - ${customerEmail}`,
      content: `CUSTOMER EMAIL (Sent via Humanic):\n\nTo: ${customerEmail}\nSubject: Your Download Link - ${productName}\nFrom: LNL Automations Studio\n\n${emailContent}`,
    });

    console.log(`[Email Service] Download link email prepared for: ${customerEmail}`);
    return result;
  } catch (error) {
    console.error(`[Email Service] Failed to send download link email:`, error);
    return false;
  }
}
