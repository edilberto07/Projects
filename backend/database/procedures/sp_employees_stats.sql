DELIMITER //

DROP PROCEDURE IF EXISTS sp_employees_stats //

CREATE PROCEDURE sp_employees_stats()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Get employee statistics
    SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_employees,
        SUM(CASE WHEN status = 'Active' THEN salary ELSE 0 END) as total_payroll,
        COUNT(CASE WHEN status = 'Pending Approval' THEN 1 END) as pending_approvals
    FROM payroll_employees
    WHERE is_active = 1;

    COMMIT;
END //

DELIMITER ; 