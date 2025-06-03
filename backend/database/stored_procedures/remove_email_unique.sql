USE bisublar_hris_dev;

-- Remove unique constraint from email column
ALTER TABLE payroll_employees
DROP INDEX email;

-- If the above doesn't work, try this alternative:
-- ALTER TABLE payroll_employees
-- DROP INDEX email_2; 