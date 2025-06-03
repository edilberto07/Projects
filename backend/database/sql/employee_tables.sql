-- Create payroll_employees table
CREATE TABLE IF NOT EXISTS payroll_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Temporary') NOT NULL,
    status ENUM('Active', 'Inactive', 'On Leave') NOT NULL DEFAULT 'Active',
    basic_salary DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create payroll_change_records table for tracking changes
CREATE TABLE IF NOT EXISTS payroll_change_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    created_by INT NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES payroll_employees(id)
);

-- Stored procedure to get all active employees
DELIMITER //
CREATE PROCEDURE sp_get_all_employees()
BEGIN
    SELECT * FROM payroll_employees WHERE is_active = 1;
END //
DELIMITER ;

-- Stored procedure to get employee by ID
DELIMITER //
CREATE PROCEDURE sp_get_employee_by_id(IN employee_id INT)
BEGIN
    SELECT * FROM payroll_employees WHERE id = employee_id AND is_active = 1;
END //
DELIMITER ;

-- Stored procedure to create new employee
DELIMITER //
CREATE PROCEDURE sp_create_employee(
    IN first_name VARCHAR(100),
    IN last_name VARCHAR(100),
    IN email VARCHAR(255),
    IN department VARCHAR(100),
    IN position VARCHAR(100),
    IN employment_type VARCHAR(20),
    IN status VARCHAR(20),
    IN basic_salary DECIMAL(10,2),
    IN start_date DATE
)
BEGIN
    INSERT INTO payroll_employees (
        first_name, last_name, email, department, position,
        employment_type, status, basic_salary, start_date, is_active
    ) VALUES (
        first_name, last_name, email, department, position,
        employment_type, status, basic_salary, start_date, 1
    );
    
    SELECT * FROM payroll_employees WHERE id = LAST_INSERT_ID();
END //
DELIMITER ;

-- Stored procedure to update employee field
DELIMITER //
CREATE PROCEDURE sp_update_employee(
    IN employee_id INT,
    IN field_name VARCHAR(50),
    IN new_value TEXT,
    IN created_by INT,
    IN reason TEXT
)
BEGIN
    DECLARE old_value TEXT;
    
    -- Get the old value
    SET @sql = CONCAT('SELECT ', field_name, ' INTO @old_value FROM payroll_employees WHERE id = ?');
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING employee_id;
    DEALLOCATE PREPARE stmt;
    
    SET old_value = @old_value;
    
    -- Update the field
    SET @sql = CONCAT('UPDATE payroll_employees SET ', field_name, ' = ? WHERE id = ?');
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING new_value, employee_id;
    DEALLOCATE PREPARE stmt;
    
    -- Log the change
    INSERT INTO payroll_change_records (
        employee_id, field_name, old_value, new_value, created_by, reason
    ) VALUES (
        employee_id, field_name, old_value, new_value, created_by, reason
    );
    
    SELECT 'update_successful' as _ret;
END //
DELIMITER ;

-- Stored procedure to get employee statistics
DELIMITER //
CREATE PROCEDURE sp_employees_stats()
BEGIN
    SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_employees,
        SUM(basic_salary) as total_payroll,
        0 as pending_approvals
    FROM payroll_employees
    WHERE is_active = 1;
END //
DELIMITER ;

-- Insert some sample data
INSERT INTO payroll_employees (
    first_name, last_name, email, department, position,
    employment_type, status, basic_salary, start_date, is_active
) VALUES 
('John', 'Doe', 'john.doe@university.edu', 'IT', 'Software Developer',
'Full-time', 'Active', 50000.00, '2024-01-01', 1),
('Jane', 'Smith', 'jane.smith@university.edu', 'HR', 'HR Manager',
'Full-time', 'Active', 60000.00, '2024-01-15', 1),
('Mike', 'Johnson', 'mike.johnson@university.edu', 'Finance', 'Accountant',
'Full-time', 'Active', 45000.00, '2024-02-01', 1); 