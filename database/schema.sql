-- Create the database
CREATE DATABASE IF NOT EXISTS campus_payroll;

USE campus_payroll;

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  employmentType VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  salary DECIMAL(12, 2) NOT NULL,
  bankAccount VARCHAR(100),
  taxId VARCHAR(50),
  address TEXT,
  emergencyContact TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payroll records table
CREATE TABLE IF NOT EXISTS payroll_records (
  id VARCHAR(36) PRIMARY KEY,
  payPeriod VARCHAR(100) NOT NULL,
  employeeId VARCHAR(36) NOT NULL,
  basicPay DECIMAL(12, 2) NOT NULL,
  allowances DECIMAL(12, 2) NOT NULL DEFAULT 0,
  overtime DECIMAL(12, 2) NOT NULL DEFAULT 0,
  grossPay DECIMAL(12, 2) NOT NULL,
  taxWithheld DECIMAL(12, 2) NOT NULL,
  sssContribution DECIMAL(12, 2) NOT NULL,
  philHealthContribution DECIMAL(12, 2) NOT NULL,
  pagIbigContribution DECIMAL(12, 2) NOT NULL,
  otherDeductions DECIMAL(12, 2) NOT NULL DEFAULT 0,
  netPay DECIMAL(12, 2) NOT NULL,
  paymentDate DATE NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  taxFilingReference VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);

-- Departments table for reference
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employment types table for reference
CREATE TABLE IF NOT EXISTS employment_types (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample departments
INSERT INTO departments (id, name, description) VALUES
(UUID(), 'Computer Science', 'Computer Science and Information Technology Department'),
(UUID(), 'Mathematics', 'Mathematics and Statistics Department'),
(UUID(), 'Physics', 'Physics and Astronomy Department'),
(UUID(), 'Chemistry', 'Chemistry and Biochemistry Department'),
(UUID(), 'Biology', 'Biology and Life Sciences Department'),
(UUID(), 'Engineering', 'Engineering and Applied Sciences Department'),
(UUID(), 'Business', 'Business Administration and Management Department');

-- Insert sample employment types
INSERT INTO employment_types (id, name, description) VALUES
(UUID(), 'Full-time', 'Regular full-time employee'),
(UUID(), 'Part-time', 'Regular part-time employee'),
(UUID(), 'Contract', 'Fixed-term contract employee'),
(UUID(), 'Temporary', 'Temporary or seasonal employee'),
(UUID(), 'Adjunct', 'Adjunct faculty member');
