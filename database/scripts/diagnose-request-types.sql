-- Check if request types exist and are properly linked to categories
USE service_request_db;

-- 1. Check all categories
SELECT 'CATEGORIES' as section;
SELECT id, name, is_active FROM service_category ORDER BY id;

-- 2. Check all request types
SELECT 'REQUEST TYPES' as section;
SELECT id, name, category_id, is_active FROM request_types ORDER BY category_id, id;

-- 3. Check the relationship - this is the critical query
SELECT 'CATEGORY-TYPE RELATIONSHIP' as section;
SELECT 
    sc.id as category_id,
    sc.name as category_name,
    sc.is_active as cat_active,
    rt.id as type_id,
    rt.name as type_name,
    rt.category_id as rt_category_id,
    rt.is_active as type_active
FROM service_category sc
LEFT JOIN request_types rt ON sc.id = rt.category_id
WHERE sc.is_active = 1
ORDER BY sc.id, rt.id;

-- 4. Check specifically for Facilities (likely id=2)
SELECT 'FACILITIES REQUEST TYPES' as section;
SELECT * FROM request_types 
WHERE category_id = (SELECT id FROM service_category WHERE name = 'Facilities')
ORDER BY id;
