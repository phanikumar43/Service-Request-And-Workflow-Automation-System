-- Add HR-specific request types
USE service_request_db;

-- Get HR Request category ID
SET @hr_id = (SELECT id FROM service_category WHERE name LIKE '%HR%' LIMIT 1);

-- Add comprehensive HR request types
INSERT INTO request_types (category_id, name, description, is_active, created_at, updated_at)
VALUES
    -- Leave and Time Off
    (@hr_id, 'Leave Request', 'Request time off, vacation, sick leave, or personal days', 1, NOW(), NOW()),
    (@hr_id, 'Time Off Balance Inquiry', 'Check remaining vacation or sick leave balance', 1, NOW(), NOW()),
    
    -- Employee Information
    (@hr_id, 'Personal Information Update', 'Update address, contact details, or emergency contacts', 1, NOW(), NOW()),
    (@hr_id, 'Employment Verification', 'Request employment verification letter or certificate', 1, NOW(), NOW()),
    
    -- Payroll and Benefits
    (@hr_id, 'Payroll Inquiry', 'Questions about salary, deductions, or pay statements', 1, NOW(), NOW()),
    (@hr_id, 'Benefits Enrollment', 'Enroll in health insurance, retirement plans, or other benefits', 1, NOW(), NOW()),
    (@hr_id, 'Tax Form Request', 'Request W-2, tax documents, or update tax withholding', 1, NOW(), NOW()),
    
    -- Training and Development
    (@hr_id, 'Training Request', 'Request training courses or professional development', 1, NOW(), NOW()),
    (@hr_id, 'Performance Review', 'Schedule or discuss performance review', 1, NOW(), NOW()),
    
    -- Workplace Issues
    (@hr_id, 'Workplace Concern', 'Report workplace issues or concerns (confidential)', 1, NOW(), NOW()),
    (@hr_id, 'Policy Clarification', 'Questions about company policies or procedures', 1, NOW(), NOW()),
    
    -- Onboarding/Offboarding
    (@hr_id, 'New Hire Onboarding', 'Questions or support for new employees', 1, NOW(), NOW()),
    (@hr_id, 'Exit Process', 'Resignation, retirement, or exit-related requests', 1, NOW(), NOW());

-- Show all HR request types
SELECT 'HR REQUEST TYPES' as section;
SELECT 
    id,
    name,
    description,
    is_active
FROM request_types
WHERE category_id = @hr_id
ORDER BY id;

-- Show count
SELECT 'TOTAL HR REQUEST TYPES' as section;
SELECT COUNT(*) as total FROM request_types WHERE category_id = @hr_id AND is_active = 1;
