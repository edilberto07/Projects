const express = require("express");
const payroll = express.Router();
const cors = require("cors");
const db = require("../database/config");
const security = require('../database/security');
const auth = require('../middleware/auth');

payroll.use(cors());
payroll.use(security.verifyAutheticity);

// Get all payroll batches with pagination and filtering
payroll.get('/batches', auth, async (req, res) => {
    try {
        const [data] = await db.sequelize.query('CALL sp_get_payroll_batches(:keyword, :page_no, :limit, :sort_column, :sort_type)', {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: {
                keyword: req.query.keyword || '',
                page_no: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                sort_column: req.query.sort_column || 'payment_date',
                sort_type: req.query.sort_type || 'DESC'
            }
        });
        res.json({ error: false, data });
    } catch (err) {
        console.error('Error fetching payroll batches:', err);
        res.status(500).json({ error: true, message: 'Internal server error while fetching payroll batches' });
    }
});

// Create new payroll batch
payroll.post('/batches', auth, async (req, res) => {
    try {
        const [result] = await db.sequelize.query('CALL sp_create_payroll_batch(:batch_name, :pay_period_start, :pay_period_end, :payment_date, :department, :created_by)', {
            replacements: {
                batch_name: req.body.batch_name,
                pay_period_start: req.body.pay_period_start,
                pay_period_end: req.body.pay_period_end,
                payment_date: req.body.payment_date,
                department: req.body.department,
                created_by: req.body.created_by
            }
        });

        if (result[0]._ret === 'create_successful') {
            res.status(201).json({ error: false, message: "Payroll batch created successfully", data: result[0] });
        } else {
            res.status(400).json({ error: true, message: "Failed to create payroll batch" });
        }
    } catch (err) {
        console.error('Error creating payroll batch:', err);
        res.status(500).json({ error: true, message: 'Internal server error while creating payroll batch' });
    }
});

// Get payroll records for a batch
payroll.get('/batches/:batch_id/records', auth, async (req, res) => {
    try {
        const result = await db.sequelize.query(
            'CALL sp_payroll_get_records(?)',
            {
                replacements: [req.params.batch_id],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({ 
                error: true, 
                message: 'No records found for this batch' 
            });
        }

        res.status(200).json({ 
            error: false, 
            data: result[0] 
        });
    } catch (err) {
        console.error('Error fetching payroll records:', err);
        res.status(500).json({ 
            error: true, 
            message: 'Internal server error while fetching payroll records' 
        });
    }
});

// Process payroll batch
payroll.post('/batches/:batch_id/process', auth, async (req, res) => {
    try {
        const [result] = await db.sequelize.query('CALL sp_process_payroll_batch(:batch_id, :created_by)', {
            replacements: {
                batch_id: req.params.batch_id,
                created_by: req.body.created_by
            }
        });

        if (result[0]._ret === 'process_successful') {
            res.json({ error: false, message: "Payroll batch processed successfully" });
        } else {
            res.status(400).json({ error: true, message: "Failed to process payroll batch" });
        }
    } catch (err) {
        console.error('Error processing payroll batch:', err);
        res.status(500).json({ error: true, message: 'Internal server error while processing payroll batch' });
    }
});

// Get payroll summary
payroll.get('/summary', auth, async (req, res) => {
    try {
        const { start_date, end_date, department } = req.query;
        
        const result = await db.sequelize.query(
            'CALL sp_payroll_get_summary(?, ?, ?)',
            {
                replacements: [start_date, end_date, department],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({ 
                error: true, 
                message: 'No summary data found for the specified period' 
            });
        }

        res.status(200).json({ 
            error: false, 
            data: result[0][0] 
        });
    } catch (err) {
        console.error('Error fetching payroll summary:', err);
        res.status(500).json({ 
            error: true, 
            message: 'Internal server error while fetching payroll summary' 
        });
    }
});

// Update individual payroll record
payroll.put('/records/:record_id', auth, async (req, res) => {
    try {
        const [result] = await db.sequelize.query('CALL sp_update_payroll_record(:record_id, :basic_pay, :allowances, :overtime, :deductions, :updated_by)', {
            replacements: {
                record_id: req.params.record_id,
                basic_pay: req.body.basic_pay,
                allowances: req.body.allowances,
                overtime: req.body.overtime,
                deductions: req.body.deductions,
                updated_by: req.body.updated_by
            }
        });

        if (result[0]._ret === 'update_successful') {
            res.json({ error: false, message: "Payroll record updated successfully" });
        } else {
            res.status(400).json({ error: true, message: "Failed to update payroll record" });
        }
    } catch (err) {
        console.error('Error updating payroll record:', err);
        res.status(500).json({ error: true, message: 'Internal server error while updating payroll record' });
    }
});

module.exports = payroll; 