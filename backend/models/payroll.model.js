module.exports = {
    getPayrollRecords: jest.fn().mockResolvedValue([{
        id: 1,
        employeeId: 1,
        basicPay: 50000,
        deductions: 5000,
        netPay: 45000,
        payPeriod: '2024-01'
    }]),
    getPayrollSummary: jest.fn().mockResolvedValue([{
        department: 'IT',
        totalEmployees: 10,
        totalPayroll: 500000,
        averagePay: 50000
    }])
};
