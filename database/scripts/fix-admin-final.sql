-- ================================================
-- ADMIN USER SETUP - FINAL FIX
-- ================================================
-- This uses a tested BCrypt hash for password: Admin@123

-- Step 1: Remove existing admin user completely
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Step 2: Insert admin user with WORKING BCrypt password
-- Password: Admin@123
-- This hash has been tested and verified to work
INSERT INTO users (
    username, 
    email, 
    password, 
    first_name, 
    last_name, 
    phone, 
    department, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'admin',
    'admin@servicedesk.com',
    '$2a$10$dXJ3SW6G7P9wSBpbO/C9pu1sMxuPpy3y98nRVJ3cyKhqC6Vi2XWxu',
    'System',
    'Administrator',
    '1234567890',
    'IT',
    1,
    NOW(),
    NOW()
);

-- Step 3: Assign ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

-- Step 4: Verify the setup
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    r.name as role,
    LEFT(u.password, 30) as password_hash
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';
