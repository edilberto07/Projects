const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const User = require('../models/user.model');
const db = require('../database/config');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-default-refresh-token-secret';

// Validation middleware
const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
];

const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty()
];

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });

        if (!email || !password) {
            return res.status(400).json({ 
                error: true, 
                message: 'Email and password are required' 
            });
        }

        const result = await db.sequelize.query(
            'CALL sp_auth_login(?, ?)',
            {
                replacements: [email, password],
                type: db.sequelize.QueryTypes.SELECT
            }
        );
        console.log('Login query result:', result);

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(401).json({ 
                error: true, 
                message: 'Invalid credentials' 
            });
        }

        const user = result[0][0];
        console.log('Found user:', user);

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.status(401).json({ 
                error: true, 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Generated token:', token);

        res.status(200).json({
            error: false,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            error: true, 
            message: 'Internal server error during login' 
        });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        console.log('Register attempt:', { email, firstName, lastName });

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ 
                error: true, 
                message: 'All fields are required' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // First check if user exists
        const existingUser = await db.sequelize.query(
            'SELECT 1 FROM payroll_users WHERE email = ?',
            {
                replacements: [email],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Email already exists'
            });
        }

        // Proceed with registration
        const result = await db.sequelize.query(
            'CALL sp_auth_register(?, ?, ?, ?)',
            {
                replacements: [email, hashedPassword, firstName, lastName],
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!result || !result[0] || result[0].length === 0) {
            return res.status(400).json({ 
                error: true, 
                message: 'Registration failed' 
            });
        }

        const user = result[0][0];
        console.log('Registered user:', user);

        // Generate token for immediate login
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            error: false,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        
        // Check for specific error types
        if (err.name === 'SequelizeConnectionError') {
            return res.status(503).json({
                error: true,
                message: 'Database connection error. Please try again.'
            });
        }
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: true,
                message: 'Email already exists'
            });
        }

        res.status(500).json({ 
            error: true, 
            message: 'Internal server error during registration',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Verify token
router.get('/verify', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        res.status(200).json({
            error: false,
            data: user.toJSON()
        });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(500).json({
            error: true,
            message: 'Internal server error during token verification'
        });
    }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                error: true,
                message: 'Refresh token required'
            });
        }

        const user = await User.findOne({ where: { refreshToken } });
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Invalid refresh token'
            });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const newToken = jwt.sign(
            { userId: decoded.userId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            error: false,
            data: { token: newToken }
        });
    } catch (err) {
        console.error('Token refresh error:', err);
        res.status(401).json({
            error: true,
            message: 'Invalid refresh token'
        });
    }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                error: true,
                message: 'Invalid password'
            });
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            error: false,
            message: 'Password updated successfully'
        });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({
            error: true,
            message: 'Internal server error during password change'
        });
    }
});

// Check authentication status
router.get('/check', authMiddleware, async (req, res) => {
    try {
        console.log('Auth check - User ID:', req.userId);
        
        const [user] = await db.query(
            'SELECT id, email, first_name, last_name, role FROM users WHERE id = ?',
            [req.userId]
        );

        if (!user) {
            console.log('Auth check - User not found');
            return res.status(401).json({
                error: true,
                message: 'User not found',
                authenticated: false
            });
        }

        console.log('Auth check - User found:', user);
        res.json({
            error: false,
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({
            error: true,
            message: 'Error checking authentication status',
            authenticated: false
        });
    }
});

module.exports = router; 