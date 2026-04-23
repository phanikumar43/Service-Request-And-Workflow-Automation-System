-- ============================================
-- Service Catalog Database Setup Script
-- Run this script to fix all database issues
-- ============================================

USE service_request_db;

-- Step 1: Add missing columns to service_catalog table
-- ====================================================

-- Check if columns exist and add them if they don't
SET @dbname = DATABASE();
SET @tablename = 'service_catalog';

-- Add default_priority column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname 
AND TABLE_NAME = @tablename 
AND COLUMN_NAME = 'default_priority';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE service_catalog ADD COLUMN default_priority VARCHAR(20) DEFAULT ''MEDIUM''',
    'SELECT ''Column default_priority already exists'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add department column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname 
AND TABLE_NAME = @tablename 
AND COLUMN_NAME = 'department';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE service_catalog ADD COLUMN department VARCHAR(100)',
    'SELECT ''Column department already exists'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add sla_hours column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = @dbname 
AND TABLE_NAME = @tablename 
AND COLUMN_NAME = 'sla_hours';

SET @query = IF(@col_exists = 0, 
    'ALTER TABLE service_catalog ADD COLUMN sla_hours INT',
    'SELECT ''Column sla_hours already exists'' AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Insert initial service categories
-- ==========================================

-- Insert IT Support category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
SELECT 'IT Support', 'Information Technology support and services', 'Computer', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'IT Support');

-- Insert Human Resources category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
SELECT 'Human Resources', 'HR services and employee support', 'People', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Human Resources');

-- Insert Facilities category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
SELECT 'Facilities', 'Facility management and maintenance', 'Build', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Facilities');

-- Insert Finance category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
SELECT 'Finance', 'Financial services and support', 'AccountBalance', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM service_category WHERE name = 'Finance');

-- Step 3: Verify the changes
-- ===========================

SELECT '=== SERVICE_CATALOG TABLE STRUCTURE ===' AS '';
DESCRIBE service_catalog;

SELECT '=== SERVICE CATEGORIES ===' AS '';
SELECT id, name, description, is_active, created_at FROM service_category;

SELECT '=== SETUP COMPLETE ===' AS '';
SELECT 'Database schema updated successfully!' AS message;
