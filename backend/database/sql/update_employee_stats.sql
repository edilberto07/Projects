-- Drop the existing stored procedure
DROP PROCEDURE IF EXISTS sp_employees_stats;

-- Recreate the stored procedure with the correct column name
DELIMITER $$

CREATE PROCEDURE sp_employees_stats()
BEGIN
    SELECT 
        COUNT(*) as total_employees,
        COUNT(CASE WHEN employment_type = 'Full-time' THEN 1 END) as full_time_count,
        COUNT(CASE WHEN employment_type = 'Part-time' THEN 1 END) as part_time_count,
        COUNT(CASE WHEN employment_type = 'Contract' THEN 1 END) as contract_count,
        COUNT(CASE WHEN employment_type = 'Intern' THEN 1 END) as intern_count,
        COUNT(DISTINCT department) as department_count,
        COALESCE(AVG(CAST(salary AS DECIMAL(10,2))), 0) as average_salary,
        COALESCE(MIN(CAST(salary AS DECIMAL(10,2))), 0) as min_salary,
        COALESCE(MAX(CAST(salary AS DECIMAL(10,2))), 0) as max_salary,
        COUNT(CASE WHEN start_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as new_employees_30d
    FROM payroll_employees
    WHERE status = 'Active';
END$$

DELIMITER ; 