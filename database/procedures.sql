DELIMITER //

-- User Management Procedures
CREATE PROCEDURE sp_create_user(
    IN p_email VARCHAR(255),
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_role VARCHAR(50),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    INSERT INTO payroll_users (id, email, first_name, last_name, role, password_hash)
    VALUES (UUID(), p_email, p_first_name, p_last_name, p_role, p_password_hash);
END //

CREATE PROCEDURE sp_get_user_by_email(IN p_email VARCHAR(255))
BEGIN
    SELECT id, email, first_name, last_name, role
    FROM payroll_users
    WHERE email = p_email;
END //

-- Employee Management Procedures
CREATE PROCEDURE sp_create_employee(
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(50),
    IN p_department VARCHAR(100),
    IN p_position VARCHAR(100),
    IN p_employment_type VARCHAR(50),
    IN p_start_date DATE,
    IN p_salary DECIMAL(15,2),
    IN p_bank_account VARCHAR(50),
    IN p_tax_id VARCHAR(50),
    IN p_address TEXT,
    IN p_emergency_contact TEXT,
    IN p_notes TEXT,
    IN p_created_by VARCHAR(36)
)
BEGIN
    DECLARE v_employee_id VARCHAR(36);
    SET v_employee_id = UUID();
    
    INSERT INTO payroll_employees (
        id, first_name, last_name, email, phone, department,
        position, employment_type, start_date, salary,
        bank_account, tax_id, address, emergency_contact, notes
    )
    VALUES (
        v_employee_id, p_first_name, p_last_name, p_email, p_phone,
        p_department, p_position, p_employment_type, p_start_date,
        p_salary, p_bank_account, p_tax_id, p_address,
        p_emergency_contact, p_notes
    );

    -- Log the creation
    INSERT INTO payroll_activity_log (id, title, description, status, user_id)
    VALUES (
        UUID(),
        'Employee Created',
        CONCAT('New employee created: ', p_first_name, ' ', p_last_name),
        'SUCCESS',
        p_created_by
    );
END //

CREATE PROCEDURE sp_update_employee(
    IN p_employee_id VARCHAR(36),
    IN p_field_name VARCHAR(100),
    IN p_new_value TEXT,
    IN p_created_by VARCHAR(36),
    IN p_reason TEXT
)
BEGIN
    DECLARE v_old_value TEXT;
    
    -- Get the old value before update
    SET v_old_value = (
        SELECT 
            CASE p_field_name
                WHEN 'first_name' THEN first_name
                WHEN 'last_name' THEN last_name
                WHEN 'email' THEN email
                WHEN 'phone' THEN phone
                WHEN 'department' THEN department
                WHEN 'position' THEN position
                WHEN 'employment_type' THEN employment_type
                WHEN 'salary' THEN CAST(salary AS CHAR)
                WHEN 'bank_account' THEN bank_account
                WHEN 'tax_id' THEN tax_id
                WHEN 'address' THEN address
                WHEN 'emergency_contact' THEN emergency_contact
                WHEN 'notes' THEN notes
            END
        FROM payroll_employees
        WHERE id = p_employee_id
    );

    -- Update the field
    SET @sql = CONCAT('UPDATE payroll_employees SET ', p_field_name, ' = ? WHERE id = ?');
    PREPARE stmt FROM @sql;
    SET @value = p_new_value;
    SET @id = p_employee_id;
    EXECUTE stmt USING @value, @id;
    DEALLOCATE PREPARE stmt;

    -- Record the change
    INSERT INTO payroll_change_records (
        id, employee_id, field, old_value, new_value,
        reason, created_by
    )
    VALUES (
        UUID(), p_employee_id, p_field_name, v_old_value,
        p_new_value, p_reason, p_created_by
    );
END //

-- Payroll Management Procedures
CREATE PROCEDURE sp_create_payroll_batch(
    IN p_batch_name VARCHAR(255),
    IN p_pay_period_start DATE,
    IN p_pay_period_end DATE,
    IN p_payment_date DATE,
    IN p_department VARCHAR(100),
    IN p_created_by VARCHAR(36)
)
BEGIN
    DECLARE v_batch_id VARCHAR(36);
    DECLARE v_employee_count INT;
    DECLARE v_total_amount DECIMAL(15,2);
    
    SET v_batch_id = UUID();
    
    -- Calculate employee count and total amount for the department
    SELECT COUNT(*), SUM(salary)
    INTO v_employee_count, v_total_amount
    FROM payroll_employees
    WHERE department = p_department;
    
    INSERT INTO payroll_batches (
        id, batch_name, pay_period_start, pay_period_end,
        payment_date, department, employee_count,
        total_amount, status, created_by
    )
    VALUES (
        v_batch_id, p_batch_name, p_pay_period_start,
        p_pay_period_end, p_payment_date, p_department,
        v_employee_count, v_total_amount, 'DRAFT', p_created_by
    );
    
    -- Create individual payroll records for each employee
    INSERT INTO payroll_records (
        id, payroll_batch_id, employee_id, pay_period,
        basic_pay, gross_pay, net_pay, payment_date
    )
    SELECT 
        UUID(), v_batch_id, id,
        CONCAT(DATE_FORMAT(p_pay_period_start, '%Y-%m'),
        ' to ',
        DATE_FORMAT(p_pay_period_end, '%Y-%m')),
        salary, salary, -- Basic calculation, adjust as needed
        salary * 0.8,  -- Simple net pay calculation
        p_payment_date
    FROM payroll_employees
    WHERE department = p_department;
END //

CREATE PROCEDURE sp_process_payroll_batch(
    IN p_batch_id VARCHAR(36),
    IN p_created_by VARCHAR(36)
)
BEGIN
    -- Update batch status
    UPDATE payroll_batches
    SET status = 'PROCESSED'
    WHERE id = p_batch_id;
    
    -- Log the action
    INSERT INTO payroll_activity_log (id, title, description, status, user_id)
    VALUES (
        UUID(),
        'Payroll Batch Processed',
        CONCAT('Payroll batch ', p_batch_id, ' has been processed'),
        'SUCCESS',
        p_created_by
    );
END //

-- Reporting Procedures
CREATE PROCEDURE sp_create_report(
    IN p_report_type VARCHAR(100),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_departments JSON,
    IN p_employment_types JSON,
    IN p_include_inactive BOOLEAN,
    IN p_group_by VARCHAR(100),
    IN p_sort_by VARCHAR(100),
    IN p_export_format VARCHAR(50),
    IN p_created_by VARCHAR(36)
)
BEGIN
    DECLARE v_report_id VARCHAR(36);
    SET v_report_id = UUID();
    
    INSERT INTO payroll_reports (
        id, report_type, start_date, end_date,
        departments, employment_types, include_inactive,
        group_by, sort_by, export_format, created_by
    )
    VALUES (
        v_report_id, p_report_type, p_start_date, p_end_date,
        p_departments, p_employment_types, p_include_inactive,
        p_group_by, p_sort_by, p_export_format, p_created_by
    );
    
    -- Return the report ID
    SELECT v_report_id AS report_id;
END //

-- Activity Logging Procedure
CREATE PROCEDURE sp_log_activity(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_status VARCHAR(50),
    IN p_user_id VARCHAR(36)
)
BEGIN
    INSERT INTO payroll_activity_log (id, title, description, status, user_id)
    VALUES (UUID(), p_title, p_description, p_status, p_user_id);
END //

-- Employee Search Procedure
CREATE PROCEDURE sp_search_employees(
    IN p_search_term VARCHAR(255),
    IN p_department VARCHAR(100),
    IN p_employment_type VARCHAR(50)
)
BEGIN
    SELECT 
        e.*,
        CONCAT(e.first_name, ' ', e.last_name) as full_name
    FROM payroll_employees e
    WHERE 
        (p_search_term IS NULL OR
         CONCAT(e.first_name, ' ', e.last_name) LIKE CONCAT('%', p_search_term, '%') OR
         e.email LIKE CONCAT('%', p_search_term, '%') OR
         e.phone LIKE CONCAT('%', p_search_term, '%'))
        AND (p_department IS NULL OR e.department = p_department)
        AND (p_employment_type IS NULL OR e.employment_type = p_employment_type)
    ORDER BY e.last_name, e.first_name;
END //

-- Payroll Summary Procedure
CREATE PROCEDURE sp_get_payroll_summary(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_department VARCHAR(100)
)
BEGIN
    SELECT 
        e.department,
        COUNT(DISTINCT pr.employee_id) as employee_count,
        SUM(pr.basic_pay) as total_basic_pay,
        SUM(pr.allowances) as total_allowances,
        SUM(pr.overtime) as total_overtime,
        SUM(pr.gross_pay) as total_gross_pay,
        SUM(pr.net_pay) as total_net_pay
    FROM payroll_records pr
    JOIN payroll_employees e ON pr.employee_id = e.id
    JOIN payroll_batches pb ON pr.payroll_batch_id = pb.id
    GROUP BY e.department
    HAVING 
        (p_department IS NULL OR department = p_department) AND
        pb.payment_date BETWEEN p_start_date AND p_end_date;
END //

-- Tax Bracket Management Procedures
CREATE PROCEDURE sp_create_tax_bracket(
    IN p_min_amount DECIMAL(15,2),
    IN p_max_amount DECIMAL(15,2),
    IN p_rate DECIMAL(5,4),
    IN p_effective_date DATE
)
BEGIN
    INSERT INTO payroll_tax_brackets (
        id, min_amount, max_amount, rate, effective_date
    )
    VALUES (
        UUID(), p_min_amount, p_max_amount, p_rate, p_effective_date
    );
END //

CREATE PROCEDURE sp_get_applicable_tax_bracket(
    IN p_amount DECIMAL(15,2),
    IN p_date DATE
)
BEGIN
    SELECT *
    FROM payroll_tax_brackets
    WHERE min_amount <= p_amount
    AND max_amount > p_amount
    AND effective_date <= p_date
    ORDER BY effective_date DESC
    LIMIT 1;
END //

-- Deduction Rule Management Procedures
CREATE PROCEDURE sp_create_deduction_rule(
    IN p_name VARCHAR(100),
    IN p_type ENUM('percentage', 'fixed'),
    IN p_value DECIMAL(15,2),
    IN p_max_amount DECIMAL(15,2),
    IN p_applicable_min_salary DECIMAL(15,2),
    IN p_applicable_max_salary DECIMAL(15,2)
)
BEGIN
    INSERT INTO payroll_deduction_rules (
        id, name, type, value, max_amount,
        applicable_min_salary, applicable_max_salary
    )
    VALUES (
        UUID(), p_name, p_type, p_value, p_max_amount,
        p_applicable_min_salary, p_applicable_max_salary
    );
END //

CREATE PROCEDURE sp_update_deduction_rule(
    IN p_rule_id VARCHAR(36),
    IN p_name VARCHAR(100),
    IN p_type ENUM('percentage', 'fixed'),
    IN p_value DECIMAL(15,2),
    IN p_max_amount DECIMAL(15,2),
    IN p_applicable_min_salary DECIMAL(15,2),
    IN p_applicable_max_salary DECIMAL(15,2)
)
BEGIN
    UPDATE payroll_deduction_rules
    SET
        name = p_name,
        type = p_type,
        value = p_value,
        max_amount = p_max_amount,
        applicable_min_salary = p_applicable_min_salary,
        applicable_max_salary = p_applicable_max_salary,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_rule_id;
END //

-- Notification Management Procedures
CREATE PROCEDURE sp_create_notification(
    IN p_user_id VARCHAR(36),
    IN p_type ENUM('info', 'warning', 'error', 'success'),
    IN p_message TEXT,
    IN p_details TEXT
)
BEGIN
    INSERT INTO payroll_notifications (
        id, user_id, type, message, details
    )
    VALUES (
        UUID(), p_user_id, p_type, p_message, p_details
    );
END //

CREATE PROCEDURE sp_mark_notification_read(
    IN p_notification_id VARCHAR(36),
    IN p_user_id VARCHAR(36)
)
BEGIN
    UPDATE payroll_notifications
    SET read = true
    WHERE id = p_notification_id
    AND user_id = p_user_id;
END //

CREATE PROCEDURE sp_mark_all_notifications_read(
    IN p_user_id VARCHAR(36)
)
BEGIN
    UPDATE payroll_notifications
    SET read = true
    WHERE user_id = p_user_id;
END //

CREATE PROCEDURE sp_get_user_notifications(
    IN p_user_id VARCHAR(36),
    IN p_limit INT
)
BEGIN
    SELECT *
    FROM payroll_notifications
    WHERE user_id = p_user_id
    ORDER BY timestamp DESC
    LIMIT p_limit;
END //

-- Calculate Deductions Procedure
CREATE PROCEDURE sp_calculate_deductions(
    IN p_employee_id VARCHAR(36),
    IN p_basic_pay DECIMAL(15,2),
    IN p_pay_period_start DATE,
    IN p_pay_period_end DATE
)
BEGIN
    DECLARE v_tax_amount DECIMAL(15,2);
    DECLARE v_sss_amount DECIMAL(15,2);
    DECLARE v_philhealth_amount DECIMAL(15,2);
    DECLARE v_pagibig_amount DECIMAL(15,2);
    
    -- Get applicable tax bracket
    SELECT rate * p_basic_pay INTO v_tax_amount
    FROM payroll_tax_brackets
    WHERE min_amount <= p_basic_pay
    AND max_amount > p_basic_pay
    AND effective_date <= p_pay_period_start
    ORDER BY effective_date DESC
    LIMIT 1;
    
    -- Calculate SSS contribution
    SET v_sss_amount = LEAST(p_basic_pay * 0.045, 1125);
    
    -- Calculate PhilHealth contribution
    SET v_philhealth_amount = LEAST(p_basic_pay * 0.035, 875);
    
    -- Calculate Pag-IBIG contribution
    SET v_pagibig_amount = LEAST(p_basic_pay * 0.02, 100);
    
    -- Return calculated deductions
    SELECT
        COALESCE(v_tax_amount, 0) as tax_amount,
        v_sss_amount as sss_deduction,
        v_philhealth_amount as philhealth_deduction,
        v_pagibig_amount as pagibig_deduction,
        (COALESCE(v_tax_amount, 0) + v_sss_amount + v_philhealth_amount + v_pagibig_amount) as total_deductions;
END //

DELIMITER ; 