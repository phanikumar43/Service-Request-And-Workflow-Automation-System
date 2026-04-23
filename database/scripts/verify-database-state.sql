-- Run this query to check the ACTUAL data in the database
-- This will show us what's really in the service_requests table

SELECT 
    sr.id,
    sr.ticket_id,
    sr.title,
    sr.requester_id,
    u.username as requester_username,
    u.email as requester_email,
    sr.created_at
FROM service_requests sr
LEFT JOIN users u ON sr.requester_id = u.id
ORDER BY sr.created_at DESC
LIMIT 20;

-- Also check if user kasii exists and what ID they have
SELECT id, username, email FROM users WHERE username = 'kasii';

-- Check if there are ANY requests at all
SELECT COUNT(*) as total_requests FROM service_requests;
