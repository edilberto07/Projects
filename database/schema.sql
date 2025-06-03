-- HR Management System Database Schema

-- Users table for authentication and system access
CREATE TABLE payroll_users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE payroll_employees (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    bank_account VARCHAR(50),
    tax_id VARCHAR(50),
    address TEXT,
    emergency_contact TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payroll batches table
CREATE TABLE payroll_batches (
    id VARCHAR(36) PRIMARY KEY,
    batch_name VARCHAR(255) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE NOT NULL,
    department VARCHAR(100),
    employee_count INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES payroll_users(id)
);

-- Payroll records table
CREATE TABLE payroll_records (
    id VARCHAR(36) PRIMARY KEY,
    payroll_batch_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    pay_period VARCHAR(50) NOT NULL,
    basic_pay DECIMAL(15,2) NOT NULL,
    allowances DECIMAL(15,2) DEFAULT 0,
    overtime DECIMAL(15,2) DEFAULT 0,
    gross_pay DECIMAL(15,2) NOT NULL,
    tax_withheld DECIMAL(15,2) DEFAULT 0,
    sss_contribution DECIMAL(15,2) DEFAULT 0,
    phil_health_contribution DECIMAL(15,2) DEFAULT 0,
    pag_ibig_contribution DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    net_pay DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    tax_filing_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_batch_id) REFERENCES payroll_batches(id),
    FOREIGN KEY (employee_id) REFERENCES payroll_employees(id)
);

-- Change records table for audit trail
CREATE TABLE payroll_change_records (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    field VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    created_by VARCHAR(36) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES payroll_employees(id),
    FOREIGN KEY (created_by) REFERENCES payroll_users(id)
);

-- Activity log table
CREATE TABLE payroll_activity_log (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES payroll_users(id)
);

-- Reports table
CREATE TABLE payroll_reports (
    id VARCHAR(36) PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    departments JSON,
    employment_types JSON,
    include_inactive BOOLEAN DEFAULT false,
    group_by VARCHAR(100),
    sort_by VARCHAR(100),
    export_format VARCHAR(50),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(255),
    FOREIGN KEY (created_by) REFERENCES payroll_users(id)
);

-- Indexes
CREATE INDEX idx_payroll_employees_department ON payroll_employees(department);
CREATE INDEX idx_payroll_employees_employment_type ON payroll_employees(employment_type);
CREATE INDEX idx_payroll_records_employee_id ON payroll_records(employee_id);
CREATE INDEX idx_payroll_records_payment_date ON payroll_records(payment_date);
CREATE INDEX idx_payroll_batches_period ON payroll_batches(pay_period_start, pay_period_end);
CREATE INDEX idx_payroll_change_records_employee_id ON payroll_change_records(employee_id);
CREATE INDEX idx_payroll_activity_log_timestamp ON payroll_activity_log(timestamp);
CREATE INDEX idx_payroll_reports_type_date ON payroll_reports(report_type, created_at); 