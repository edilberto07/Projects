DROP PROCEDURE IF EXISTS sp_employees_stats;

DELIMITER $$

CREATE PROCEDURE sp_employees_stats()
BEGIN
    SELECT 
        COUNT(*) AS total_employees,
        COUNT(CASE WHEN employment_type = 'Full-time' THEN 1 END) AS full_time_count,
        COUNT(CASE WHEN employment_type = 'Part-time' THEN 1 END) AS part_time_count,
        COUNT(CASE WHEN employment_type = 'Contract' THEN 1 END) AS contract_count,
        COUNT(CASE WHEN employment_type = 'Intern' THEN 1 END) AS intern_count,
        COUNT(DISTINCT department) AS department_count,
        COALESCE(AVG(CAST(salary AS DECIMAL(10,2))), 0) AS average_salary,
        COALESCE(MIN(CAST(salary AS DECIMAL(10,2))), 0) AS min_salary,
        COALESCE(MAX(CAST(salary AS DECIMAL(10,2))), 0) AS max_salary,
        COUNT(CASE WHEN start_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) AS new_employees_30d
    FROM payroll_employees
    WHERE STATUS = 'Active';
END$$

DELIMITER ; 