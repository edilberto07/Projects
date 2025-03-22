import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import NetPayCalculator from "../employees/NetPayCalculator";
import AdminAuthDialog from "../employees/AdminAuthDialog";
import ChangeReasonDialog from "./ChangeReasonDialog";
import {
  Search,
  User,
  DollarSign,
  Save,
  FileText,
  Printer,
  ChevronRight,
} from "lucide-react";

interface Employee {
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

interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriod: string;
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
  status: "draft" | "processed" | "paid";
}

interface ChangeRecord {
  id: string;
  employeeId: string;
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    phone: "(555) 123-4567",
    department: "Computer Science",
    position: "Associate Professor",
    employmentType: "Full-time",
    startDate: "2020-09-01",
    salary: 78000,
    bankAccount: "****4321",
    taxId: "***-**-1234",
    address: "123 University Ave, Campus City, ST 12345",
    emergencyContact: "Jane Doe, (555) 987-6543",
    notes: "Tenured faculty member with excellent teaching evaluations.",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@university.edu",
    phone: "(555) 234-5678",
    department: "Mathematics",
    position: "Professor",
    employmentType: "Full-time",
    startDate: "2018-01-15",
    salary: 95000,
    bankAccount: "****8765",
    taxId: "***-**-5678",
    address: "456 College Blvd, Campus City, ST 12345",
    emergencyContact: "John Smith, (555) 876-5432",
    notes: "Department chair with strong research background.",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@university.edu",
    phone: "(555) 345-6789",
    department: "Physics",
    position: "Assistant Professor",
    employmentType: "Full-time",
    startDate: "2021-08-15",
    salary: 78000,
    bankAccount: "****2345",
    taxId: "***-**-9012",
    address: "789 Science Dr, Campus City, ST 12345",
    emergencyContact: "Mary Johnson, (555) 765-4321",
    notes: "New faculty member with promising research agenda.",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@university.edu",
    phone: "(555) 456-7890",
    department: "Chemistry",
    position: "Lab Technician",
    employmentType: "Full-time",
    startDate: "2019-03-10",
    salary: 62000,
    bankAccount: "****3456",
    taxId: "***-**-3456",
    address: "101 Lab Lane, Campus City, ST 12345",
    emergencyContact: "David Williams, (555) 654-3210",
    notes: "Experienced lab technician with safety certification.",
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@university.edu",
    phone: "(555) 567-8901",
    department: "Biology",
    position: "Department Chair",
    employmentType: "Full-time",
    startDate: "2015-07-01",
    salary: 105000,
    bankAccount: "****4567",
    taxId: "***-**-7890",
    address: "202 Biology Bldg, Campus City, ST 12345",
    emergencyContact: "Sarah Brown, (555) 543-2109",
    notes: "Senior faculty member with administrative experience.",
  },
  {
    id: "6",
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@university.edu",
    phone: "(555) 678-9012",
    department: "Engineering",
    position: "Adjunct Professor",
    employmentType: "Part-time",
    startDate: "2022-01-10",
    salary: 45000,
    bankAccount: "****5678",
    taxId: "***-**-2345",
    address: "303 Engineering Ct, Campus City, ST 12345",
    emergencyContact: "James Davis, (555) 432-1098",
    notes: "Industry professional teaching specialized courses.",
  },
];

// Mock data for payroll records
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PR-2023-06-001",
    employeeId: "1",
    payPeriod: "June 1-15, 2023",
    basicPay: 35416.67,
    allowances: 5000,
    overtime: 0,
    grossPay: 40416.67,
    taxWithheld: 8083.33,
    sssContribution: 1375,
    philHealthContribution: 900,
    pagIbigContribution: 100,
    otherDeductions: 0,
    netPay: 29958.34,
    paymentDate: "June 20, 2023",
    status: "paid",
  },
  {
    id: "PR-2023-07-001",
    employeeId: "1",
    payPeriod: "July 1-15, 2023",
    basicPay: 35416.67,
    allowances: 5000,
    overtime: 0,
    grossPay: 40416.67,
    taxWithheld: 8083.33,
    sssContribution: 1375,
    philHealthContribution: 900,
    pagIbigContribution: 100,
    otherDeductions: 0,
    netPay: 29958.34,
    paymentDate: "July 20, 2023",
    status: "paid",
  },
  {
    id: "PR-2023-08-001",
    employeeId: "2",
    payPeriod: "August 1-15, 2023",
    basicPay: 39583.33,
    allowances: 6000,
    overtime: 0,
    grossPay: 45583.33,
    taxWithheld: 9116.67,
    sssContribution: 1375,
    philHealthContribution: 900,
    pagIbigContribution: 100,
    otherDeductions: 2000,
    netPay: 32091.66,
    paymentDate: "August 20, 2023",
    status: "paid",
  },
];

const NewPayrollPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [currentPayroll, setCurrentPayroll] = useState<PayrollRecord | null>(
    null,
  );
  const [payrollHistory, setPayrollHistory] =
    useState<PayrollRecord[]>(mockPayrollRecords);
  const [calculatedNetPay, setCalculatedNetPay] = useState<number>(0);
  const [payPeriod, setPayPeriod] = useState<string>(getCurrentPayPeriod());
  const [changeHistory, setChangeHistory] = useState<ChangeRecord[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [currentFieldToChange, setCurrentFieldToChange] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter employees based on search query
  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get current pay period (1st-15th or 16th-end of current month)
  function getCurrentPayPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("default", { month: "long" });
    const day = now.getDate();

    if (day <= 15) {
      return `${month} 1-15, ${year}`;
    } else {
      return `${month} 16-${new Date(year, now.getMonth() + 1, 0).getDate()}, ${year}`;
    }
  }

  // Handle employee selection
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);

    // Find the employee index for navigation
    const index = mockEmployees.findIndex((emp) => emp.id === employee.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }

    // Check if there's an existing draft payroll for this employee
    const existingDraft = payrollHistory.find(
      (record) =>
        record.employeeId === employee.id && record.status === "draft",
    );

    if (existingDraft) {
      setCurrentPayroll(existingDraft);
      setCalculatedNetPay(existingDraft.netPay);
    } else {
      // Create a new draft payroll record
      const monthlyBasicPay = employee.salary / 12;
      const newPayroll: PayrollRecord = {
        id: `PR-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${employee.id}`,
        employeeId: employee.id,
        payPeriod: payPeriod,
        basicPay: monthlyBasicPay,
        allowances: 0,
        overtime: 0,
        grossPay: monthlyBasicPay,
        taxWithheld: monthlyBasicPay * 0.2, // Assuming 20% tax rate
        sssContribution: 1375,
        philHealthContribution: 900,
        pagIbigContribution: 100,
        otherDeductions: 0,
        netPay: monthlyBasicPay - monthlyBasicPay * 0.2 - 1375 - 900 - 100,
        paymentDate: "",
        status: "draft",
      };
      setCurrentPayroll(newPayroll);
      setCalculatedNetPay(newPayroll.netPay);
    }
  };

  // Navigate to next employee
  const handleNextEmployee = () => {
    // First save the current payroll if it exists
    if (currentPayroll && selectedEmployee) {
      // Update the payroll with the latest calculated net pay
      const updatedPayroll = {
        ...currentPayroll,
        netPay: calculatedNetPay,
        status: "processed" as const,
      };

      // Update payroll history
      setPayrollHistory((prev) => {
        const index = prev.findIndex(
          (record) => record.id === updatedPayroll.id,
        );
        if (index >= 0) {
          // Update existing record
          const updated = [...prev];
          updated[index] = updatedPayroll;
          return updated;
        } else {
          // Add new record
          return [...prev, updatedPayroll];
        }
      });

      // Show a brief confirmation message
      const confirmationMessage = document.createElement("div");
      confirmationMessage.textContent = `Saved payroll for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
      confirmationMessage.className =
        "fixed top-4 right-4 bg-green-100 text-green-800 p-3 rounded-md shadow-md z-50";
      document.body.appendChild(confirmationMessage);

      // Remove the message after 2 seconds
      setTimeout(() => {
        document.body.removeChild(confirmationMessage);
      }, 2000);
    }

    // Then move to the next employee after a short delay
    setTimeout(() => {
      if (currentIndex < mockEmployees.length - 1) {
        handleSelectEmployee(mockEmployees[currentIndex + 1]);
      }
    }, 300);
  };

  // Handle field change with authentication
  const handleFieldChange = (fieldName: string) => {
    setCurrentFieldToChange(fieldName);
    setShowAuthDialog(true);
  };

  // Handle authentication success
  const handleAuthSuccess = (success: boolean) => {
    if (success) {
      setShowReasonDialog(true);
    }
    setShowAuthDialog(false);
  };

  // Handle change reason confirmation
  const handleChangeReason = (reason: string) => {
    if (!selectedEmployee) return;

    // Create a change record
    const changeRecord: ChangeRecord = {
      id: `CH-${Date.now()}`,
      employeeId: selectedEmployee.id,
      timestamp: new Date().toISOString(),
      field: currentFieldToChange,
      oldValue: "Previous Value", // This would be the actual old value in a real app
      newValue: "New Value", // This would be the actual new value in a real app
      reason: reason,
    };

    // Add to change history
    setChangeHistory((prev) => [...prev, changeRecord]);

    // In a real app, you would update the actual field value here
    alert(`Change to ${currentFieldToChange} recorded with reason: ${reason}`);
  };

  // Handle net pay calculation from the calculator
  const handleNetPayCalculated = (netPay: number) => {
    setCalculatedNetPay(netPay);
    if (currentPayroll) {
      setCurrentPayroll({
        ...currentPayroll,
        netPay: netPay,
      });
    }
  };

  // Save the current payroll
  const handleSavePayroll = () => {
    if (!currentPayroll || !selectedEmployee) return;

    // Update the payroll with the latest calculated net pay
    const updatedPayroll = {
      ...currentPayroll,
      netPay: calculatedNetPay,
      status: "processed" as const,
    };

    // Update payroll history
    setPayrollHistory((prev) => {
      const index = prev.findIndex((record) => record.id === updatedPayroll.id);
      if (index >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[index] = updatedPayroll;
        return updated;
      } else {
        // Add new record
        return [...prev, updatedPayroll];
      }
    });

    // Reset current payroll to show it's been saved
    setCurrentPayroll(updatedPayroll);

    alert(
      `Payroll for ${selectedEmployee.firstName} ${selectedEmployee.lastName} has been processed!`,
    );
  };

  // Get employee payroll history
  const getEmployeePayrollHistory = (employeeId: string) => {
    return payrollHistory.filter((record) => record.employeeId === employeeId);
  };

  return (
    <div className="flex flex-col space-y-6 bg-gray-50">
      {/* Authentication Dialog */}
      <AdminAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthenticate={handleAuthSuccess}
        section="employee information"
      />

      {/* Change Reason Dialog */}
      <ChangeReasonDialog
        open={showReasonDialog}
        onOpenChange={setShowReasonDialog}
        onConfirm={handleChangeReason}
        fieldName={currentFieldToChange}
      />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Employee Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg border border-gray-200 shadow-sm max-h-[calc(100vh-200px)]">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Employees</h2>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-2">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${selectedEmployee?.id === employee.id ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-full p-2">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {selectedEmployee ? (
            <>
              {/* Employee Details Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">
                        {selectedEmployee.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <p className="font-medium">
                        {selectedEmployee.employmentType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {selectedEmployee.startDate}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Basic Monthly Compensation
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-lg">
                          ₱
                          {(selectedEmployee.salary / 12).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() =>
                            handleFieldChange("Basic Monthly Compensation")
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Annual Salary</p>
                      <p className="font-medium">
                        ₱{selectedEmployee.salary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pay Period</p>
                      <p className="font-medium">{payPeriod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Net Pay Calculator */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    NET PAY Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NetPayCalculator
                    initialSalary={selectedEmployee.salary}
                    onCalculate={handleNetPayCalculated}
                  />
                </CardContent>
              </Card>

              {/* Payroll Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payroll Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Payroll Summary</h3>
                      <Badge
                        variant={
                          currentPayroll?.status === "draft"
                            ? "outline"
                            : "default"
                        }
                        className={
                          currentPayroll?.status === "draft"
                            ? "bg-yellow-50 text-yellow-700"
                            : ""
                        }
                      >
                        {currentPayroll?.status === "draft"
                          ? "Draft"
                          : currentPayroll?.status === "processed"
                            ? "Processed"
                            : "Paid"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Employee</p>
                        <p className="font-medium">
                          {selectedEmployee.firstName}{" "}
                          {selectedEmployee.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pay Period</p>
                        <p className="font-medium">
                          {currentPayroll?.payPeriod}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Basic Pay</p>
                        <p className="font-medium">
                          ₱
                          {currentPayroll?.basicPay.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gross Pay</p>
                        <p className="font-medium">
                          ₱
                          {currentPayroll?.grossPay.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tax Withheld</p>
                        <p className="font-medium text-red-600">
                          -₱
                          {currentPayroll?.taxWithheld.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          SSS Contribution
                        </p>
                        <p className="font-medium text-red-600">
                          -₱
                          {currentPayroll?.sssContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">PhilHealth</p>
                        <p className="font-medium text-red-600">
                          -₱
                          {currentPayroll?.philHealthContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pag-IBIG</p>
                        <p className="font-medium text-red-600">
                          -₱
                          {currentPayroll?.pagIbigContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Other Deductions
                        </p>
                        <p className="font-medium text-red-600">
                          -₱
                          {currentPayroll?.otherDeductions.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">Net Pay:</p>
                      <p className="text-xl font-bold text-primary">
                        ₱
                        {calculatedNetPay.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="mt-6 flex justify-between gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleNextEmployee}
                        disabled={!selectedEmployee}
                      >
                        Save & Next <ChevronRight className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Print Preview
                        </Button>
                        <Button
                          className="flex items-center gap-2"
                          onClick={handleSavePayroll}
                          disabled={
                            currentPayroll?.status === "processed" ||
                            currentPayroll?.status === "paid"
                          }
                        >
                          <Save className="h-4 w-4" />
                          {currentPayroll?.status === "draft"
                            ? "Process Payroll"
                            : "Processed"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employee Payroll History */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payroll History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getEmployeePayrollHistory(selectedEmployee.id).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-4 py-2 text-left">
                              Pay Period
                            </th>
                            <th className="border border-gray-200 px-4 py-2 text-right">
                              Gross Pay
                            </th>
                            <th className="border border-gray-200 px-4 py-2 text-right">
                              Deductions
                            </th>
                            <th className="border border-gray-200 px-4 py-2 text-right">
                              Net Pay
                            </th>
                            <th className="border border-gray-200 px-4 py-2 text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getEmployeePayrollHistory(selectedEmployee.id).map(
                            (record) => {
                              const totalDeductions =
                                record.taxWithheld +
                                record.sssContribution +
                                record.philHealthContribution +
                                record.pagIbigContribution +
                                record.otherDeductions;

                              return (
                                <tr
                                  key={record.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="border border-gray-200 px-4 py-2">
                                    {record.payPeriod}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2 text-right">
                                    ₱
                                    {record.grossPay.toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2 text-right text-red-600">
                                    -₱
                                    {totalDeductions.toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2 text-right font-bold">
                                    ₱
                                    {record.netPay.toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2 text-center">
                                    <Badge
                                      variant={
                                        record.status === "draft"
                                          ? "outline"
                                          : "default"
                                      }
                                      className={
                                        record.status === "draft"
                                          ? "bg-yellow-50 text-yellow-700"
                                          : record.status === "processed"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-green-50 text-green-700"
                                      }
                                    >
                                      {record.status === "draft"
                                        ? "Draft"
                                        : record.status === "processed"
                                          ? "Processed"
                                          : "Paid"}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No payroll history found for this employee.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select an Employee</h3>
              <p className="text-gray-500">
                Please select an employee from the sidebar to process their
                payroll.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPayrollPage;
