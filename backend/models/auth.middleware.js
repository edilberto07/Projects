const auth = (req, res, next) => {
    // Skip actual token verification in tests
    req.user = {
        id: 1,
        email: 'test@example.com'
    };
    next();
};

module.exports = { auth }; 