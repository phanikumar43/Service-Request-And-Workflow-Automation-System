-- Verify the migration was successful
USE service_request_db;

-- Check the service_category table structure
DESCRIBE service_category;

-- Check if there are any existing categories
SELECT * FROM service_category;

-- Verify the department column exists
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'service_request_db' 
  AND TABLE_NAME = 'service_category'
  AND COLUMN_NAME = 'department';
