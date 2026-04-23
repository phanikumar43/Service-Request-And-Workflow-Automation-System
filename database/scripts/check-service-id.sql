-- Check if service_id is valid for kasii's requests
SELECT 
    sr.id,
    sr.ticket_id,
    sr.title,
    sr.service_id,
    sc.name as service_name,
    sr.requester_id
FROM service_requests sr
LEFT JOIN service_catalog sc ON sr.service_id = sc.id
WHERE sr.requester_id = 2;

-- Check if there are any NULL service_ids
SELECT COUNT(*) as requests_with_null_service
FROM service_requests
WHERE service_id IS NULL;

-- Check all services
SELECT id, name, is_active FROM service_catalog;
