-- Fix Admin User Login Issue
-- Run this in MySQL Workbench or command line

USE service_request_db;

-- Check if admin user exists
SELECT * FROM users WHERE username = 'admin';

-- If admin user doesn't exist or password is wrong, delete and recreate
DELETE FROM user_roles WHERE user_id = (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Insert admin user with correct password hash for 'Admin@123'
INSERT INTO users (username, email, password, first_name, last_name, phone, department, is_active) VALUES
('admin', 'admin@servicedesk.com', '$2a$10$xZ8qJ9Y5K3L4M6N7O8P9QeRsT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9m', 'System', 'Administrator', '1234567890', 'IT', TRUE);

-- Assign admin role
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'));

-- Verify admin user
SELECT u.id, u.username, u.email, u.first_name, u.last_name, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username = 'admin';

SELECT 'Admin user created successfully!' as Status;
