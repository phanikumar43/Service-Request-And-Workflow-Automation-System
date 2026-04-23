-- Check the current service and its category
SELECT id, name, category_id FROM service_catalog WHERE id = 1;

-- Check what category ID 1 is
SELECT id, name FROM service_categories WHERE id = 1;

-- Update the General Service Request to have the correct category
-- This will make the category visible in the UI
UPDATE service_catalog 
SET category_id = 1 
WHERE id = 1;

-- Verify the update
SELECT sc.id, sc.name as service_name, cat.name as category_name 
FROM service_catalog sc 
LEFT JOIN service_categories cat ON sc.category_id = cat.id 
WHERE sc.id = 1;

-- Now check if the requests show the category correctly
SELECT 
    sr.ticket_id,
    u.username,
    sr.title,
    cat.name as category_name,
    sc.name as service_name
FROM service_requests sr
LEFT JOIN users u ON sr.requester_id = u.id
LEFT JOIN service_catalog sc ON sr.service_id = sc.id
LEFT JOIN service_categories cat ON sc.category_id = cat.id
WHERE sr.ticket_id LIKE 'SR-%'
ORDER BY sr.created_at DESC;
