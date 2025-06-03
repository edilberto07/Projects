module.exports = {
    calculateDeductions: jest.fn().mockResolvedValue([{
        employeeId: 1,
        basicPay: 50000,
        tax: 5000,
        sss: 1000,
        philhealth: 500,
        pagibig: 100,
        netPay: 43400
    }]),
    getTaxBrackets: jest.fn().mockResolvedValue([{
        id: 1,
        minIncome: 0,
        maxIncome: 250000,
        rate: 0.2
    }])
};
