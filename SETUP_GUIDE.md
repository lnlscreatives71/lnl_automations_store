# LNL Automations Store - Setup & Usage Guide

## Overview

Your e-commerce store is now operational with a minimal viable product (MVP) that includes:

- **Product catalog** with shopping cart functionality
- **Stripe payment integration** for secure checkout
- **Order management** system with email notifications
- **Digital product downloads** with secure token-based access
- **Admin panel** for managing products and orders
- **Static pages** (About, Contact, FAQ, Refund Policy)

---

## Initial Setup Steps

### 1. Claim Your Stripe Test Sandbox

Your Stripe test sandbox has been created but needs to be claimed:

- **Claim URL**: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU3d0a0s4aTRzWHhsWTBFLDE3NzA4MTIzMzcv100jwoSwzEd
- **Deadline**: Must be claimed before April 5, 2026
- **Purpose**: This allows you to test payments with test card numbers before going live

**Test Card Number**: `4242 4242 4242 4242` (any future expiry date, any CVC)

### 2. Add Your First Products

Use the Manus Database UI to add products:

1. Click the **Database** button in the Management UI (right panel)
2. Navigate to the `products` table
3. Click **Add Record** and fill in:
   - `name`: Product name (e.g., "Automation Script Bundle")
   - `description`: Detailed product description
   - `price`: Price in cents (e.g., 9900 for $99.00)
   - `type`: Either "digital" or "physical"
   - `imageUrl`: Optional - URL to product image (upload to S3 first)
   - `digitalFileKey`: For digital products - S3 file key after uploading
   - `isActive`: Set to `1` to make product visible

### 3. Upload Product Images and Files

**For product images**:
```bash
# Upload image to S3
manus-upload-file /path/to/product-image.jpg

# Copy the returned URL and paste it into the imageUrl field in the database
```

**For digital product files**:
```bash
# Upload digital product file to S3
manus-upload-file /path/to/digital-product.zip

# Copy the returned file key (not the full URL) and paste it into digitalFileKey field
```

---

## How the Store Works

### Customer Purchase Flow

1. **Browse Products**: Customers visit `/products` to see all available products
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the Cart button in the navigation (shows item count)
4. **Checkout**: Click "Proceed to Checkout" in the cart
5. **Payment**: Redirected to Stripe-hosted checkout page
6. **Confirmation**: After payment, redirected to success page
7. **Order History**: View past orders and download digital products at `/orders`

### Digital Product Downloads

- After purchasing a digital product, customers can download it from their Orders page
- Download links are valid for **30 days** with a maximum of **5 downloads**
- Downloads are tracked in the `digitalDownloads` table

### Physical Product Fulfillment

When a customer purchases a physical product:

1. Order is created in the database
2. **Email notification is sent to you** (the owner) with:
   - Customer name and email
   - Shipping address
   - Products ordered
   - Order total
3. You manually fulfill the order and update the status in the database

---

## Admin Panel

Access the admin panel at `/admin` (requires admin role).

**To make yourself an admin**:
1. Log in to the website first
2. Open the Database UI
3. Find your user in the `users` table
4. Change the `role` field from "user" to "admin"

**Admin capabilities**:
- View all orders in the database
- Manage products (add, edit, delete)
- View customer information
- Track digital download usage

---

## Stripe Webhook Configuration

The webhook endpoint is already configured at `/api/stripe/webhook`.

**Webhook events handled**:
- `checkout.session.completed`: Creates order and sends notifications
- `payment_intent.succeeded`: Confirms payment
- `charge.succeeded`: Records successful charge

**To test webhooks locally**: Webhooks work automatically in the Manus environment.

**For production**: When you deploy, update the webhook URL in your Stripe Dashboard to point to your live domain.

---

## Custom Domain Setup

Your domain: **lnlautomations.cloud**

**Steps to connect**:
1. Click **Settings** → **Domains** in the Management UI
2. Click **Add Custom Domain**
3. Enter `lnlautomations.cloud`
4. Follow the DNS configuration instructions provided
5. Add the required CNAME or A records to your domain registrar (Hostinger)

**Note**: The site is currently hosted on Manus, not Hostinger. You only need to point your domain's DNS to Manus.

---

## Email Notifications

Email notifications are automatically sent when:

- **Physical product is purchased**: Owner receives email with order details and shipping address
- **Order is completed**: Webhook processes the order

**Email sent to**: The owner email associated with your Manus account

**Future enhancement**: Customer order confirmation emails can be added by extending the webhook handler.

---

## Testing Your Store

### Test a Purchase

1. Add a test product to the database
2. Visit `/products` and add it to cart
3. Proceed to checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete the purchase
6. Check `/orders` to see your order
7. Check the database `orders` table to verify the order was created

### Test Digital Downloads

1. Create a digital product with a file uploaded to S3
2. Purchase it using the test card
3. Go to `/orders` and verify the download link appears
4. Click download to test the secure download flow

---

## Database Tables

### `products`
- Stores all products (digital and physical)
- Fields: name, description, price, type, imageUrl, digitalFileKey, isActive

### `orders`
- Stores all customer orders
- Fields: userId, customerEmail, customerName, totalAmount, status, stripePaymentIntentId

### `orderItems`
- Links products to orders with quantity and price snapshot
- Fields: orderId, productId, quantity, priceAtPurchase

### `digitalDownloads`
- Tracks download tokens and usage for digital products
- Fields: orderItemId, token, expiresAt, downloadCount, maxDownloads

### `users`
- Customer and admin accounts
- Fields: openId, name, email, role, createdAt

---

## Deployment

### Create a Checkpoint

Before deploying, create a checkpoint:
1. Click the **Publish** button in the Management UI header
2. This creates a snapshot of your current code
3. You can rollback to this version anytime

### Publish to Production

1. Click **Publish** in the Management UI
2. Your site will be deployed to Manus hosting
3. The auto-generated URL will be available immediately
4. Connect your custom domain as described above

### Going Live with Stripe

1. Complete Stripe KYC verification in your Stripe Dashboard
2. Get your live API keys from Stripe
3. Go to **Settings** → **Payment** in the Management UI
4. Enter your live Stripe keys
5. Update webhook endpoint in Stripe Dashboard to your production URL

**Important**: Stripe requires a minimum order value of $0.50 USD. Use the 99% discount promo code for testing in live mode.

---

## Maintenance & Updates

### Adding New Products

Use the Database UI to add products anytime. Products with `isActive = 1` will appear immediately on the site.

### Viewing Orders

Check the `orders` table in the Database UI to see all customer orders, including:
- Customer information
- Order totals
- Payment status
- Stripe payment intent IDs

### Managing Downloads

Monitor the `digitalDownloads` table to see:
- Which customers have downloaded products
- How many times they've downloaded
- When tokens expire

---

## Support & Next Steps

### Future Enhancements

Consider adding:
- Customer order confirmation emails
- Product detail pages with more information
- Product categories and filtering
- Customer reviews and ratings
- Inventory management
- Discount codes and promotions
- Advanced admin dashboard with analytics

### Getting Help

- **Stripe Issues**: Check Settings → Payment in the Management UI
- **Webhook Problems**: Review Stripe Dashboard → Developers → Webhooks
- **Database Issues**: Use the Database UI to inspect and modify data
- **Code Changes**: All code is in the project directory and can be modified

---

## Quick Reference

**Key URLs**:
- Home: `/`
- Products: `/products`
- Cart: `/cart`
- Orders: `/orders`
- Admin: `/admin`
- About: `/about`
- Contact: `/contact`
- FAQ: `/faq`
- Refund Policy: `/refund-policy`

**Test Card**: `4242 4242 4242 4242`

**Admin Access**: Change user role to "admin" in database

**File Upload**: Use `manus-upload-file` command

**Webhook Endpoint**: `/api/stripe/webhook`

---

## Troubleshooting

**Products not showing**: Check `isActive = 1` in products table

**Cart not working**: Clear browser localStorage and refresh

**Checkout fails**: Verify Stripe keys in Settings → Payment

**Downloads not working**: Check digitalFileKey is correct S3 key (not full URL)

**Admin panel access denied**: Verify user role is "admin" in database

**Emails not received**: Check owner email in Manus account settings

---

Your store is ready to use! Start by adding products and testing the complete purchase flow with the test card number.
