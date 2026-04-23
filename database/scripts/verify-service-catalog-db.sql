-- Quick verification script to check if database is ready

USE service_request_db;

-- Check if new columns exist
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'service_request_db' 
AND TABLE_NAME = 'service_catalog'
AND COLUMN_NAME IN ('default_priority', 'department', 'sla_hours');

-- Check if categories exist
SELECT COUNT(*) as category_count FROM service_category;

-- Show all categories
SELECT * FROM service_category;
