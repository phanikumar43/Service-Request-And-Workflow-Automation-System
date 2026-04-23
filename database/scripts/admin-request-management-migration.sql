-- Admin Request Management Enhancement - Database Migration

USE service_request_db;

-- Create activity log table for audit trail
CREATE TABLE IF NOT EXISTS request_activity_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    performed_by BIGINT,
    old_value TEXT,
    new_value TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES service_request(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_request_id (request_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ensure foreign keys exist on service_request table
-- Check if foreign key for department exists
SET @fk_exists = (SELECT COUNT(*) 
                  FROM information_schema.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = 'service_request_db' 
                  AND TABLE_NAME = 'service_request' 
                  AND CONSTRAINT_NAME = 'fk_service_request_department');

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE service_request ADD CONSTRAINT fk_service_request_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL',
    'SELECT "Foreign key fk_service_request_department already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if foreign key for assigned_agent exists
SET @fk_exists = (SELECT COUNT(*) 
                  FROM information_schema.TABLE_CONSTRAINTS 
                  WHERE CONSTRAINT_SCHEMA = 'service_request_db' 
                  AND TABLE_NAME = 'service_request' 
                  AND CONSTRAINT_NAME = 'fk_service_request_agent');

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE service_request ADD CONSTRAINT fk_service_request_agent FOREIGN KEY (assigned_agent_id) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT "Foreign key fk_service_request_agent already exists" AS message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the changes
SELECT 'Activity log table created successfully!' AS status;
DESCRIBE request_activity_log;

SELECT 'Foreign keys verified!' AS status;
SHOW CREATE TABLE service_request;
