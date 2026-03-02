# LNL Automations Store - Quick Start Deployment Guide
## Hostinger VPS (Ubuntu 24.04)

This is a simplified, step-by-step guide to deploy your store. Follow each step in order.

---

## BEFORE YOU START - Gather Your Information

Have these ready before starting:

- [ ] Your VPS IP Address: `_______________________`
- [ ] SSH Username: `_______________________` (usually "root")
- [ ] SSH Password: `_______________________`
- [ ] Stripe Live Secret Key: `_______________________`
- [ ] Stripe Live Publishable Key: `_______________________`
- [ ] Stripe Webhook Secret: `_______________________`
- [ ] Humanic API Key: `_______________________`
- [ ] Your Email Address: `_______________________`
- [ ] Strong Database Password: `_______________________`
- [ ] Strong JWT Secret: `_______________________`

---

## STEP 1: Connect to Your VPS (5 minutes)

### On Your Local Computer (Mac/Linux/Windows):

Open Terminal and run:

```bash
ssh root@YOUR_VPS_IP_ADDRESS
```

Replace `YOUR_VPS_IP_ADDRESS` with your actual VPS IP.

When prompted, enter your SSH password.

**You should now see a command prompt like:** `root@vps:~#`

---

## STEP 2: Run Automated Setup (10 minutes)

Copy and paste this entire command into your VPS terminal:

```bash
apt update && apt upgrade -y && apt install -y curl wget git build-essential software-properties-common && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs && npm install -g pnpm && npm install -g pm2 && apt install -y mysql-server nginx certbot python3-certbot-nginx
```

This will:
- Update system packages
- Install Node.js 22
- Install pnpm
- Install PM2
- Install Nginx
- Install MySQL
- Install Certbot (for SSL)

Wait for it to complete (you'll see `root@vps:~#` again).

---

## STEP 3: Secure MySQL (5 minutes)

Run this command:

```bash
sudo mysql_secure_installation
```

When prompted, answer:
- **Validate Password Plugin?** → Type `y` and press Enter
- **Password Validation Level?** → Type `2` and press Enter
- **Change root password?** → Type `y` and press Enter
- **Enter new password:** → Enter a strong password (save this!)
- **Re-enter new password:** → Enter the same password again
- **Remove anonymous users?** → Type `y` and press Enter
- **Disable root login remotely?** → Type `y` and press Enter
- **Remove test database?** → Type `y` and press Enter
- **Reload privilege tables?** → Type `y` and press Enter

---

## STEP 4: Create Database (5 minutes)

Run this command:

```bash
sudo mysql -u root -p
```

When prompted, enter the MySQL root password you just created.

You should see: `mysql>`

Now copy and paste this entire block:

```sql
CREATE DATABASE lnl_automations_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lnl_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON lnl_automations_store.* TO 'lnl_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**IMPORTANT:** Replace `YOUR_STRONG_DB_PASSWORD` with your actual database password (the one you saved earlier).

---

## STEP 5: Create Application Directory (2 minutes)

Run these commands one by one:

```bash
mkdir -p /var/www/lnl_automations_store
cd /var/www/lnl_automations_store
```

---

## STEP 6: Upload Your Project Files (5-10 minutes)

**Option A: If you have GitHub set up:**

```bash
git clone https://github.com/YOUR_USERNAME/lnl_automations_store.git .
```

Replace `YOUR_USERNAME` with your GitHub username.

**Option B: If you don't have GitHub:**

Use SFTP to upload files. On your LOCAL computer:

```bash
sftp root@YOUR_VPS_IP_ADDRESS
cd /var/www/lnl_automations_store
put -r /path/to/your/local/project/* .
exit
```

---

## STEP 7: Install Dependencies (5 minutes)

Back on your VPS, run:

```bash
cd /var/www/lnl_automations_store
pnpm install
```

Wait for it to complete.

---

## STEP 8: Build Project (5 minutes)

Run:

```bash
pnpm build
```

Wait for it to complete.

---

## STEP 9: Create Environment File (5 minutes)

Run this command:

```bash
cat > /var/www/lnl_automations_store/.env << 'EOF'
DATABASE_URL=mysql://lnl_user:YOUR_DB_PASSWORD@localhost:3306/lnl_automations_store
NODE_ENV=production
PORT=3000
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
JWT_SECRET=YOUR_JWT_SECRET
VITE_APP_ID=YOUR_MANUS_APP_ID
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_NAME=LNL Automations
OWNER_EMAIL=YOUR_EMAIL@lnlautomations.cloud
OWNER_OPEN_ID=YOUR_MANUS_OPEN_ID
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=YOUR_HUMANIC_API_KEY
VITE_APP_TITLE=LNL Automations Store
VITE_APP_LOGO=/logo.png
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=YOUR_FRONTEND_API_KEY
EOF
```

Now edit the file and replace all the placeholder values:

```bash
nano /var/www/lnl_automations_store/.env
```

Replace:
- `YOUR_DB_PASSWORD` → Your database password
- `YOUR_STRIPE_SECRET_KEY` → Your Stripe secret key
- `YOUR_STRIPE_PUBLISHABLE_KEY` → Your Stripe publishable key
- `YOUR_WEBHOOK_SECRET` → Your Stripe webhook secret
- `YOUR_JWT_SECRET` → A random string (example: `abc123xyz789`)
- `YOUR_MANUS_APP_ID` → Your Manus app ID
- `YOUR_EMAIL@lnlautomations.cloud` → Your email
- `YOUR_MANUS_OPEN_ID` → Your Manus open ID
- `YOUR_HUMANIC_API_KEY` → Your Humanic API key
- `YOUR_FRONTEND_API_KEY` → Your frontend API key

When done, press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## STEP 10: Secure Environment File (1 minute)

Run:

```bash
chmod 600 /var/www/lnl_automations_store/.env
```

---

## STEP 11: Create Log Directory (1 minute)

Run:

```bash
mkdir -p /var/log/lnl-store
chmod 755 /var/log/lnl-store
```

---

## STEP 12: Start Application with PM2 (2 minutes)

Run:

```bash
cd /var/www/lnl_automations_store
pm2 start ecosystem.config.js
pm2 status
```

You should see the application is running.

Enable auto-start on boot:

```bash
pm2 startup
pm2 save
```

Follow any instructions PM2 provides.

---

## STEP 13: Configure Nginx (5 minutes)

Create Nginx configuration:

```bash
sudo cat > /etc/nginx/sites-available/lnlautomations.cloud << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name lnlautomations.cloud www.lnlautomations.cloud;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name lnlautomations.cloud www.lnlautomations.cloud;

    ssl_certificate /etc/letsencrypt/live/lnlautomations.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lnlautomations.cloud/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    access_log /var/log/nginx/lnlautomations.cloud.access.log;
    error_log /var/log/nginx/lnlautomations.cloud.error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }
}
EOF
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/lnlautomations.cloud /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

Test Nginx:

```bash
sudo nginx -t
```

You should see: `nginx: configuration file test is successful`

Start Nginx:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## STEP 14: Get SSL Certificate (5 minutes)

Run:

```bash
sudo certbot certonly --standalone -d lnlautomations.cloud -d www.lnlautomations.cloud
```

When prompted:
- **Enter email address:** → Enter your email
- **Agree to terms?** → Type `y` and press Enter
- **Share email with EFF?** → Type `n` and press Enter (optional)

Wait for success message.

Reload Nginx:

```bash
sudo systemctl reload nginx
```

---

## STEP 15: Point Your Domain to VPS (5 minutes)

**In your domain registrar (Hostinger, GoDaddy, etc.):**

1. Log in to your domain account
2. Find DNS settings for `lnlautomations.cloud`
3. Create or update an **A record**:
   - **Name:** `@` (or leave blank)
   - **Type:** A
   - **Value:** `YOUR_VPS_IP_ADDRESS`
   - **TTL:** 3600

4. Save changes

**Wait 5-30 minutes for DNS to update.**

---

## STEP 16: Test Your Store (10 minutes)

Open your browser and visit:

```
https://lnlautomations.cloud
```

You should see your store homepage!

**Test these:**

1. **Homepage loads** ✓
2. **Products display** ✓
3. **Add product to cart** ✓
4. **Go to checkout** ✓
5. **Use test card:** `4242 4242 4242 4242` with any future date and any 3-digit CVC ✓
6. **Complete payment** ✓
7. **Check order confirmation email** ✓

---

## STEP 17: Set Up Automated Backups (5 minutes)

Run:

```bash
sudo crontab -e
```

Add this line at the bottom:

```
0 2 * * * /home/ubuntu/backup-database.sh backup
```

This backs up your database every day at 2 AM.

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## DONE! 🎉

Your store is now live at `https://lnlautomations.cloud`

---

## Useful Commands for Later

**Check if app is running:**
```bash
pm2 status
```

**View app logs:**
```bash
pm2 logs lnl-store
```

**Restart app:**
```bash
pm2 restart lnl-store
```

**Stop app:**
```bash
pm2 stop lnl-store
```

**Check disk space:**
```bash
df -h
```

**Check memory usage:**
```bash
free -h
```

**View Nginx errors:**
```bash
sudo tail -f /var/log/nginx/lnlautomations.cloud.error.log
```

---

## Troubleshooting

### Website shows "502 Bad Gateway"
```bash
pm2 status
pm2 logs lnl-store
```

### Can't connect to database
```bash
mysql -u lnl_user -p lnl_automations_store -e "SELECT 1"
```

### SSL certificate not working
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Emails not sending
```bash
pm2 logs lnl-store | grep -i email
```

---

**Need help?** Check the full guide: `HOSTINGER_VPS_DEPLOYMENT.md`
