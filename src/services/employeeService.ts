import db from "../lib/db";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employmentType: string;
  startDate: string;
  salary: number;
  bankAccount: string;
  taxId: string;
  address: string;
  emergencyContact: string;
  notes: string;
}

export async function getAllEmployees() {
  return await db.query("SELECT * FROM employees");
}

export async function getEmployeeById(id: string) {
  const employees = await db.query("SELECT * FROM employees WHERE id = ?", [
    id,
  ]);
  return employees[0];
}

export async function createEmployee(employee: Omit<Employee, "id">) {
  const result = await db.query(
    `INSERT INTO employees 
    (firstName, lastName, email, phone, department, position, employmentType, 
    startDate, salary, bankAccount, taxId, address, emergencyContact, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.phone,
      employee.department,
      employee.position,
      employee.employmentType,
      employee.startDate,
      employee.salary,
      employee.bankAccount,
      employee.taxId,
      employee.address,
      employee.emergencyContact,
      employee.notes,
    ],
  );
  return result;
}

export async function updateEmployee(id: string, employee: Partial<Employee>) {
  // Build dynamic query based on provided fields
  const fields = Object.keys(employee);
  const values = Object.values(employee);

  if (fields.length === 0) return null;

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  const result = await db.query(
    `UPDATE employees SET ${setClause} WHERE id = ?`,
    [...values, id],
  );

  return result;
}

export async function deleteEmployee(id: string) {
  return await db.query("DELETE FROM employees WHERE id = ?", [id]);
}
