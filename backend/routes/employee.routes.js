const express = require("express");
const employee = express.Router();
const cors = require("cors");
const db = require("../database/config");
const auth = require('../middleware/auth');
const { executeStoredProcedure, executeQuery } = require('../utils/db');

employee.use(cors());

// Disable caching for all employee routes
employee.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '0');
    res.set('Pragma', 'no-cache');
    next();
});

// Get employee statistics - This route must come before /:id to prevent conflicts
employee.get('/stats', auth, async (req, res) => {
    try {
        console.log('Fetching employee statistics...');
        const result = await executeStoredProcedure('sp_employees_stats');
        console.log('Stats result:', result);
        
        if (!result) {
            return res.json({ 
                error: false, 
                data: {
                    totalEmployees: 0,
                    activeEmployees: 0,
                    totalPayroll: 0,
                    pendingApprovals: 0,
                    upcomingPayroll: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                }
            });
        }

        // Get the first result set which contains the stats
        const stats = Array.isArray(result) ? result[0] : result;
        
        const transformedStats = {
            totalEmployees: parseInt(stats.total_employees) || 0,
            activeEmployees: (parseInt(stats.full_time_count) || 0) + 
                           (parseInt(stats.part_time_count) || 0) + 
                           (parseInt(stats.contract_count) || 0),
            totalPayroll: (parseFloat(stats.average_salary) || 0) * (parseInt(stats.total_employees) || 0),
            pendingApprovals: 0,
            upcomingPayroll: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };

        console.log('Transformed stats:', transformedStats);

        res.json({
            error: false,
            data: transformedStats
        });
    } catch (error) {
        console.error('Error fetching employee statistics:', error);
        res.json({ 
            error: false, 
            data: {
                totalEmployees: 0,
                activeEmployees: 0,
                totalPayroll: 0,
                pendingApprovals: 0,
                upcomingPayroll: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
        });
    }
});

// Get all employees
employee.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching all employees...');
        const data = await db.sequelize.query('CALL sp_get_all_employees()', {
            type: db.sequelize.QueryTypes.SELECT
        });

        const employees = db.MultiQueryResult(data).result0;
        console.log('Raw employees data:', JSON.stringify(employees, null, 2));

        if (!employees) {
            return res.json({
                error: false,
                message: 'No employees found',
                data: []
            });
        }

        // Map the employees to the expected format
        const formattedEmployees = employees
            .filter(emp => emp && emp.id) // Filter out null or invalid entries
            .map(emp => ({
                id: emp.id,
                first_name: emp.first_name,
                last_name: emp.last_name,
                email: emp.email,
                department: emp.department,
                position: emp.POSITION,
                employment_type: emp.employment_type,
                status: emp.STATUS || 'Active',
                salary: emp.basic_salary,
                start_date: emp.start_date,
                created_at: emp.created_at,
                updated_at: emp.updated_at,
                is_active: emp.STATUS === 'Active'
            }));

        console.log('Number of employees:', formattedEmployees.length);
        if (formattedEmployees.length > 0) {
            console.log('First employee:', JSON.stringify(formattedEmployees[0], null, 2));
            console.log('Last employee:', JSON.stringify(formattedEmployees[formattedEmployees.length - 1], null, 2));
        }

        res.json({
            error: false,
            message: 'Employees fetched successfully',
            data: formattedEmployees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to fetch employees',
            details: error.message
        });
    }
});

// Create new employee
employee.post('/', auth, async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            department,
            position,
            employment_type,
            start_date,
            salary
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !department || !position || 
            !employment_type || !start_date || !salary) {
            return res.status(400).json({ 
                error: true,
                message: 'Required fields are missing' 
            });
        }

        console.log('Creating employee with data:', {
            first_name,
            last_name,
            email,
            department,
            position,
            employment_type,
            start_date,
            salary
        });

        try {
            const result = await executeStoredProcedure(
                'sp_create_employees',
                [
                    first_name,
                    last_name,
                    email,
                    department,
                    position,
                    employment_type,
                    start_date,
                    salary
                ]
            );

            console.log('Stored procedure result:', result);

            // Return success response
            res.status(201).json({
                error: false,
                data: result[0]
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            
            // Check if it's an email exists error
            if (dbError.message?.includes('Email already exists')) {
                return res.status(400).json({ 
                    error: true,
                    message: 'Email already exists' 
                });
            }
            
            // For other database errors
            throw dbError;
        }
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ 
            error: true,
            message: 'Failed to create employee',
            details: error.message
        });
    }
});

// Get employee by ID
employee.get('/:id', auth, async (req, res) => {
    try {
        console.log('Fetching employee by ID:', req.params.id);
        const data = await db.sequelize.query('CALL sp_get_employee_by_id(?)', {
            replacements: [req.params.id],
            type: db.sequelize.QueryTypes.SELECT
        });

        const employee = db.MultiQueryResult(data).result0;
        console.log('Raw employee data:', JSON.stringify(employee, null, 2));

        if (!employee || employee.length === 0) {
            return res.status(404).json({ 
                error: true,
                message: 'Employee not found' 
            });
        }

        // Format the employee data to match frontend expectations
        const formattedEmployee = {
            id: employee[0].id.toString(),
            firstName: employee[0].first_name,
            lastName: employee[0].last_name,
            email: employee[0].email,
            phone: employee[0].phone || '',
            department: employee[0].department,
            position: employee[0].POSITION,
            employmentType: employee[0].employment_type,
            startDate: employee[0].start_date,
            salary: parseFloat(employee[0].basic_salary),
            bankAccount: employee[0].bank_account || '',
            taxId: employee[0].tax_id || '',
            address: employee[0].address || '',
            emergencyContact: employee[0].emergency_contact || '',
            notes: employee[0].notes || '',
            status: employee[0].STATUS || 'Active',
            isActive: employee[0].STATUS === 'Active'
        };

        console.log('Formatted employee:', JSON.stringify(formattedEmployee, null, 2));

        res.json({
            error: false,
            message: 'Employee fetched successfully',
            data: formattedEmployee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ 
            error: true,
            message: 'Failed to fetch employee',
            details: error.message
        });
    }
});

// Update employee field
employee.put('/:id/field', auth, async (req, res) => {
    try {
        const { field_name, new_value, reason } = req.body;
        const employee_id = req.params.id;
        const created_by = req.user.id; // Assuming user ID is available in request

        if (!field_name || !new_value) {
            return res.status(400).json({ error: 'Field name and new value are required' });
        }

        const result = await executeStoredProcedure('sp_update_employee', [
            employee_id,
            field_name,
            new_value,
            created_by,
            reason
        ]);

        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Get employee change history
employee.get('/:id/history', auth, async (req, res) => {
    try {
        const result = await executeQuery(
            'SELECT * FROM payroll_change_records WHERE employee_id = ? ORDER BY timestamp DESC',
            [req.params.id]
        );
        res.json(result);
    } catch (error) {
        console.error('Error fetching employee history:', error);
        res.status(500).json({ error: 'Failed to fetch employee history' });
    }
});

// Delete employee (soft delete)
employee.delete('/:id', auth, async (req, res) => {
    try {
        await executeQuery(
            'UPDATE payroll_employees SET is_active = 0 WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

module.exports = employee; 