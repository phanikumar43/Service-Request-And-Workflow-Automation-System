-- Fix roles table schema
USE service_request_db;

-- Check if created_at column exists, if not add it
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'service_request_db' 
    AND TABLE_NAME = 'roles' 
    AND COLUMN_NAME = 'created_at');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE roles ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER description',
    'SELECT "Column created_at already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if updated_at column exists, if not add it
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'service_request_db' 
    AND TABLE_NAME = 'roles' 
    AND COLUMN_NAME = 'updated_at');

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE roles ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at',
    'SELECT "Column updated_at already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the fix
SELECT 'Roles table structure:' AS message;
DESCRIBE roles;
