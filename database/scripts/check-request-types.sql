-- Quick diagnostic query
SELECT 
    rt.id,
    rt.category_id,
    rt.name,
    rt.created_at,
    rt.updated_at,
    sc.name as category_name
FROM request_types rt
LEFT JOIN service_categories sc ON rt.category_id = sc.id
WHERE rt.category_id = 1
LIMIT 5;
