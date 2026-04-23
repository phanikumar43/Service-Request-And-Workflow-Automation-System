-- =====================================================
-- Role-Based Authorization System - Database Setup
-- =====================================================
-- This script initializes the roles table with ADMIN and USER roles
-- and creates a default admin user for system access

-- Insert roles if they don't exist (using INSERT IGNORE to avoid duplicates)
INSERT IGNORE INTO roles (name, description, created_at, updated_at) 
VALUES 
    ('ROLE_ADMIN', 'Administrator with full system access', NOW(), NOW()),
    ('ROLE_USER', 'Regular user with limited access', NOW(), NOW());

-- Display created roles
SELECT * FROM roles WHERE name IN ('ROLE_ADMIN', 'ROLE_USER');

-- Note: Create admin user manually or use the application's register endpoint
-- Then assign ROLE_ADMIN using the following query:
-- 
-- INSERT INTO user_roles (user_id, role_id)
-- SELECT u.id, r.id 
-- FROM users u, roles r 
-- WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';
