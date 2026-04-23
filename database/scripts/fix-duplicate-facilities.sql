-- Fix duplicate Facilities categories
USE service_request_db;

-- Show current state
SELECT 'BEFORE FIX' as info;
SELECT id, name, is_active FROM service_category WHERE name = 'Facilities' ORDER BY id;

-- Deactivate the duplicate Facilities (ID 7, the one that was Finance)
UPDATE service_category 
SET is_active = 0
WHERE id = 7 AND name = 'Facilities';

-- Make sure the correct Facilities (ID 3) is active
UPDATE service_category 
SET is_active = 1
WHERE id = 3 AND name = 'Facilities';

-- Verify
SELECT 'AFTER FIX' as info;
SELECT id, name, is_active FROM service_category ORDER BY id;

SELECT 'ACTIVE CATEGORIES WITH TYPES' as info;
SELECT 
    sc.id,
    sc.name as category,
    COUNT(rt.id) as type_count
FROM service_category sc
LEFT JOIN request_types rt ON sc.id = rt.category_id AND rt.is_active = 1
WHERE sc.is_active = 1
GROUP BY sc.id, sc.name
ORDER BY sc.name;
