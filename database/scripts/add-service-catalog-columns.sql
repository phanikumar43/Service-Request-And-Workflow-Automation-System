-- Add missing columns to service_catalog table for Service Catalog module

USE service_request_db;

-- Add default_priority column if it doesn't exist
ALTER TABLE service_catalog 
ADD COLUMN IF NOT EXISTS default_priority VARCHAR(20) DEFAULT 'MEDIUM';

-- Add department column if it doesn't exist
ALTER TABLE service_catalog 
ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- Add sla_hours column if it doesn't exist
ALTER TABLE service_catalog 
ADD COLUMN IF NOT EXISTS sla_hours INT;

-- Verify the changes
DESCRIBE service_catalog;

-- Check if we have any categories
SELECT * FROM service_category;
