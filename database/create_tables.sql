-- Drop existing tables if they exist
DROP TABLE IF EXISTS payroll_notifications;
DROP TABLE IF EXISTS payroll_deduction_rules;
DROP TABLE IF EXISTS payroll_tax_brackets;

-- Tax brackets table
CREATE TABLE payroll_tax_brackets (
    id VARCHAR(36) PRIMARY KEY,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    rate DECIMAL(5,4) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Deduction rules table
CREATE TABLE payroll_deduction_rules (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2),
    applicable_min_salary DECIMAL(15,2),
    applicable_max_salary DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications table (using is_read instead of read since read is a reserved word)
CREATE TABLE payroll_notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    is_read BOOLEAN DEFAULT false,
    notification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES payroll_users(id)
);

-- Create indexes
CREATE INDEX idx_tax_brackets_amount ON payroll_tax_brackets(min_amount, max_amount);
CREATE INDEX idx_tax_brackets_date ON payroll_tax_brackets(effective_date);
CREATE INDEX idx_deduction_rules_type ON payroll_deduction_rules(type);
CREATE INDEX idx_notifications_user ON payroll_notifications(user_id, is_read);
CREATE INDEX idx_notifications_timestamp ON payroll_notifications(notification_timestamp); 