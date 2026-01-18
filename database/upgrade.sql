ALTER TABLE products
  ADD COLUMN availability TINYINT(1) DEFAULT 1,
  ADD COLUMN status ENUM('active','inactive') DEFAULT 'active';

ALTER TABLE orders
  ADD COLUMN client_id INT NULL,
  ADD COLUMN platform VARCHAR(100),
  ADD COLUMN cart_link VARCHAR(255),
  ADD COLUMN status ENUM('new','processing','confirmed','delivered','cancelled') DEFAULT 'new',
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp_phone VARCHAR(50) NOT NULL UNIQUE,
  city VARCHAR(255),
  platform VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE volunteers
  ADD COLUMN availability VARCHAR(100),
  ADD COLUMN status ENUM('active','inactive') DEFAULT 'active',
  ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  order_id INT NOT NULL,
  status ENUM('assigned','in_progress','completed') DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
