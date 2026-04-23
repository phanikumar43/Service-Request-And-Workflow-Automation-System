-- Check current database state for categories and request types
USE service_request_db;

-- 1. Check if service_category table exists and has data
SELECT 'SERVICE CATEGORIES' as table_name;
SELECT * FROM service_category;

-- 2. Check if request_types table exists and has data
SELECT 'REQUEST TYPES' as table_name;
SELECT * FROM request_types;

-- 3. Check relationship between categories and types
SELECT 
    sc.id as category_id,
    sc.name as category_name,
    sc.is_active as category_active,
    COUNT(rt.id) as request_type_count
FROM service_category sc
LEFT JOIN request_types rt ON rt.category_id = sc.id
GROUP BY sc.id, sc.name, sc.is_active;

-- 4. If no data exists, insert sample data
-- Insert categories if empty
INSERT INTO service_category (name, description, icon, department, is_active, created_at, updated_at)
SELECT * FROM (
    SELECT 'IT Support' as name, 'IT and technical support services' as description, 'Computer' as icon, 'IT' as department, 1 as is_active, NOW() as created_at, NOW() as updated_at
    UNION ALL
    SELECT 'Facilities', 'Building and facility maintenance', 'Build', 'Facilities', 1, NOW(), NOW()
    UNION ALL
    SELECT 'HR Requests', 'Human resources and employee services', 'People', 'HR', 1, NOW(), NOW()
    UNION ALL
    SELECT 'General', 'General inquiries and requests', 'Category', 'General', 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM service_category LIMIT 1);

-- Insert request types if empty
INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
SELECT * FROM (
    SELECT 
        (SELECT id FROM service_category WHERE name = 'IT Support' LIMIT 1) as category_id,
        'Password Reset' as name,
        'Reset your account password' as description,
        1 as is_active,
        NOW() as created_at,
        NOW() as updated_at
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'IT Support' LIMIT 1),
        'Software Installation',
        'Request software installation',
        1, NOW(), NOW()
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'IT Support' LIMIT 1),
        'Network Access',
        'Request network access',
        1, NOW(), NOW()
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'Facilities' LIMIT 1),
        'Office Repair',
        'Report office equipment repair',
        1, NOW(), NOW()
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'Facilities' LIMIT 1),
        'Equipment Request',
        'Request new equipment',
        1, NOW(), NOW()
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'HR Requests' LIMIT 1),
        'Leave Request',
        'Request time off',
        1, NOW(), NOW()
    UNION ALL
    SELECT 
        (SELECT id FROM service_category WHERE name = 'General' LIMIT 1),
        'General Inquiry',
        'General questions or requests',
        1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM request_types LIMIT 1);

-- Verify the data
SELECT 'VERIFICATION - Categories with Request Types' as result;
SELECT 
    sc.id,
    sc.name as category,
    sc.is_active,
    rt.id as type_id,
    rt.name as request_type
FROM service_category sc
LEFT JOIN request_types rt ON rt.category_id = sc.id
ORDER BY sc.id, rt.id;
