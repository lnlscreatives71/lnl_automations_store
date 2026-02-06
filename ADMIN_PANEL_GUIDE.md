# LNL Automations Store - Admin Panel Guide

Complete documentation for managing your e-commerce store through the admin panel.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Accessing the Admin Panel](#accessing-the-admin-panel)
3. [Admin Panel Overview](#admin-panel-overview)
4. [Adding Products](#adding-products)
5. [Uploading Images and Files](#uploading-images-and-files)
6. [Editing Products](#editing-products)
7. [Deleting Products](#deleting-products)
8. [Managing Orders](#managing-orders)
9. [Managing Reviews](#managing-reviews)
10. [Granting Admin Access](#granting-admin-access)
11. [Troubleshooting](#troubleshooting)

---

## Tech Stack Overview

Your LNL Automations store is built with modern, production-ready technologies that ensure security, scalability, and excellent performance.

### Frontend Technologies

**Core Framework**
- **React 19** - Latest version of React for building the user interface
- **TypeScript 5.9** - Type-safe JavaScript for fewer bugs and better developer experience
- **Vite 7** - Lightning-fast build tool and development server

**UI & Styling**
- **Tailwind CSS 4** - Utility-first CSS framework for responsive design
- **shadcn/ui** - High-quality, accessible React components built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful, consistent icon library
- **Framer Motion** - Smooth animations and transitions

**State Management & Data Fetching**
- **tRPC 11** - End-to-end typesafe APIs without code generation
- **TanStack Query (React Query)** - Powerful data synchronization and caching
- **Wouter** - Lightweight routing library (3KB alternative to React Router)
- **React Context API** - Shopping cart state management

**Forms & Validation**
- **React Hook Form** - Performant form handling with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

**UI Components & Features**
- **Sonner** - Beautiful toast notifications
- **date-fns** - Modern date utility library
- **Streamdown** - Markdown rendering with streaming support
- **Embla Carousel** - Lightweight carousel library

### Backend Technologies

**Server Framework**
- **Node.js 22** - JavaScript runtime
- **Express 4** - Minimal web framework for Node.js
- **tRPC Server 11** - Type-safe API layer
- **Superjson** - Safely serialize JavaScript expressions (handles Date, Map, Set, etc.)

**Database**
- **MySQL/TiDB** - Relational database (cloud-hosted)
- **Drizzle ORM 0.44** - TypeScript ORM with excellent type inference
- **Drizzle Kit** - Database migration tool

**Authentication**
- **Manus OAuth** - Secure OAuth 2.0 authentication
- **Jose 6.1** - JavaScript module for JWT/JWS/JWE/JWK/JWKS
- **Cookie-based sessions** - Secure HTTP-only cookies

**Payment Processing**
- **Stripe API** - Industry-leading payment processor
- **Stripe Checkout** - Hosted payment pages
- **Stripe Webhooks** - Real-time payment event notifications

**File Storage**
- **AWS S3** - Cloud object storage for product images and digital files
- **@aws-sdk/client-s3** - AWS SDK for JavaScript v3
- **@aws-sdk/s3-request-presigner** - Generate presigned URLs for secure downloads

**Email & Notifications**
- **Manus Notification API** - Built-in notification system for owner alerts
- **Email integration via Stripe** - Customer order confirmations

### Development & Testing

**Build Tools**
- **esbuild** - Extremely fast JavaScript bundler
- **tsx** - TypeScript execution and REPL for Node.js
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - Automatically add vendor prefixes to CSS

**Testing**
- **Vitest** - Fast unit test framework (Vite-native)
- **20 test suites** covering products, orders, reviews, email, auth

**Code Quality**
- **TypeScript strict mode** - Maximum type safety
- **Prettier** - Code formatter
- **ESLint** (configured via template) - Code linting

**Package Management**
- **pnpm 10** - Fast, disk space efficient package manager

### Infrastructure & Deployment

**Hosting Options**
- **Manus Built-in Hosting** - One-click deployment with custom domain support
- **External Hosting** - Compatible with Hostinger, Railway, Render, Vercel, etc.

**Environment Management**
- **dotenv** - Environment variable management
- **Automatic secret injection** - Stripe keys, database URL, OAuth credentials

**Monitoring & Debugging**
- **Server logs** - Comprehensive logging in `.manus-logs/` directory
- **Browser console logging** - Client-side error tracking
- **Network request logs** - HTTP request/response monitoring

### Database Schema

**Tables**
1. **users** - Customer accounts with OAuth integration
   - Fields: id, openId, name, email, role (admin/user), loginMethod, timestamps

2. **products** - Product catalog
   - Fields: id, name, description, price, type (digital/physical), category, imageUrl, digitalFileKey, digitalFileName, isActive, timestamps

3. **orders** - Purchase records
   - Fields: id, customerEmail, customerName, totalAmount, status, paymentIntentId, shippingAddress, timestamps

4. **orderItems** - Individual items in each order
   - Fields: id, orderId, productName, quantity, priceAtPurchase, digitalFileKey, digitalFileName, timestamps

5. **digitalDownloads** - Secure download tokens
   - Fields: id, orderItemId, token, expiresAt, downloadCount, maxDownloads, timestamps

6. **reviews** - Customer product reviews
   - Fields: id, productId, userId, rating (1-5), comment, timestamps

### Security Features

**Authentication & Authorization**
- OAuth 2.0 with multiple providers (Google, GitHub, Email)
- HTTP-only secure cookies
- Role-based access control (admin/user)
- JWT token validation

**Payment Security**
- PCI-compliant Stripe integration
- Webhook signature verification
- No credit card data stored locally
- Secure checkout sessions

**File Security**
- Presigned S3 URLs with expiration
- Download token system (30-day expiry, 5 download limit)
- Secure file key storage
- Public CDN for product images only

**Data Protection**
- SQL injection prevention via Drizzle ORM
- XSS protection via React
- CSRF protection via SameSite cookies
- Input validation with Zod schemas

### Performance Optimizations

**Frontend**
- Code splitting and lazy loading
- Image optimization recommendations
- React Query caching
- Debounced search (300ms)
- Optimistic UI updates

**Backend**
- Database connection pooling
- Efficient SQL queries via Drizzle
- tRPC batching and caching
- Superjson for efficient data serialization

**Assets**
- CDN delivery for images and files
- Aggressive browser caching for static assets
- Vite build optimization

### Browser Compatibility

**Supported Browsers**
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

**Not Supported**
- Safari Private Browsing (OAuth limitation)
- Firefox Strict ETP mode (OAuth limitation)
- Brave Aggressive Shields (OAuth limitation)
- Internet Explorer (deprecated)

### API Integrations

**Stripe API**
- Checkout Sessions API
- Payment Intents API
- Webhooks API
- Customer API

**AWS S3 API**
- PutObject (file uploads)
- GetObject (presigned URLs)
- Object storage and retrieval

**Manus Platform APIs**
- OAuth API
- Notification API
- Analytics API (built-in)

---

## Accessing the Admin Panel

### Method 1: Direct URL Access
Navigate directly to the admin panel URL:
```
https://your-domain.com/admin
```

### Method 2: Navigation Button (Admin Users Only)
When logged in as an admin, an "Admin Panel" button appears in the top navigation bar.

### Requirements
- You must be logged in with an account that has **admin role**
- By default, the store owner (your account) automatically has admin access
- Other users need to be manually granted admin access (see [Granting Admin Access](#granting-admin-access))

### What Happens if I'm Not an Admin?
If you try to access `/admin` without admin privileges, you'll see an "Access Denied" message with a link back to the homepage.

---

## Admin Panel Overview

The admin panel displays:
- **Total product count** at the top
- **Add Product button** to create new products
- **Product grid** showing all products with:
  - Product image (or placeholder icon)
  - Product name and description
  - Price and type (digital/physical)
  - Edit and Delete buttons

---

## Adding Products

### Step 1: Open the Add Product Dialog
Click the **"Add Product"** button at the top of the admin panel.

### Step 2: Fill in Product Details

#### Required Fields

**Product Name** *
- Enter a clear, descriptive name for your product
- Example: "AI Agent Workflow Template - Customer Service Bot"

**Description**
- Provide detailed information about the product
- Explain what the customer gets, features, benefits
- Use clear, concise language
- Example: "Pre-built AI agent workflow that handles customer inquiries, provides instant responses, and escalates complex issues to human support."

**Price (USD)** *
- Enter the price in dollars (e.g., `29.99`)
- The system automatically converts this to cents for storage
- Minimum price: $0.01

**Product Type** *
- **Digital**: Files that customers download immediately after purchase
- **Physical**: Items that require shipping (you'll receive email notification)

**Category** *
Select the category that best describes your product:
- **Agent Workflows**: Pre-built AI agent workflows for automation
- **Automated Workflows**: Ready-to-use automation workflows
- **Voice & Chat Bots**: Voice-enabled and text-based chatbot solutions
- **Websites**: Complete website templates and designs
- **Personal Assistant Agents**: AI-powered personal assistant agents
- **Social Media Post Packs**: Curated social media content templates
- **Social Media Content Topics with Viral Hooks**: Viral content topics with engagement strategies
- **Talking Avatars**: Animated talking avatar solutions
- **Branded Assets**: Professional branded assets (logos, templates, designs)

#### Optional Fields

**Product Image URL**
- URL to the product image displayed in the catalog
- **How to upload**: See [Uploading Images and Files](#uploading-images-and-files)
- Recommended size: 1200x800px or 16:9 aspect ratio
- Supported formats: JPG, PNG, WebP
- After pasting the URL, a preview appears below the field

**Digital File Key** (Digital Products Only)
- The S3 file key for the downloadable product file
- Only shown when Product Type is "Digital"
- **How to upload**: See [Uploading Images and Files](#uploading-images-and-files)
- Example: `user-123/products/workflow-template.zip`

**Digital File Name** (Digital Products Only)
- The original filename that customers see when downloading
- Example: `customer-service-bot-workflow.zip`
- This is the name of the file when customers download it

### Step 3: Save the Product
Click **"Add Product"** at the bottom of the dialog. You'll see a success message and the product will appear in the grid.

---

## Uploading Images and Files

The admin panel uses **S3 cloud storage** for all product images and digital files. Files are uploaded via command line and then referenced by URL.

### Step-by-Step Upload Process

#### Step 1: Prepare Your File
- **For Images**: Use JPG or PNG format, recommended size 1200x800px
- **For Digital Products**: Package files in ZIP format if multiple files
- Name files clearly (e.g., `ai-workflow-template.zip`)

#### Step 2: Upload to S3
Use the `manus-upload-file` command in your terminal:

```bash
manus-upload-file /path/to/your/file.png
```

**Example:**
```bash
manus-upload-file ~/Desktop/product-image.png
```

#### Step 3: Copy the Returned URL
The command returns a public CDN URL like:
```
https://cdn.example.com/uploads/abc123/product-image.png
```

#### Step 4: Paste URL into Admin Panel
- **For product images**: Paste into "Product Image URL" field
- **For digital files**: Paste the file key (the part after the domain) into "Digital File Key" field

### Important Notes
- Files uploaded to S3 are **publicly accessible** via the URL
- Digital download files are protected by **secure download tokens** that expire
- Keep a backup of your original files
- You can use the same image for multiple products

### Alternative: Use External Image Hosting
You can also use external image hosting services:
- Imgur
- Cloudinary
- Your own web server

Just paste the direct image URL into the "Product Image URL" field.

---

## Editing Products

### Step 1: Click the Edit Button
Find the product in the grid and click the **"Edit"** button (pencil icon).

### Step 2: Modify Fields
The edit dialog opens with all current values pre-filled. Change any fields you want to update.

### Step 3: Save Changes
Click **"Update Product"** to save your changes. The product grid refreshes automatically.

### What Can Be Edited?
- Product name
- Description
- Price
- Product type (digital/physical)
- Category
- Image URL
- Digital file information

### Tips
- You can change a product from physical to digital (or vice versa) at any time
- Changing the price doesn't affect past orders (prices are snapshotted at purchase time)
- Updating the image URL immediately changes how the product appears to customers

---

## Deleting Products

### Step 1: Click the Delete Button
Find the product and click the **"Delete"** button (trash icon).

### Step 2: Confirm Deletion
A confirmation dialog appears asking "Are you sure you want to delete [Product Name]?"

### Step 3: Confirm
Click **OK** to permanently delete the product.

### Important Warnings
- **Deletion is permanent** - the product cannot be recovered
- **Past orders are NOT affected** - customers who already purchased can still access their downloads
- **Reviews are preserved** - customer reviews remain in the database (though they won't be visible without the product)

### Alternative: Deactivate Instead of Delete
If you want to temporarily hide a product without deleting it:
1. Use the **Database UI** (Management Panel → Database)
2. Find the product in the `products` table
3. Set `isActive` to `0`
4. The product won't appear in the catalog but remains in the database

---

## Managing Orders

### Viewing Orders
Orders are managed through two interfaces:

#### Option 1: Database UI (Recommended)
1. Open Management Panel (right side of screen)
2. Click **Database** tab
3. Select **orders** table
4. View all orders with full details

#### Option 2: Customer Order History
Each customer can view their own orders at `/orders` when logged in.

### Order Information
Each order includes:
- **Order ID**: Unique identifier
- **Customer Email**: Who made the purchase
- **Customer Name**: Buyer's name
- **Total Amount**: Order total in cents (divide by 100 for dollars)
- **Status**: pending, completed, failed, or refunded
- **Payment Intent ID**: Stripe payment reference
- **Created At**: Purchase timestamp
- **Shipping Address**: For physical products (JSON format)

### Order Items
To see what products were in an order:
1. Go to Database UI → **orderItems** table
2. Filter by `orderId` to see all items in that order
3. Each item shows:
   - Product name (snapshot at purchase time)
   - Quantity
   - Price at purchase
   - Digital file information (if applicable)

### Handling Physical Product Orders

When a physical product is purchased, you automatically receive an email notification with:
- Customer name and email
- Shipping address
- Order details
- Items purchased

**Your Action Items:**
1. Package the physical product
2. Ship to the provided address
3. (Optional) Update the customer via email with tracking information
4. (Optional) Mark the order as fulfilled in your own tracking system

### Handling Digital Product Orders

Digital products are **fully automated**:
1. Customer completes purchase
2. Webhook creates secure download tokens
3. Customer receives email with download links
4. Customer can re-download from their Order History page
5. Downloads expire after 30 days or 5 downloads (whichever comes first)

**No manual action required** for digital products!

### Refunding Orders

Refunds must be processed through **Stripe Dashboard**:
1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Payments** → find the payment
3. Click **Refund** and enter the amount
4. After refunding in Stripe, update the order status in Database UI:
   - Set `status` to `refunded`

---

## Managing Reviews

### Viewing Reviews
1. Open Database UI → **reviews** table
2. See all customer reviews with:
   - Rating (1-5 stars)
   - Comment text
   - Product ID
   - User ID
   - Created date

### Moderating Reviews
If you need to remove inappropriate reviews:
1. Find the review in the Database UI
2. Click the **Delete** button (trash icon)
3. Confirm deletion

### Review Rules (Automatic)
- Only customers who purchased a product can review it
- One review per customer per product
- Reviews display on product detail pages
- Average ratings show on product cards

---

## Granting Admin Access

By default, only the store owner (your account) has admin access. To grant admin access to other users:

### Step 1: User Must Create an Account
The user must first sign up and log in at least once.

### Step 2: Find Their User Record
1. Open Database UI → **users** table
2. Find the user by email or name

### Step 3: Change Role to Admin
1. Click the **Edit** button (pencil icon) for that user
2. Change `role` from `user` to `admin`
3. Save changes

### Step 4: User Refreshes Page
The user must refresh their browser or log out and back in to see the Admin Panel button.

### Removing Admin Access
Follow the same steps but change `role` from `admin` back to `user`.

---

## Troubleshooting

### I Can't Access the Admin Panel
**Problem**: "Access Denied" message when visiting `/admin`

**Solutions**:
1. Make sure you're logged in (click Login in navigation)
2. Check your account has admin role:
   - Open Database UI → users table
   - Find your account by email
   - Verify `role` is set to `admin`
3. If role is correct, log out and log back in

---

### Product Images Not Showing
**Problem**: Product cards show placeholder icon instead of image

**Solutions**:
1. Verify the image URL is publicly accessible (paste it in a new browser tab)
2. Check the URL doesn't have typos
3. Ensure the image format is supported (JPG, PNG, WebP)
4. Try re-uploading the image using `manus-upload-file`

---

### Digital Downloads Not Working
**Problem**: Customers can't download digital products

**Solutions**:
1. Verify `digitalFileKey` is set correctly in the product
2. Check the file was uploaded to S3 successfully
3. Ensure the product type is set to "digital"
4. Check download tokens in Database UI → digitalDownloads table
5. Verify tokens haven't expired (30 days from purchase)

---

### Email Notifications Not Received
**Problem**: You're not receiving order notifications

**Solutions**:
1. Check your spam/junk folder
2. Verify the Stripe webhook is configured correctly (Settings → Payment in Management UI)
3. Check webhook logs in Stripe Dashboard → Developers → Webhooks
4. Ensure your owner email is set correctly in the system

---

### Can't Upload Files
**Problem**: `manus-upload-file` command not working

**Solutions**:
1. Make sure you're running the command in your local terminal (not the browser)
2. Verify the file path is correct
3. Check file size isn't too large (max 100MB recommended)
4. Try using absolute path: `manus-upload-file /full/path/to/file.png`

---

### Product Not Appearing in Catalog
**Problem**: Product added but doesn't show on Products page

**Solutions**:
1. Check `isActive` field in Database UI → products table (should be 1)
2. Verify the product was saved successfully (refresh admin panel)
3. Clear browser cache and refresh the Products page
4. Check browser console for errors (F12 → Console tab)

---

## Quick Reference

### Common Admin Tasks

| Task | Steps |
|------|-------|
| Add product | Admin Panel → Add Product → Fill form → Save |
| Upload image | Terminal: `manus-upload-file image.png` → Copy URL → Paste in admin form |
| Edit product | Admin Panel → Find product → Edit button → Modify → Save |
| Delete product | Admin Panel → Find product → Delete button → Confirm |
| View orders | Management UI → Database → orders table |
| Grant admin access | Database UI → users → Find user → Edit → Change role to admin |
| Refund order | Stripe Dashboard → Payments → Find payment → Refund |

---

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for errors (F12 → Console)
2. Review the server logs in Management UI → Dashboard
3. Visit the Stripe Dashboard for payment-related issues
4. Contact Manus support at https://help.manus.im

---

**Last Updated**: February 2026  
**Version**: 1.0
