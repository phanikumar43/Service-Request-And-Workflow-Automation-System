-- Run this query to check user and request data
-- This will show you the user ID for 'kasi' and all requests

-- 1. Find the user 'kasi'
SELECT id, username, email, first_name, last_name 
FROM users 
WHERE username = 'kasi';

-- 2. Find all service requests and their requesters
SELECT 
    sr.id,
    sr.ticket_id,
    sr.title,
    sr.requester_id,
    u.username as requester_username,
    sr.created_at
FROM service_requests sr
LEFT JOIN users u ON sr.requester_id = u.id
ORDER BY sr.created_at DESC
LIMIT 20;

-- 3. Count requests by user
SELECT 
    u.id as user_id,
    u.username,
    COUNT(sr.id) as request_count
FROM users u
LEFT JOIN service_requests sr ON u.id = sr.requester_id
GROUP BY u.id, u.username
ORDER BY request_count DESC;
