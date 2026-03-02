# LNL Automations Store - FINAL DEPLOYMENT GUIDE
## Complete Step-by-Step Instructions for Hostinger VPS

**Project:** LNL Automations Store  
**Domain:** `store.lnlautomations.cloud`  
**VPS:** Hostinger Ubuntu 24.04  
**Setup:** Docker + Traefik + MySQL  

---

## ✅ Pre-Deployment Checklist

Before you start, verify you have:

- [ ] SSH access to VPS: `root@srv1244684.hstgr.cloud`
- [ ] VPS IP address: `72.62.170.65`
- [ ] Database name: `store_lnlautomations_cloud`
- [ ] Database user: `lnlautomations`
- [ ] Database password: `MyDogSpot71$`
- [ ] Stripe Live Secret Key (`sk_live_...`)
- [ ] Stripe Live Publishable Key (`pk_live_...`)
- [ ] Stripe Webhook Secret (`whsec_...`)
- [ ] Manus App ID
- [ ] Manus Open ID
- [ ] Humanic API Key
- [ ] Frontend API Key
- [ ] Project code uploaded to `/docker/lnl-store/`

---

## Step 1: Create Project Directory

SSH into your VPS:

```bash
ssh root@srv1244684.hstgr.cloud
```

Create the directory (if not already done):

```bash
mkdir -p /docker/lnl-store
cd /docker/lnl-store
```

Verify your project files are there:

```bash
ls -la
```

You should see: `package.json`, `pnpm-lock.yaml`, `server/`, `client/`, etc.

---

## Step 2: Create Dockerfile

Create the Dockerfile for your project:

```bash
cat > /docker/lnl-store/Dockerfile << 'EOF'
# Build stage
FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Runtime stage
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
EOF
```

---

## Step 3: Create docker-compose.yml

Create the Docker Compose configuration:

```bash
cat > /docker/lnl-store/docker-compose.yml << 'EOF'
version: '3.8'

services:
  lnl_store:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=mysql://lnlautomations:MyDogSpot71%24@host.docker.internal:3306/store_lnlautomations_cloud
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - VITE_APP_ID=${VITE_APP_ID}
      - OAUTH_SERVER_URL=https://api.manus.im
      - VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
      - OWNER_NAME=LNL Automations
      - OWNER_EMAIL=${OWNER_EMAIL}
      - OWNER_OPEN_ID=${OWNER_OPEN_ID}
      - BUILT_IN_FORGE_API_URL=https://api.manus.im
      - BUILT_IN_FORGE_API_KEY=${BUILT_IN_FORGE_API_KEY}
      - VITE_APP_TITLE=LNL Automations Store
      - VITE_APP_LOGO=/logo.png
      - VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
      - VITE_FRONTEND_FORGE_API_KEY=${VITE_FRONTEND_FORGE_API_KEY}
      - VITE_ANALYTICS_ENDPOINT=${VITE_ANALYTICS_ENDPOINT:-}
      - VITE_ANALYTICS_WEBSITE_ID=${VITE_ANALYTICS_WEBSITE_ID:-}
    
    extra_hosts:
      - "host.docker.internal:host-gateway"
    
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.lnlstore.rule=Host(`store.lnlautomations.cloud`)"
      - "traefik.http.routers.lnlstore.entrypoints=web,websecure"
      - "traefik.http.routers.lnlstore.tls=true"
      - "traefik.http.routers.lnlstore.tls.certresolver=mytlschallenge"
      - "traefik.http.services.lnlstore.loadbalancer.server.port=3000"
    
    networks:
      - default

networks:
  default:
    name: n8n_default
    external: true
EOF
```

---

## Step 4: Create .env File

Create the environment variables file:

```bash
cat > /docker/lnl-store/.env << 'EOF'
# Database Configuration (pre-configured)
DATABASE_URL=mysql://lnlautomations:MyDogSpot71%24@host.docker.internal:3306/store_lnlautomations_cloud
NODE_ENV=production
PORT=3000

# Stripe Configuration - FILL IN YOUR LIVE KEYS
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_KEY_HERE

# JWT Secret - FILL IN RANDOM STRING
JWT_SECRET=YOUR_RANDOM_STRING_HERE

# Manus OAuth - FILL IN YOUR VALUES
VITE_APP_ID=YOUR_MANUS_APP_ID
OWNER_EMAIL=support@lnlautomations.cloud
OWNER_OPEN_ID=YOUR_MANUS_OPEN_ID

# Humanic Email - FILL IN YOUR KEY
BUILT_IN_FORGE_API_KEY=YOUR_HUMANIC_KEY

# Frontend API - FILL IN YOUR KEY
VITE_FRONTEND_FORGE_API_KEY=YOUR_FRONTEND_KEY

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
EOF
```

Now edit and fill in your actual credentials:

```bash
nano /docker/lnl-store/.env
```

Replace all `YOUR_*` values with your actual credentials. When done, press `Ctrl+X`, then `Y`, then `Enter`.

---

## Step 5: Create MySQL Database

Create the database on your VPS:

```bash
mysql -u root -p
```

Enter your MySQL root password.

Then paste this entire block:

```sql
CREATE DATABASE `store_lnlautomations_cloud` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `store_lnlautomations_cloud`;

-- LNL Automations Store - Complete Database Schema

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  stripe_customer_id VARCHAR(255),
  oauth_id VARCHAR(255),
  oauth_provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_stripe_customer_id (stripe_customer_id),
  INDEX idx_oauth_id (oauth_id)
);

-- Products table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description LONGTEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  stock INT DEFAULT 0,
  is_digital BOOLEAN DEFAULT FALSE,
  digital_file_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_stripe_payment_intent_id (stripe_payment_intent_id),
  INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

-- Reviews table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_is_active (is_active)
);

-- Digital downloads table
CREATE TABLE digital_downloads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  download_token VARCHAR(255) UNIQUE NOT NULL,
  download_count INT DEFAULT 0,
  max_downloads INT DEFAULT 5,
  expires_at TIMESTAMP,
  last_downloaded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_download_token (download_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_subscribed BOOLEAN DEFAULT TRUE,
  subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribe_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_is_subscribed (is_subscribed)
);

-- Cart items table
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id)
);

-- Stripe webhooks log table
CREATE TABLE stripe_webhooks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  data JSON,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  INDEX idx_event_id (event_id),
  INDEX idx_event_type (event_type),
  INDEX idx_processed (processed)
);

-- Promo codes table
CREATE TABLE promo_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_is_active (is_active)
);

EXIT;
```

---

## Step 6: Build and Deploy

Build the Docker image and start the container:

```bash
cd /docker/lnl-store
docker compose up -d --build
```

This will take 10-15 minutes. Wait for it to complete.

---

## Step 7: Verify Deployment

Check if the container is running:

```bash
docker compose ps
```

You should see:
```
NAME        STATUS
lnl_store   Up
```

Check the logs:

```bash
docker compose logs -f lnl_store
```

Look for messages like:
```
Server running on http://localhost:3000/
```

Press `Ctrl+C` to exit logs.

---

## Step 8: Update DNS

Point `store.lnlautomations.cloud` to your VPS:

1. Log in to your domain registrar (Hostinger, GoDaddy, etc.)
2. Find DNS settings for `lnlautomations.cloud`
3. Create an **A record**:
   - **Name:** `store`
   - **Type:** A
   - **Value:** `72.62.170.65`
   - **TTL:** 3600

Save changes. DNS takes 5-30 minutes to propagate.

---

## Step 9: Test Your Store

Once DNS propagates, open your browser:

```
https://store.lnlautomations.cloud
```

**Test these features:**

- [ ] Homepage loads
- [ ] Products display
- [ ] Click on a product → Product detail page loads
- [ ] View reviews on product page
- [ ] Add to cart works
- [ ] Cart page displays items
- [ ] Checkout works
- [ ] Test payment with card: `4242 4242 4242 4242`
- [ ] Order confirmation email received
- [ ] Admin panel accessible
- [ ] Can add new products

---

## Step 10: Important Post-Deployment Tasks

### Change Database Password

```bash
mysql -u root -p
```

```sql
ALTER USER 'lnlautomations'@'localhost' IDENTIFIED BY 'NEW_STRONG_PASSWORD';
FLUSH PRIVILEGES;
EXIT;
```

Update the `.env` file with the new password:

```bash
nano /docker/lnl-store/.env
```

Restart the container:

```bash
docker compose restart lnl_store
```

### Set Up Stripe Webhook

1. Log in to Stripe Dashboard
2. Go to Developers → Webhooks
3. Add endpoint:
   - **URL:** `https://store.lnlautomations.cloud/api/stripe/webhook`
   - **Events:** `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret and update `.env` with `STRIPE_WEBHOOK_SECRET`

### Configure Email Settings

Verify Humanic API key is working:
- Test by placing a test order
- Check if order confirmation email is received

---

## Useful Docker Commands

**Check status:**
```bash
docker compose ps
```

**View logs:**
```bash
docker compose logs -f lnl_store
```

**Restart container:**
```bash
docker compose restart lnl_store
```

**Stop container:**
```bash
docker compose stop lnl_store
```

**Start container:**
```bash
docker compose start lnl_store
```

**Rebuild and restart:**
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

**SSH into container:**
```bash
docker compose exec lnl_store sh
```

---

## Troubleshooting

### Container won't start
```bash
docker compose logs lnl_store
```
Check for error messages.

### Database connection error
```bash
docker compose exec lnl_store mysql -u lnlautomations -p store_lnlautomations_cloud -e "SELECT 1"
```

### Website shows 502 Bad Gateway
```bash
docker compose ps
docker compose logs lnl_store
```

### SSL certificate not working
Wait 5-30 minutes for DNS propagation, then refresh browser.

### Emails not sending
1. Verify Humanic API key in `.env`
2. Check logs: `docker compose logs lnl_store`
3. Test with a real order

---

## Maintenance Schedule

**Daily:**
- Monitor logs for errors
- Check store is accessible

**Weekly:**
- Review orders in admin panel
- Check email delivery

**Monthly:**
- Backup database
- Review analytics
- Update dependencies

---

## Backup and Recovery

**Backup database:**
```bash
mysqldump -u lnlautomations -p store_lnlautomations_cloud > backup-$(date +%Y%m%d).sql
```

**Restore database:**
```bash
mysql -u lnlautomations -p store_lnlautomations_cloud < backup-20260225.sql
```

---

## Updating Your Application

When you have new code to deploy:

```bash
cd /docker/lnl-store
git pull origin main
docker compose build --no-cache
docker compose up -d
```

---

## Security Checklist

- [ ] Changed database password
- [ ] Updated Stripe webhook URL
- [ ] Verified Humanic API key
- [ ] Set strong JWT secret
- [ ] Enabled HTTPS (automatic with Traefik)
- [ ] Configured firewall rules
- [ ] Set up regular backups
- [ ] Monitored error logs

---

## Support

If you encounter issues:

1. Check logs: `docker compose logs lnl_store`
2. Verify database connection
3. Check Stripe webhook delivery
4. Verify DNS propagation
5. Contact Hostinger support if needed

---

**Deployment Complete!** 🚀

Your LNL Automations Store is now live at `https://store.lnlautomations.cloud`

All features are ready:
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Stripe payments
- ✅ Order confirmation emails
- ✅ Customer reviews
- ✅ Digital downloads
- ✅ Admin panel
- ✅ Newsletter signup
