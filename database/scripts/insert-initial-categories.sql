-- Insert initial service categories if they don't exist

USE service_request_db;

-- Insert IT category
INSERT IGNORE INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('IT Support', 'Information Technology support and services', 'Computer', 1, NOW(), NOW());

-- Insert HR category
INSERT IGNORE INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('Human Resources', 'HR services and employee support', 'People', 1, NOW(), NOW());

-- Insert Facilities category
INSERT IGNORE INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('Facilities', 'Facility management and maintenance', 'Build', 1, NOW(), NOW());

-- Insert Finance category
INSERT IGNORE INTO service_category (name, description, icon, is_active, created_at, updated_at)
VALUES ('Finance', 'Financial services and support', 'AccountBalance', 1, NOW(), NOW());

-- Verify categories
SELECT * FROM service_category;
