-- ================================================
-- Category-Based Request Management System
-- Database Migration Script
-- ================================================

-- Step 1: Create request_types table
CREATE TABLE IF NOT EXISTS request_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_fields JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_type (category_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 2: Create request_status_history table
CREATE TABLE IF NOT EXISTS request_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id BIGINT NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by BIGINT NOT NULL,
    remarks TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id),
    INDEX idx_request_id (request_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: Modify service_requests table (add new columns if they don't exist)
-- Check and add columns one by one
SET @dbname = DATABASE();
SET @tablename = 'service_requests';
SET @columnname1 = 'category_id';
SET @columnname2 = 'type_id';
SET @columnname3 = 'custom_fields';

-- Add category_id if not exists
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = @columnname1) > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD COLUMN category_id BIGINT'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add type_id if not exists
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = @columnname2) > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD COLUMN type_id BIGINT'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add custom_fields if not exists
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = @columnname3) > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD COLUMN custom_fields JSON'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign key constraints if they don't exist
SET @fk_check1 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = @dbname 
                  AND TABLE_NAME = @tablename 
                  AND CONSTRAINT_NAME = 'fk_request_category');

SET @preparedStatement = (SELECT IF(@fk_check1 > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD CONSTRAINT fk_request_category FOREIGN KEY (category_id) REFERENCES service_categories(id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @fk_check2 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = @dbname 
                  AND TABLE_NAME = @tablename 
                  AND CONSTRAINT_NAME = 'fk_request_type');

SET @preparedStatement = (SELECT IF(@fk_check2 > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD CONSTRAINT fk_request_type FOREIGN KEY (type_id) REFERENCES request_types(id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 4: Insert default categories (if not exists)
INSERT IGNORE INTO service_categories (name, description, icon, is_active) VALUES
('IT Support', 'Technical and system-related issues', 'computer', TRUE),
('HR Requests', 'Human resources and employee services', 'people', TRUE),
('Facilities', 'Office facilities and maintenance requests', 'building', TRUE),
('General', 'Other requests, suggestions, and complaints', 'help-circle', TRUE);

-- Step 5: Insert request types for IT Support
INSERT IGNORE INTO request_types (category_id, name, description, required_fields, is_active) VALUES
((SELECT id FROM service_categories WHERE name = 'IT Support'), 
 'Login Issues', 
 'Problems accessing systems or applications',
 '["system_name", "error_message", "last_successful_login"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'IT Support'), 
 'System Access', 
 'Request for new system access or permissions',
 '["system_name", "access_level", "business_justification"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'IT Support'), 
 'Software Installation', 
 'Request for software installation or upgrade',
 '["software_name", "version", "business_justification", "urgency_reason"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'IT Support'), 
 'Hardware Issues', 
 'Hardware problems or replacement requests',
 '["device_type", "asset_tag", "issue_description", "location"]',
 TRUE);

-- Step 6: Insert request types for HR Requests
INSERT IGNORE INTO request_types (category_id, name, description, required_fields, is_active) VALUES
((SELECT id FROM service_categories WHERE name = 'HR Requests'), 
 'Leave Request', 
 'Apply for leave or time off',
 '["leave_type", "start_date", "end_date", "reason", "emergency_contact"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'HR Requests'), 
 'Payroll Issues', 
 'Salary, deductions, or payslip related issues',
 '["issue_type", "month", "expected_amount", "actual_amount"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'HR Requests'), 
 'Attendance Correction', 
 'Request for attendance or timesheet correction',
 '["date", "actual_time_in", "actual_time_out", "reason"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'HR Requests'), 
 'Policy Clarification', 
 'Questions about HR policies and procedures',
 '["policy_name", "specific_question"]',
 TRUE);

-- Step 7: Insert request types for Facilities
INSERT IGNORE INTO request_types (category_id, name, description, required_fields, is_active) VALUES
((SELECT id FROM service_categories WHERE name = 'Facilities'), 
 'Electrical Issues', 
 'Electrical problems or maintenance',
 '["location", "issue_type", "severity", "affected_area"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'Facilities'), 
 'Cleaning Request', 
 'Cleaning or housekeeping services',
 '["location", "area_type", "cleaning_type", "preferred_time"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'Facilities'), 
 'Furniture Repair', 
 'Furniture repair or replacement',
 '["furniture_type", "location", "issue_description", "replacement_needed"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'Facilities'), 
 'Office Supplies', 
 'Request for office supplies or stationery',
 '["items_needed", "quantity", "urgency"]',
 TRUE);

-- Step 8: Insert request types for General
INSERT IGNORE INTO request_types (category_id, name, description, required_fields, is_active) VALUES
((SELECT id FROM service_categories WHERE name = 'General'), 
 'Custom Request', 
 'Other requests not covered by specific categories',
 '["request_type", "details"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'General'), 
 'Suggestions', 
 'Suggestions for improvement',
 '["area", "current_situation", "proposed_improvement"]',
 TRUE),
 
((SELECT id FROM service_categories WHERE name = 'General'), 
 'Complaints', 
 'Complaints or grievances',
 '["complaint_type", "incident_date", "persons_involved"]',
 TRUE);

-- Step 9: Verify the setup
SELECT 
    c.name AS category,
    COUNT(t.id) AS type_count
FROM service_categories c
LEFT JOIN request_types t ON c.id = t.category_id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Display all request types
SELECT 
    c.name AS category,
    t.name AS type,
    t.description,
    t.is_active
FROM service_categories c
JOIN request_types t ON c.id = t.category_id
ORDER BY c.id, t.id;
