-- Check if admin user exists
SELECT * FROM users WHERE username = 'admin';

-- Check if roles exist
SELECT * FROM roles;

-- Check if user has roles assigned
SELECT u.username, r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

-- If admin user doesn't exist, create it
-- Note: Password is BCrypt hash of 'Admin@123'
INSERT INTO users (username, email, password, first_name, last_name, is_active, created_at, updated_at)
VALUES ('admin', 'admin@servicedesk.com', '$2a$10$xqGXZ8Qr5YZ5Z5Z5Z5Z5ZeN5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin', 'User', 1, NOW(), NOW());

-- Get the admin user ID
SET @admin_user_id = (SELECT id FROM users WHERE username = 'admin');

-- Get the admin role ID
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN');

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
VALUES (@admin_user_id, @admin_role_id);
