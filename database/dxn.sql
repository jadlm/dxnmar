CREATE DATABASE IF NOT EXISTS dxn;
USE dxn;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  price_mad INT NOT NULL,
  category VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description_fr TEXT,
  description_ar TEXT,
  availability TINYINT(1) DEFAULT 1,
  status ENUM('active','inactive') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  customer_name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(50),
  platform VARCHAR(100),
  cart_link VARCHAR(255),
  total_mad INT NOT NULL,
  status ENUM('new','processing','confirmed','delivered','cancelled') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price_mad INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp_phone VARCHAR(50) NOT NULL UNIQUE,
  city VARCHAR(255),
  platform VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message_fr TEXT NOT NULL,
  message_ar TEXT NOT NULL,
  rating INT NOT NULL
);

CREATE TABLE IF NOT EXISTS volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  motivation TEXT,
  availability VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  order_id INT NOT NULL,
  status ENUM('assigned','in_progress','completed') DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
