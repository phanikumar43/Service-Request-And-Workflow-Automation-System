-- Email Settings Table
CREATE TABLE IF NOT EXISTS email_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) DEFAULT 'smtp',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Email Audit Log Table
CREATE TABLE IF NOT EXISTS email_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL, -- SENT, FAILED
    error_message TEXT,
    request_id BIGINT,
    triggered_by VARCHAR(100)
);

-- Add indexes for better query performance
CREATE INDEX idx_email_log_recipient ON email_audit_log(recipient);
CREATE INDEX idx_email_log_request_id ON email_audit_log(request_id);
CREATE INDEX idx_email_log_sent_at ON email_audit_log(sent_at);
