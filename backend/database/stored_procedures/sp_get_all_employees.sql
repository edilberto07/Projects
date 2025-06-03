DROP PROCEDURE IF EXISTS sp_get_all_employees;

DELIMITER $$

CREATE PROCEDURE sp_get_all_employees()
BEGIN
    -- First result set: Get all active employees
    SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        department,
        POSITION,
        employment_type,
        start_date,
        salary AS basic_salary,
        bank_account,
        tax_id,
        address,
        emergency_contact,
        notes,
        created_at,
        updated_at,
        STATUS
    FROM payroll_employees
    WHERE STATUS = 'Active'
    ORDER BY id ASC;

    -- Second result set: Get count of active employees
    SELECT COUNT(*) as active_count
    FROM payroll_employees
    WHERE STATUS = 'Active';
END$$

DELIMITER ; 