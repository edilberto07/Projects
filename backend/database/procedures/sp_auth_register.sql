DELIMITER //

DROP PROCEDURE IF EXISTS sp_auth_register //

CREATE PROCEDURE sp_auth_register(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_firstName VARCHAR(100),
    IN p_lastName VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM payroll_users WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Email already exists';
    END IF;

    -- Insert new user
    INSERT INTO payroll_users (
        email,
        first_name,
        last_name,
        role,
        password_hash,
        created_at,
        updated_at
    ) VALUES (
        p_email,
        p_firstName,
        p_lastName,
        'user',
        p_password,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Get the inserted user (excluding password)
    SELECT 
        id,
        email,
        first_name as firstName,
        last_name as lastName,
        role,
        created_at as createdAt,
        updated_at as updatedAt
    FROM payroll_users 
    WHERE email = p_email;

    COMMIT;
END //

DELIMITER ; 