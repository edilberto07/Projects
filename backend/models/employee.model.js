module.exports = {
    findByPk: jest.fn().mockResolvedValue({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'IT',
        position: 'Developer'
    }),
    findAll: jest.fn().mockResolvedValue([])
};
