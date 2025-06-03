const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
// const session = require("express-session");
const path = require('path');
const db = require('./database/config');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};
const timezone = 'Asia/Manila';
process.env.TZ = timezone;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// More lenient rate limit for stats endpoint
const statsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per minute
    message: 'Too many requests for stats, please try again later.'
});

// Apply rate limiting to all routes
app.use(generalLimiter);

// Apply more lenient rate limiting to stats endpoint
app.use('/api/employees/stats', statsLimiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: process.env.PUBLICVAPIDKEY, resave: false, saveUninitialized: false }))

// Import routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const payrollRoutes = require('./routes/payroll.routes');
const deductionRoutes = require('./routes/deductions.routes');
const reportRoutes = require('./routes/reports.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const { router: auditRoutes, initializeWebSocket } = require('./routes/audit.routes');

// File Upload configuration
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(express.static('public'));

// Route assignments
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/deductions", deductionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", auditRoutes); // This includes both /audit-logs and /notifications endpoints

// Welcome route
app.get('/', function (req, res) {
    res.json({
        message: 'Welcome to the Payroll System API',
        version: '1.0.0',
        documentation: '/api/docs'
    });
});

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// comment this if production
// app.post('/samplepost', function (req, res) {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('This is a post!');
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: true,
        message: 'Something went wrong!'
    });
});

// Start server with WebSocket support
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});initializeWebSocket(server);
