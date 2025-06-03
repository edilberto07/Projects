const express = require('express');
const router = express.Router();
const db = require('../database/config');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const deductionRuleValidation = [
    body('name').trim().notEmpty(),
    body('type').isIn(['percentage', 'fixed']),
    body('value').isNumeric(),
    body('maxAmount').optional().isNumeric(),
    body('applicableToSalaryRange.min').optional().isNumeric(),
    body('applicableToSalaryRange.max').optional().isNumeric()
];

// Get all tax brackets
router.get('/tax-brackets', auth, async (req, res) => {
    try {
        const result = await db.sequelize.query(
            'CALL sp_tax_brackets_get_all()',
            {
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No tax brackets found'
            });
        }

        res.status(200).json({
            error: false,
            data: result[0]
        });
    } catch (err) {
        console.error('Error getting tax brackets:', err);
        res.status(500).json({
            error: true,
            message: 'Internal server error while fetching tax brackets'
        });
    }
});

// Get all deduction rules
router.get('/rules', auth, async (req, res) => {
    try {
        const [rules] = await db.sequelize.query('CALL sp_deduction_rules_get_all()', {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!rules || rules.length === 0) {
            return res.status(404).json({ error: true, message: 'No deduction rules found' });
        }

        res.json({ error: false, data: rules });
    } catch (err) {
        console.error('Error fetching deduction rules:', err);
        res.status(500).json({ error: true, message: 'Internal server error while fetching deduction rules' });
    }
});

// Calculate deductions
router.post('/calculate', auth, async (req, res) => {
    try {
        const { employeeId, basicPay, payPeriod } = req.body;

        if (!employeeId || !basicPay || !payPeriod) {
            return res.status(400).json({
                error: true,
                message: 'Employee ID, basic pay, and pay period are required'
            });
        }

        const result = await db.sequelize.query(
            'CALL sp_deductions_calculate(?, ?, ?)',
            {
                replacements: [employeeId, basicPay, payPeriod],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No deductions calculated'
            });
        }

        res.status(200).json({
            error: false,
            data: result[0][0]
        });
    } catch (err) {
        console.error('Error calculating deductions:', err);
        res.status(500).json({
            error: true,
            message: 'Internal server error while calculating deductions'
        });
    }
});

// Update deduction rule
router.put('/rules/:id', auth, deductionRuleValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: true,
                message: 'Invalid input data',
                details: errors.array()
            });
        }

        const [result] = await db.sequelize.query('CALL sp_deduction_rules_update(:id, :name, :type, :value, :max_amount, :min_salary, :max_salary)', {
            replacements: {
                id: req.params.id,
                name: req.body.name,
                type: req.body.type,
                value: req.body.value,
                max_amount: req.body.maxAmount,
                min_salary: req.body.applicableToSalaryRange?.min,
                max_salary: req.body.applicableToSalaryRange?.max
            }
        });

        if (result[0]._ret === 'update_successful') {
            res.json({ error: false, message: 'Deduction rule updated successfully' });
        } else {
            res.status(400).json({ error: true, message: 'Failed to update deduction rule' });
        }
    } catch (err) {
        console.error('Error updating deduction rule:', err);
        res.status(500).json({ error: true, message: 'Internal server error while updating deduction rule' });
    }
});

// Helper functions for calculating standard deductions
function calculateSSSContribution(basicPay) {
    // Implement SSS contribution calculation logic
    return Math.min(basicPay * 0.045, 1125); // Example: 4.5% up to maximum of 1,125
}

function calculatePhilHealthContribution(basicPay) {
    // Implement PhilHealth contribution calculation logic
    return Math.min(basicPay * 0.035, 875); // Example: 3.5% up to maximum of 875
}

function calculatePagIbigContribution(basicPay) {
    // Implement Pag-IBIG contribution calculation logic
    return Math.min(basicPay * 0.02, 100); // Example: 2% up to maximum of 100
}

module.exports = router; 