-- Fix category names and handle Finance/Facilities properly
USE service_request_db;

-- First, let's see what we have
SELECT 'CURRENT CATEGORIES' as info;
SELECT id, name, is_active FROM service_category ORDER BY id;

-- Fix typos in category names
UPDATE service_category SET name = 'IT Support' WHERE name LIKE 'IT Support%' AND name != 'IT Support';
UPDATE service_category SET name = 'Facilities' WHERE name LIKE 'Facilit%' AND name != 'Facilities';

-- Check if Finance should actually be Facilities
-- If Finance has no types and Facilities request types exist, rename Finance to Facilities
UPDATE service_category 
SET name = 'Facilities', description = 'Building and facility maintenance'
WHERE name = 'Finance' AND id NOT IN (SELECT DISTINCT category_id FROM request_types WHERE category_id IS NOT NULL);

-- If we still have Finance category, add request types
INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
SELECT 
    id,
    'Budget Request',
    'Request budget allocation or approval',
    1,
    NOW(),
    NOW()
FROM service_category 
WHERE name = 'Finance' AND is_active = 1
AND NOT EXISTS (SELECT 1 FROM request_types WHERE category_id = service_category.id AND name = 'Budget Request');

INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
SELECT 
    id,
    'Expense Reimbursement',
    'Submit expense reimbursement claim',
    1,
    NOW(),
    NOW()
FROM service_category 
WHERE name = 'Finance' AND is_active = 1
AND NOT EXISTS (SELECT 1 FROM request_types WHERE category_id = service_category.id AND name = 'Expense Reimbursement');

-- Verify
SELECT 'FIXED CATEGORIES' as info;
SELECT id, name, is_active FROM service_category WHERE is_active = 1 ORDER BY id;

SELECT 'REQUEST TYPES COUNT' as info;
SELECT 
    sc.id,
    sc.name as category,
    COUNT(rt.id) as type_count
FROM service_category sc
LEFT JOIN request_types rt ON sc.id = rt.category_id AND rt.is_active = 1
WHERE sc.is_active = 1
GROUP BY sc.id, sc.name
ORDER BY sc.id;
