SET @db = DATABASE();

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE products ADD COLUMN availability TINYINT(1) DEFAULT 1',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='products' AND column_name='availability'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE products ADD COLUMN status ENUM(''active'',''inactive'') DEFAULT ''active''',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='products' AND column_name='status'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE orders ADD COLUMN client_id INT NULL',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='orders' AND column_name='client_id'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE orders ADD COLUMN platform VARCHAR(100)',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='orders' AND column_name='platform'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE orders ADD COLUMN cart_link VARCHAR(255)',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='orders' AND column_name='cart_link'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE orders ADD COLUMN status ENUM(''new'',''processing'',''confirmed'',''delivered'',''cancelled'') DEFAULT ''new''',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='orders' AND column_name='status'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='orders' AND column_name='updated_at'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  whatsapp_phone VARCHAR(50) NOT NULL UNIQUE,
  city VARCHAR(255),
  platform VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE volunteers ADD COLUMN availability VARCHAR(100)',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='volunteers' AND column_name='availability'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE volunteers ADD COLUMN status ENUM(''active'',''inactive'') DEFAULT ''active''',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='volunteers' AND column_name='status'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @stmt = (
  SELECT IF(COUNT(*)=0,
    'ALTER TABLE volunteers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema=@db AND table_name='volunteers' AND column_name='created_at'
);
PREPARE stmt FROM @stmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  order_id INT NOT NULL,
  status ENUM('assigned','in_progress','completed') DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
