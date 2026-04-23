-- Fix User Authentication - Create Admin User
-- Run this in MySQL Workbench or command line

USE service_request_db;

-- First, check if admin exists
SELECT 'Checking existing admin user...' as Status;
SELECT id, username, email, is_active FROM users WHERE username = 'admin';

-- Delete existing admin if any (to start fresh)
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with BCrypt password for 'Admin@123'
-- BCrypt hash generated for password: Admin@123
INSERT INTO users (username, email, password, first_name, last_name, phone, department, is_active, created_at, updated_at) 
VALUES (
    'admin', 
    'admin@servicedesk.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System', 
    'Administrator', 
    '1234567890', 
    'IT', 
    TRUE,
    NOW(),
    NOW()
);

-- Get the admin user ID
SET @admin_id = LAST_INSERT_ID();

-- Get the ROLE_ADMIN ID
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');

-- Assign ROLE_ADMIN to admin user
INSERT INTO user_roles (user_id, role_id, assigned_at) 
VALUES (@admin_id, @admin_role_id, NOW());

-- Verify the admin user was created
SELECT 'Admin user created successfully!' as Status;
SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.is_active, r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

-- Also create a test end user for registration testing
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'testuser');
DELETE FROM users WHERE username = 'testuser';

INSERT INTO users (username, email, password, first_name, last_name, is_active, created_at, updated_at) 
VALUES (
    'testuser', 
    'test@example.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test', 
    'User', 
    TRUE,
    NOW(),
    NOW()
);

-- Assign ROLE_END_USER to test user
SET @test_user_id = LAST_INSERT_ID();
SET @end_user_role_id = (SELECT id FROM roles WHERE name = 'ROLE_END_USER');

INSERT INTO user_roles (user_id, role_id, assigned_at) 
VALUES (@test_user_id, @end_user_role_id, NOW());

-- Show all users
SELECT 'All users in system:' as Status;
SELECT u.id, u.username, u.email, r.name as role, u.is_active
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
ORDER BY u.id;

SELECT '
CREDENTIALS:
-----------
Admin Login:
  Username: admin
  Password: Admin@123

Test User Login:
  Username: testuser
  Password: Admin@123
' as Info;
