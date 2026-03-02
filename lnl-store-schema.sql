-- LNL Automations Store - Complete Database Schema
-- Database: store_lnlautomations_cloud
-- This schema includes all tables needed for the e-commerce store

-- ============================================================================
-- USERS TABLE
-- Stores user account information
-- ============================================================================
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

-- ============================================================================
-- PRODUCTS TABLE
-- Stores product information
-- ============================================================================
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

-- ============================================================================
-- ORDERS TABLE
-- Stores order information
-- ============================================================================
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

-- ============================================================================
-- ORDER ITEMS TABLE
-- Stores individual items in each order
-- ============================================================================
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

-- ============================================================================
-- REVIEWS TABLE
-- Stores product reviews and ratings
-- ============================================================================
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

-- ============================================================================
-- DIGITAL DOWNLOADS TABLE
-- Stores secure download links for digital products
-- ============================================================================
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

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- Stores email subscribers for marketing
-- ============================================================================
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

-- ============================================================================
-- CART ITEMS TABLE (Optional - for persistent carts)
-- Stores shopping cart items
-- ============================================================================
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

-- ============================================================================
-- STRIPE WEBHOOKS LOG TABLE (Optional - for debugging)
-- Stores webhook events from Stripe
-- ============================================================================
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

-- ============================================================================
-- PROMO CODES TABLE (Optional - for discounts)
-- Stores promotional codes
-- ============================================================================
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

-- ============================================================================
-- Create Indexes for Performance
-- ============================================================================
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_digital_downloads_user_id ON digital_downloads(user_id);

-- ============================================================================
-- Insert Sample Data (Optional - for testing)
-- ============================================================================

-- Sample Admin User
INSERT INTO users (email, name, role, created_at) VALUES 
('admin@lnlautomations.cloud', 'Admin User', 'admin', NOW());

-- Sample Products
INSERT INTO products (name, slug, description, price, category, stock, is_active, created_at) VALUES 
('Automation Template #1', 'automation-template-1', 'Professional automation template for business workflows', 29.99, 'Templates', 100, TRUE, NOW()),
('Automation Template #2', 'automation-template-2', 'Advanced automation for e-commerce integration', 49.99, 'Templates', 50, TRUE, NOW()),
('Digital Guide', 'digital-guide', 'Complete guide to workflow automation', 19.99, 'Guides', 999, TRUE, NOW()),
('Premium Support Package', 'premium-support', 'One month of premium support and consultation', 99.99, 'Support', 10, TRUE, NOW());

-- ============================================================================
-- Verify Schema Creation
-- ============================================================================
-- Run this to verify all tables were created:
-- SHOW TABLES;
-- DESCRIBE users;
-- DESCRIBE products;
-- DESCRIBE orders;
-- DESCRIBE order_items;
-- DESCRIBE reviews;
-- DESCRIBE digital_downloads;
-- DESCRIBE newsletter_subscribers;
