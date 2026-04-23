-- COPY AND PASTE THIS INTO MYSQL WORKBENCH
-- Then click Execute (lightning bolt icon)

USE service_request_db;

-- Add the 3 missing columns
ALTER TABLE service_catalog ADD COLUMN default_priority VARCHAR(20) DEFAULT 'MEDIUM';
ALTER TABLE service_catalog ADD COLUMN department VARCHAR(100);
ALTER TABLE service_catalog ADD COLUMN sla_hours INT;

-- Add a test category
INSERT INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('IT Support', 'IT services', 'Computer', 1, NOW(), NOW());

-- Verify it worked
SELECT 'Columns added successfully!' as status;
DESCRIBE service_catalog;
