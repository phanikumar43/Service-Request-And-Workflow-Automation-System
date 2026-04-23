-- MANUAL FIX: Run these SQL commands one by one in MySQL

USE service_request_db;

-- Step 1: Add columns to service_catalog
ALTER TABLE service_catalog ADD COLUMN default_priority VARCHAR(20) DEFAULT 'MEDIUM';
ALTER TABLE service_catalog ADD COLUMN department VARCHAR(100);
ALTER TABLE service_catalog ADD COLUMN sla_hours INT;

-- Step 2: Insert IT Support category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('IT Support', 'IT services', 'Computer', 1, NOW(), NOW());

-- Step 3: Verify
SELECT * FROM service_category;
DESCRIBE service_catalog;
