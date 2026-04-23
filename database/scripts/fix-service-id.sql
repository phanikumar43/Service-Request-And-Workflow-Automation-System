-- First, check if any services exist
SELECT id, name, category_id FROM service_catalog LIMIT 10;

-- Check categories
SELECT id, name FROM service_categories WHERE is_active = 1;

-- If no services exist, we need to create one
-- Replace category_id with an actual category ID from above
INSERT INTO service_catalog (name, description, category_id, is_active, requires_approval, created_at, updated_at)
VALUES ('General Service Request', 'General service request for all types', 1, 1, 0, NOW(), NOW());

-- Get the ID of the service we just created
SELECT id FROM service_catalog WHERE name = 'General Service Request';

-- Now update the requests with this service_id
-- Replace <service_id> with the ID from above query
UPDATE service_requests 
SET service_id = (SELECT id FROM service_catalog WHERE name = 'General Service Request')
WHERE service_id IS NULL;

-- Verify the update
SELECT id, ticket_id, service_id FROM service_requests;
