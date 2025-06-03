# Payroll Management System

A full-stack payroll management system built with React, Node.js, and MySQL.

## Features

- 🔐 Secure authentication with JWT and refresh tokens
- 👥 Employee management with change history tracking
- 💰 Payroll batch processing and record management
- 📊 Comprehensive reporting and summaries
- 🔍 Audit logging for all operations
- 📱 Responsive modern UI

## Tech Stack

### Frontend
- React with TypeScript
- Custom hooks for API integration
- React Router for navigation
- Modern UI with responsive design

### Backend
- Node.js with Express
- MySQL database
- JWT authentication
- Rate limiting and security middleware

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd payroll-system
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd Server-Example/Server
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=payroll_db
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Initialize the database:
```bash
# Run the database migrations
npm run migrate
```

5. Start the development servers:
```bash
# Start backend server
cd Server-Example/Server
npm run dev

# Start frontend development server (in a new terminal)
cd ../..
npm run dev
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password
- Request body: `{ email: string, password: string }`
- Response: `{ error: boolean, token: string, refreshToken: string, user: User }`

#### POST /api/auth/register
Register a new user
- Request body: `{ email: string, password: string, firstName: string, lastName: string, role?: string }`
- Response: `{ error: boolean, message: string }`

### Employee Endpoints

#### GET /api/employees
Get all employees with optional filters
- Query params: `search`, `department`, `employmentType`
- Response: `{ error: boolean, data: Employee[] }`

#### POST /api/employees
Create a new employee
- Request body: `Employee` (without id)
- Response: `{ error: boolean, data: Employee }`

### Payroll Endpoints

#### GET /api/payroll/batches
Get all payroll batches with optional filters
- Query params: `keyword`, `page`, `limit`, `sortColumn`, `sortType`
- Response: `{ error: boolean, data: PayrollBatch[] }`

#### POST /api/payroll/batches
Create a new payroll batch
- Request body: `PayrollBatch` (without id)
- Response: `{ error: boolean, data: PayrollBatch }`

## Testing

Run the test suites:
```bash
# Run frontend tests
npm test

# Run backend tests
cd Server-Example/Server
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
