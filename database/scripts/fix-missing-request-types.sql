-- Fix: Add missing request types for Facilities and General categories
USE service_request_db;

-- Get category IDs
SET @facilities_id = (SELECT id FROM service_category WHERE name = 'Facilities' LIMIT 1);
SET @general_id = (SELECT id FROM service_category WHERE name = 'General' LIMIT 1);

-- Add request types for Facilities
INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
VALUES
    (@facilities_id, 'Office Repair', 'Report office equipment or furniture repair needs', 1, NOW(), NOW()),
    (@facilities_id, 'Equipment Request', 'Request new office equipment or supplies', 1, NOW(), NOW()),
    (@facilities_id, 'Cleaning Request', 'Request cleaning or maintenance services', 1, NOW(), NOW()),
    (@facilities_id, 'Building Access', 'Request building or room access', 1, NOW(), NOW());

-- Add request types for General
INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
VALUES
    (@general_id, 'General Inquiry', 'General questions or requests', 1, NOW(), NOW()),
    (@general_id, 'Feedback', 'Provide feedback or suggestions', 1, NOW(), NOW()),
    (@general_id, 'Other', 'Other requests not covered by specific categories', 1, NOW(), NOW());

-- Verify the additions
SELECT 'VERIFICATION - Request Types by Category' as result;
SELECT 
    sc.id as category_id,
    sc.name as category,
    COUNT(rt.id) as request_type_count,
    GROUP_CONCAT(rt.name SEPARATOR ', ') as request_types
FROM service_category sc
LEFT JOIN request_types rt ON sc.id = rt.category_id AND rt.is_active = 1
WHERE sc.is_active = 1
GROUP BY sc.id, sc.name
ORDER BY sc.id;

-- Show all request types
SELECT 'ALL REQUEST TYPES' as result;
SELECT 
    rt.id,
    sc.name as category,
    rt.name as request_type,
    rt.description,
    rt.is_active
FROM request_types rt
JOIN service_category sc ON rt.category_id = sc.id
ORDER BY sc.id, rt.id;
