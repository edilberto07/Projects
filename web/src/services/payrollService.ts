import db from "../lib/db";

export interface PayrollRecord {
  id: string;
  payPeriod: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  basicPay: number;
  allowances: number;
  overtime: number;
  grossPay: number;
  taxWithheld: number;
  sssContribution: number;
  philHealthContribution: number;
  pagIbigContribution: number;
  otherDeductions: number;
  netPay: number;
  paymentDate: string;
  paymentMethod: string;
  taxFilingReference: string;
  notes: string;
}

export async function getAllPayrollRecords() {
  return await db.query(
    `SELECT p.*, e.firstName, e.lastName, 
    CONCAT(e.firstName, ' ', e.lastName) as employeeName, 
    e.department, e.position 
    FROM payroll_records p 
    JOIN employees e ON p.employeeId = e.id 
    ORDER BY p.paymentDate DESC`,
  );
}

export async function getPayrollRecordsByEmployeeId(employeeId: string) {
  return await db.query(
    `SELECT p.*, e.firstName, e.lastName, 
    CONCAT(e.firstName, ' ', e.lastName) as employeeName, 
    e.department, e.position 
    FROM payroll_records p 
    JOIN employees e ON p.employeeId = e.id 
    WHERE p.employeeId = ? 
    ORDER BY p.paymentDate DESC`,
    [employeeId],
  );
}

export async function createPayrollRecord(
  record: Omit<
    PayrollRecord,
    "id" | "employeeName" | "department" | "position"
  >,
) {
  const result = await db.query(
    `INSERT INTO payroll_records 
    (payPeriod, employeeId, basicPay, allowances, overtime, grossPay, 
    taxWithheld, sssContribution, philHealthContribution, pagIbigContribution, 
    otherDeductions, netPay, paymentDate, paymentMethod, taxFilingReference, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.payPeriod,
      record.employeeId,
      record.basicPay,
      record.allowances,
      record.overtime,
      record.grossPay,
      record.taxWithheld,
      record.sssContribution,
      record.philHealthContribution,
      record.pagIbigContribution,
      record.otherDeductions,
      record.netPay,
      record.paymentDate,
      record.paymentMethod,
      record.taxFilingReference,
      record.notes,
    ],
  );
  return result;
}

export async function getPayrollRecordById(id: string) {
  const records = await db.query(
    `SELECT p.*, e.firstName, e.lastName, 
    CONCAT(e.firstName, ' ', e.lastName) as employeeName, 
    e.department, e.position 
    FROM payroll_records p 
    JOIN employees e ON p.employeeId = e.id 
    WHERE p.id = ?`,
    [id],
  );
  return records[0];
}
