-- Create the payroll_employee table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payroll_employee')
BEGIN
    CREATE TABLE payroll_employee (
        employee_id INT IDENTITY(1,1) PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        department VARCHAR(50) NOT NULL,
        position VARCHAR(50) NOT NULL,
        employment_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        basic_salary DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        is_active BIT DEFAULT 1
    );
END
GO

-- Create stored procedure for adding a new employee
CREATE OR ALTER PROCEDURE sp_create_employee
    @first_name VARCHAR(50),
    @last_name VARCHAR(50),
    @email VARCHAR(100),
    @department VARCHAR(50),
    @position VARCHAR(50),
    @employment_type VARCHAR(20),
    @status VARCHAR(20),
    @basic_salary DECIMAL(10,2),
    @start_date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM payroll_employee WHERE email = @email)
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END

        -- Insert new employee
        INSERT INTO payroll_employee (
            first_name,
            last_name,
            email,
            department,
            position,
            employment_type,
            status,
            basic_salary,
            start_date
        )
        VALUES (
            @first_name,
            @last_name,
            @email,
            @department,
            @position,
            @employment_type,
            @status,
            @basic_salary,
            @start_date
        );

        -- Return the newly created employee
        SELECT 
            employee_id,
            first_name,
            last_name,
            email,
            department,
            position,
            employment_type,
            status,
            basic_salary,
            start_date,
            created_at,
            updated_at,
            is_active
        FROM payroll_employee
        WHERE employee_id = SCOPE_IDENTITY();

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

-- Create stored procedure for getting all employees
CREATE OR ALTER PROCEDURE sp_get_all_employees
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        employee_id,
        first_name,
        last_name,
        email,
        department,
        position,
        employment_type,
        status,
        basic_salary,
        start_date,
        created_at,
        updated_at,
        is_active
    FROM payroll_employee
    WHERE is_active = 1
    ORDER BY created_at DESC;
END
GO

-- Create stored procedure for getting employee by ID
CREATE OR ALTER PROCEDURE sp_get_employee_by_id
    @employee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        employee_id,
        first_name,
        last_name,
        email,
        department,
        position,
        employment_type,
        status,
        basic_salary,
        start_date,
        created_at,
        updated_at,
        is_active
    FROM payroll_employee
    WHERE employee_id = @employee_id
    AND is_active = 1;
END
GO 