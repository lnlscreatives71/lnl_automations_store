# Hostinger Deployment Guide for LNL Automations Store

This guide will help you deploy your e-commerce store to Hostinger or any other hosting provider.

## ⚠️ Important Note About Manus Hosting

**This application is specifically designed for Manus hosting** and uses Manus-specific features including:
- Built-in authentication system (Manus OAuth)
- Managed database (TiDB/MySQL)
- S3 storage integration
- Stripe integration with automatic configuration
- Email notification system

**Deploying to external hosting like Hostinger will require significant modifications** to replace these Manus-specific services. We strongly recommend using Manus's built-in hosting with custom domain support instead.

---

## If You Still Want to Deploy to Hostinger

### Prerequisites

1. **Hostinger VPS or Cloud Hosting** (shared hosting won't work - you need Node.js support)
2. **Domain**: lnlautomations.cloud (already owned)
3. **External Services Required**:
   - MySQL database (8.0+)
   - S3-compatible storage (AWS S3, DigitalOcean Spaces, etc.)
   - Stripe account
   - Email service (SendGrid, Mailgun, etc.)
   - OAuth provider or custom authentication system

---

## Step 1: Set Up External Services

### 1.1 Database Setup
```bash
# You'll need a MySQL 8.0+ database
# Get connection string in format:
# mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
```

### 1.2 S3 Storage Setup
```bash
# Sign up for AWS S3 or DigitalOcean Spaces
# Create a bucket for product images and digital files
# Get:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - AWS_REGION
# - AWS_S3_BUCKET
```

### 1.3 Stripe Setup
```bash
# Get your Stripe keys from https://dashboard.stripe.com/apikeys
# - STRIPE_SECRET_KEY
# - STRIPE_PUBLISHABLE_KEY
# - STRIPE_WEBHOOK_SECRET (after setting up webhook endpoint)
```

### 1.4 Authentication Replacement
```
# You'll need to replace Manus OAuth with:
# - Auth0, Clerk, or similar
# - Or implement custom JWT authentication
# This requires modifying server/_core/oauth.ts and related files
```

---

## Step 2: Prepare the Application

### 2.1 Install Dependencies Locally
```bash
cd lnl_automations_store
pnpm install
```

### 2.2 Build the Application
```bash
# Build frontend
pnpm build

# This creates:
# - dist/ folder with server code
# - client/dist/ folder with frontend assets
```

### 2.3 Create Production Environment File
Create `.env.production` with all required variables:

```bash
# Database
DATABASE_URL=mysql://user:pass@host:port/dbname?ssl={"rejectUnauthorized":true}

# JWT Secret (generate a random 32-character string)
JWT_SECRET=your-super-secret-jwt-key-here-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# S3 Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OAuth (needs replacement - see Step 3)
OAUTH_SERVER_URL=https://your-auth-provider.com
VITE_OAUTH_PORTAL_URL=https://your-auth-provider.com/login
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Email Service (needs implementation)
EMAIL_SERVICE_API_KEY=your-email-api-key
EMAIL_FROM=noreply@lnlautomations.cloud

# App Configuration
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=LNL Automations
VITE_APP_LOGO=/logo.png
```

---

## Step 3: Code Modifications Required

### 3.1 Replace Authentication System
You need to modify these files:
- `server/_core/oauth.ts` - Replace Manus OAuth
- `server/_core/context.ts` - Update user context handling
- `client/src/_core/hooks/useAuth.ts` - Update frontend auth
- `client/src/const.ts` - Update login URL generation

### 3.2 Replace Storage System
Modify `server/storage.ts` to use your S3 credentials instead of Manus's managed storage.

### 3.3 Replace Email System
Modify `server/_core/notification.ts` to use your email service (SendGrid, Mailgun, etc.) instead of Manus's notification system.

### 3.4 Remove Manus-Specific Dependencies
Edit `package.json` and remove:
```json
"vite-plugin-manus-runtime": "^0.0.57"
```

Update `vite.config.ts` to remove the Manus plugin.

---

## Step 4: Deploy to Hostinger

### 4.1 Connect via SSH
```bash
ssh your-username@your-server-ip
```

### 4.2 Install Node.js (if not installed)
```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm
```

### 4.3 Upload Your Code
```bash
# Option 1: Use git
git clone your-repository-url
cd lnl_automations_store

# Option 2: Use SCP
scp -r ./lnl_automations_store your-username@your-server-ip:/var/www/
```

### 4.4 Install Dependencies and Build
```bash
cd /var/www/lnl_automations_store
pnpm install --production
pnpm build
```

### 4.5 Set Up Environment Variables
```bash
# Copy your .env.production file
cp .env.production .env

# Or create it directly on the server
nano .env
# Paste all environment variables
```

### 4.6 Run Database Migrations
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 4.7 Set Up Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start dist/index.js --name lnl-store

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 4.8 Configure Nginx as Reverse Proxy
```nginx
# /etc/nginx/sites-available/lnlautomations.cloud

server {
    listen 80;
    server_name lnlautomations.cloud www.lnlautomations.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/lnlautomations.cloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.9 Set Up SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d lnlautomations.cloud -d www.lnlautomations.cloud
```

---

## Step 5: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://lnlautomations.cloud/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook signing secret to your `.env` file as `STRIPE_WEBHOOK_SECRET`
5. Restart the application: `pm2 restart lnl-store`

---

## Step 6: Post-Deployment Tasks

### 6.1 Test the Application
- Visit https://lnlautomations.cloud
- Create a test account
- Add a product via admin panel
- Test the complete purchase flow with Stripe test card: `4242 4242 4242 4242`

### 6.2 Monitor Logs
```bash
# View application logs
pm2 logs lnl-store

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 6.3 Set Up Automatic Backups
```bash
# Create backup script for database
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h host -u user -p database > /backups/db_$DATE.sql
```

---

## Maintenance Commands

```bash
# Restart application
pm2 restart lnl-store

# View logs
pm2 logs lnl-store

# Stop application
pm2 stop lnl-store

# Update application
cd /var/www/lnl_automations_store
git pull
pnpm install
pnpm build
pm2 restart lnl-store
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs lnl-store --lines 100

# Check environment variables
pm2 env lnl-store

# Verify database connection
mysql -h host -u user -p database
```

### Stripe Webhook Issues
- Verify webhook URL is accessible: `curl https://lnlautomations.cloud/api/stripe/webhook`
- Check webhook signing secret matches
- View webhook delivery logs in Stripe Dashboard

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules allow connection to database
- Ensure SSL certificate is valid

---

## Alternative: Use Manus Hosting (Recommended)

Instead of this complex setup, you can:

1. **Keep your site on Manus** (it's already deployed!)
2. **Connect your custom domain** (lnlautomations.cloud) through Manus Settings → Domains
3. **Benefit from**:
   - Automatic SSL certificates
   - Managed database and storage
   - Built-in authentication
   - Automatic scaling
   - No server maintenance
   - One-click deployments

To connect your domain on Manus:
1. Go to Management UI → Settings → Domains
2. Add lnlautomations.cloud
3. Update your domain's DNS records as instructed
4. Done! Your store will be live at your custom domain

---

## Support

For Manus-specific features and hosting questions, visit https://help.manus.im

For Hostinger deployment issues, contact Hostinger support or consult their documentation.
