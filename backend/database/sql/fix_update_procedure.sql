DROP PROCEDURE IF EXISTS sp_update_employee;

DELIMITER //
CREATE PROCEDURE sp_update_employee(
    IN p_employee_id INT,
    IN p_field_name VARCHAR(50),
    IN p_new_value TEXT,
    IN p_created_by INT,
    IN p_reason TEXT
)
BEGIN
    DECLARE v_old_value TEXT;
    
    -- Get the old value
    SET @sql = CONCAT('SELECT ', p_field_name, ' INTO @old_value FROM payroll_employees WHERE id = ', p_employee_id);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SET v_old_value = @old_value;
    
    -- Update the field
    SET @update_sql = CONCAT('UPDATE payroll_employees SET ', p_field_name, ' = "', p_new_value, '" WHERE id = ', p_employee_id);
    PREPARE update_stmt FROM @update_sql;
    EXECUTE update_stmt;
    DEALLOCATE PREPARE update_stmt;
    
    -- Log the change
    INSERT INTO payroll_change_records (
        employee_id, field_name, old_value, new_value, created_by, reason
    ) VALUES (
        p_employee_id, p_field_name, v_old_value, p_new_value, p_created_by, p_reason
    );
    
    SELECT 'update_successful' as _ret;
END //
DELIMITER ; 