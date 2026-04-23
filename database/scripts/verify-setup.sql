-- Verify Categories and Request Types Setup
USE service_request_db;

-- Show all categories
SELECT '=== SERVICE CATEGORIES ===' as info;
SELECT 
    id,
    name,
    description,
    icon,
    department,
    is_active,
    created_at
FROM service_category
ORDER BY id;

-- Show all request types
SELECT '=== REQUEST TYPES ===' as info;
SELECT 
    rt.id,
    rt.name as request_type,
    rt.description,
    sc.name as category,
    rt.is_active,
    rt.created_at
FROM request_types rt
LEFT JOIN service_category sc ON rt.category_id = sc.id
ORDER BY sc.id, rt.id;

-- Show summary
SELECT '=== SUMMARY ===' as info;
SELECT 
    sc.id as category_id,
    sc.name as category_name,
    sc.is_active as category_active,
    COUNT(rt.id) as request_type_count
FROM service_category sc
LEFT JOIN request_types rt ON rt.category_id = sc.id AND rt.is_active = 1
WHERE sc.is_active = 1
GROUP BY sc.id, sc.name, sc.is_active
ORDER BY sc.id;
