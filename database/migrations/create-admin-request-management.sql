-- ================================================
-- Admin Request Management Module - Database Schema
-- ================================================

-- Step 1: Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 2: Create category_department_mapping table
CREATE TABLE IF NOT EXISTS category_department_mapping (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_department (category_id, department_id),
    INDEX idx_category (category_id),
    INDEX idx_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: Add columns to service_requests table (if they don't exist)
SET @dbname = DATABASE();
SET @tablename = 'service_requests';

-- Add department_id if not exists
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = 'department_id') > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD COLUMN department_id BIGINT'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add assigned_agent_id if not exists
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
   AND TABLE_NAME = @tablename
   AND COLUMN_NAME = 'assigned_agent_id') > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD COLUMN assigned_agent_id BIGINT'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign keys if they don't exist
SET @fk_check1 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = DATABASE() 
                  AND TABLE_NAME = 'service_requests' 
                  AND CONSTRAINT_NAME = 'fk_request_department');

SET @preparedStatement = (SELECT IF(@fk_check1 > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD CONSTRAINT fk_request_department FOREIGN KEY (department_id) REFERENCES departments(id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @fk_check2 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = DATABASE() 
                  AND TABLE_NAME = 'service_requests' 
                  AND CONSTRAINT_NAME = 'fk_request_assigned_agent');

SET @preparedStatement = (SELECT IF(@fk_check2 > 0,
  'SELECT 1',
  'ALTER TABLE service_requests ADD CONSTRAINT fk_request_assigned_agent FOREIGN KEY (assigned_agent_id) REFERENCES users(id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 4: Insert default departments
INSERT IGNORE INTO departments (name, description) VALUES
('IT Support', 'General IT support and troubleshooting'),
('Hardware Team', 'Computer hardware and equipment support'),
('Software Team', 'Software applications and systems support'),
('Network Team', 'Network infrastructure and connectivity'),
('HR Department', 'Human Resources services and employee support'),
('Finance Department', 'Financial services, payroll, and accounting'),
('Facilities', 'Office facilities and maintenance');

-- Step 5: Create category-department mappings based on existing categories
-- Get category IDs and map to departments
SET @it_support_dept = (SELECT id FROM departments WHERE name = 'IT Support' LIMIT 1);
SET @hardware_dept = (SELECT id FROM departments WHERE name = 'Hardware Team' LIMIT 1);
SET @software_dept = (SELECT id FROM departments WHERE name = 'Software Team' LIMIT 1);
SET @network_dept = (SELECT id FROM departments WHERE name = 'Network Team' LIMIT 1);
SET @hr_dept = (SELECT id FROM departments WHERE name = 'HR Department' LIMIT 1);
SET @finance_dept = (SELECT id FROM departments WHERE name = 'Finance Department' LIMIT 1);
SET @facilities_dept = (SELECT id FROM departments WHERE name = 'Facilities' LIMIT 1);

-- Map existing categories to departments
-- IT Support category
INSERT IGNORE INTO category_department_mapping (category_id, department_id)
SELECT id, @it_support_dept FROM service_categories WHERE name = 'IT Support';

-- HR Requests category
INSERT IGNORE INTO category_department_mapping (category_id, department_id)
SELECT id, @hr_dept FROM service_categories WHERE name = 'HR Requests';

-- Facilities category
INSERT IGNORE INTO category_department_mapping (category_id, department_id)
SELECT id, @facilities_dept FROM service_categories WHERE name = 'Facilities';

-- General category - map to IT Support as default
INSERT IGNORE INTO category_department_mapping (category_id, department_id)
SELECT id, @it_support_dept FROM service_categories WHERE name = 'General';

-- Step 6: Add indexes for performance (if they don't exist)
SET @index_check1 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'service_requests' 
                     AND INDEX_NAME = 'idx_department');

SET @preparedStatement = (SELECT IF(@index_check1 > 0,
  'SELECT 1',
  'CREATE INDEX idx_department ON service_requests(department_id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @index_check2 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'service_requests' 
                     AND INDEX_NAME = 'idx_assigned_agent');

SET @preparedStatement = (SELECT IF(@index_check2 > 0,
  'SELECT 1',
  'CREATE INDEX idx_assigned_agent ON service_requests(assigned_agent_id)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @index_check3 = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'service_requests' 
                     AND INDEX_NAME = 'idx_status_priority');

SET @preparedStatement = (SELECT IF(@index_check3 > 0,
  'SELECT 1',
  'CREATE INDEX idx_status_priority ON service_requests(status, priority)'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verification queries
SELECT 'Departments created:' as info, COUNT(*) as count FROM departments;
SELECT 'Category mappings created:' as info, COUNT(*) as count FROM category_department_mapping;
SELECT 'Service requests table updated' as info;
