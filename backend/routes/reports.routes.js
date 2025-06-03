const express = require('express');
const router = express.Router();
const db = require('../database/config');
const auth = require('../middleware/auth');
const { body, query, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');

// Validation middleware
const reportGenerationValidation = [
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('reportType').isIn(['monthly', 'quarterly', 'annual']),
    body('department').optional().isString()
];

// Generate report
router.post('/generate', auth, async (req, res) => {
    try {
        const { type, startDate, endDate, department } = req.body;

        if (!type || !startDate || !endDate) {
            return res.status(400).json({
                error: true,
                message: 'Report type, start date, and end date are required'
            });
        }

        const result = await db.sequelize.query(
            'CALL sp_reports_generate(?, ?, ?, ?)',
            {
                replacements: [type, startDate, endDate, department || null],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No report data found'
            });
        }

        res.status(200).json({
            error: false,
            data: result[0][0]
        });
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).json({
            error: true,
            message: 'Internal server error while generating report'
        });
    }
});

// Get all reports with filters
router.get('/', auth, async (req, res) => {
    try {
        const { start_date, end_date, department, report_type } = req.query;
        
        const [reports] = await db.sequelize.query('CALL sp_reports_get_all(:start_date, :end_date, :department, :report_type)', {
            replacements: {
                start_date,
                end_date,
                department,
                report_type
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!reports || reports.length === 0) {
            return res.status(404).json({ error: true, message: 'No reports found for the specified filters' });
        }

        res.json({ error: false, data: reports });
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ error: true, message: 'Internal server error while fetching reports' });
    }
});

// Get analytics
router.get('/analytics', auth, async (req, res) => {
    try {
        const { period } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return res.status(400).json({
                    error: true,
                    message: 'Invalid period specified'
                });
        }

        const [analytics] = await db.sequelize.query('CALL sp_reports_get_analytics(:start_date, :end_date)', {
            replacements: {
                start_date: startDate,
                end_date: now
            },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!analytics || analytics.length === 0) {
            return res.status(404).json({ error: true, message: 'No analytics data found for the specified period' });
        }

        res.json({ error: false, data: analytics });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: true, message: 'Internal server error while fetching analytics' });
    }
});

// Download report
router.get('/:id/download', auth, async (req, res) => {
    try {
        const [report] = await db.sequelize.query('CALL sp_reports_get_by_id(:id)', {
            replacements: { id: req.params.id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!report || report.length === 0) {
            return res.status(404).json({ error: true, message: 'Report not found' });
        }

        if (report[0].status !== 'completed') {
            return res.status(400).json({ error: true, message: 'Report is not ready for download' });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payroll-report-${req.params.id}.pdf`);

        doc.pipe(res);

        // Generate PDF content
        doc.fontSize(20).text('Payroll Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Report Type: ${report[0].reportType}`);
        doc.text(`Period: ${report[0].periodStart} - ${report[0].periodEnd}`);
        if (report[0].department) doc.text(`Department: ${report[0].department}`);
        doc.moveDown();
        doc.text(`Total Employees: ${report[0].totalEmployees}`);
        doc.text(`Total Basic Pay: ${report[0].totalBasicPay.toFixed(2)}`);
        doc.text(`Total Deductions: ${report[0].totalDeductions.toFixed(2)}`);
        doc.text(`Total Net Pay: ${report[0].totalNetPay.toFixed(2)}`);

        doc.end();
    } catch (err) {
        console.error('Error downloading report:', err);
        res.status(500).json({ error: true, message: 'Internal server error while downloading report' });
    }
});

module.exports = router; 