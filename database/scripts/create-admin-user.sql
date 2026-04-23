-- =====================================================
-- Create Admin User
-- =====================================================
-- This script creates an admin user with username 'admin' and password 'admin123'

-- Step 1: Insert admin user
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, phone, department, is_active, created_at, updated_at)
VALUES (
    'admin',
    'admin@servicedesk.com',
    '$2a$10$rKZwYqJqLqYqJqLqYqJqLOeH3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z.',  -- This is a placeholder, will be replaced
    'System',
    'Administrator',
    '1234567890',
    'IT',
    1,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE username=username;

-- Step 2: Get the admin user ID and ROLE_ADMIN role ID, then assign the role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Display the created admin user
SELECT u.id, u.username, u.email, u.first_name, u.last_name, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

-- Note: The password above is a placeholder. You need to:
-- 1. Start your backend application
-- 2. Use the /auth/register endpoint to create the admin user
-- 3. Then run the role assignment part of this script
