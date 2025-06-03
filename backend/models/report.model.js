module.exports = {
    generateReport: jest.fn().mockResolvedValue([{
        id: 1,
        type: 'monthly',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        department: 'IT',
        totalPayroll: 500000,
        totalEmployees: 10,
        averagePay: 50000
    }])
};
