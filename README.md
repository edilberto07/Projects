# Campus Admin Payroll Portal

A streamlined web application for campus administrators to manage employee payroll information, process payments, and generate reports.

## Database Setup

1. Install MySQL and SQLyog (or any MySQL client of your choice)
2. Run the database schema script located in `database/schema.sql`
3. Configure your database connection in the `.env` file

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=campus_payroll
DB_PORT=3306
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Features

- Dashboard with summary cards showing key metrics (total payroll, pending approvals, recent transactions)
- Employee data table with sorting, filtering, and inline editing capabilities
- Payroll processing form with validation and multi-step approval workflow
- Report generation tool with exportable formats (PDF, CSV, Excel)
- Clean, professional UI with university branding and responsive design for all devices

## Database Integration

This application connects to a MySQL database using the mysql2 library. The database schema includes tables for:

- Employees
- Payroll records
- Departments
- Employment types

All database queries are handled through service modules in the `src/services` directory.
