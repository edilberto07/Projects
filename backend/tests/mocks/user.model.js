const bcrypt = require('bcryptjs');

// Mock User model
const User = function(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
};

// Instance methods
User.prototype.verifyPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
    const values = { ...this };
    delete values.password;
    return values;
};

// Static methods
User.findOne = jest.fn();
User.findAll = jest.fn();
User.create = jest.fn();
User.update = jest.fn();
User.destroy = jest.fn();
User.findByPk = jest.fn();

module.exports = User; 