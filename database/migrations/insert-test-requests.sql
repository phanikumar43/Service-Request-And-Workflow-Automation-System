-- Make service_id nullable and insert test requests

-- First, make service_id nullable
ALTER TABLE service_requests MODIFY COLUMN service_id BIGINT NULL;

-- Get user IDs
SET @user1 = (SELECT id FROM users WHERE username = 'durga' LIMIT 1);
SET @user2 = (SELECT id FROM users WHERE username = 'kasii' LIMIT 1);
SET @user3 = (SELECT id FROM users WHERE username = 'sai' LIMIT 1);

-- Get category IDs
SET @it_category = (SELECT id FROM service_categories WHERE name = 'IT Support' LIMIT 1);
SET @hr_category = (SELECT id FROM service_categories WHERE name = 'HR Requests' LIMIT 1);
SET @facilities_category = (SELECT id FROM service_categories WHERE name = 'Facilities' LIMIT 1);

-- Get department IDs
SET @it_dept = (SELECT id FROM departments WHERE name = 'IT Support' LIMIT 1);
SET @hr_dept = (SELECT id FROM departments WHERE name = 'HR Department' LIMIT 1);
SET @facilities_dept = (SELECT id FROM departments WHERE name = 'Facilities' LIMIT 1);

-- Insert test requests (without service_id)
INSERT INTO service_requests (
    ticket_id, requester_id, category_id, title, description, 
    priority, status, department_id, created_at, updated_at
) VALUES
('REQ-001', @user1, @it_category, 'Computer not starting', 'My computer won''t boot up. Shows black screen.', 'HIGH', 'NEW', @it_dept, NOW(), NOW()),
('REQ-002', @user2, @hr_category, 'Leave application', 'Need to apply for annual leave for next month.', 'MEDIUM', 'NEW', @hr_dept, NOW(), NOW()),
('REQ-003', @user3, @facilities_category, 'AC not working', 'Air conditioning in office is not cooling.', 'HIGH', 'NEW', @facilities_dept, NOW(), NOW()),
('REQ-004', @user1, @it_category, 'Password reset', 'Forgot my email password, need reset.', 'MEDIUM', 'NEW', @it_dept, NOW(), NOW()),
('REQ-005', @user2, @it_category, 'Software installation', 'Need Microsoft Office installed on my laptop.', 'LOW', 'NEW', @it_dept, NOW(), NOW());

SELECT 'Test requests inserted successfully!' as status, COUNT(*) as total FROM service_requests;
