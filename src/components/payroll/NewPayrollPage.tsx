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
import EmployeeDetails from "./EmployeeDetails";
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

interface NewPayrollPageProps {
  showPayrollPreview?: boolean;
  onTogglePreview?: () => void;
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

const NewPayrollPage: React.FC<NewPayrollPageProps> = ({
  showPayrollPreview = false,
  onTogglePreview,
}) => {
  const [isPreviewMinimized, setIsPreviewMinimized] = useState(false);
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
    <div className="flex flex-col space-y-4 bg-transparent">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Employee Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-h-[calc(100vh-200px)]">
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
          <ScrollArea className="h-[calc(100vh-280px)]">
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
                      <p className="text-xs text-gray-500">
                        {employee.department}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div
          className={`${isPreviewMinimized ? "lg:col-span-9" : "lg:col-span-5"} space-y-4`}
        >
          {selectedEmployee ? (
            <>
              {/* Employee Details Card */}
              <EmployeeDetails
                employee={selectedEmployee}
                payPeriod={payPeriod}
                onFieldChange={handleFieldChange}
              />

              {/* Net Pay Calculator */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      NET PAY Calculator
                    </div>
                    {isPreviewMinimized && showPayrollPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setIsPreviewMinimized(false);
                          if (onTogglePreview) onTogglePreview();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-maximize-2"
                        >
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <NetPayCalculator
                    initialSalary={selectedEmployee.salary}
                    onCalculate={handleNetPayCalculated}
                  />
                </CardContent>
              </Card>

              {/* Employee Payroll History */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payroll History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {getEmployeePayrollHistory(selectedEmployee.id).length > 0 ? (
                    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pay Period
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gross Pay
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Deductions
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Net Pay
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                  className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                                >
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {record.payPeriod}
                                  </td>
                                  <td className="px-4 py-3 text-right whitespace-nowrap">
                                    <span className="inline-block min-w-[100px] text-right">
                                      ₱
                                      {record.grossPay.toLocaleString(
                                        undefined,
                                        {
                                          maximumFractionDigits: 2,
                                        },
                                      )}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right text-red-600 whitespace-nowrap">
                                    <span className="inline-block min-w-[100px] text-right">
                                      -₱
                                      {totalDeductions.toLocaleString(
                                        undefined,
                                        {
                                          maximumFractionDigits: 2,
                                        },
                                      )}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                                    <span className="inline-block min-w-[100px] text-right">
                                      ₱
                                      {record.netPay.toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center whitespace-nowrap">
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
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                      <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p>No payroll history found for this employee.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select an Employee</h3>
              <p className="text-gray-500 max-w-md">
                Please select an employee from the sidebar to process their
                payroll.
              </p>
            </div>
          )}
        </div>

        {/* Payroll Preview - Only shown when showPayrollPreview is true and not minimized */}
        {showPayrollPreview &&
          selectedEmployee &&
          currentPayroll &&
          !isPreviewMinimized && (
            <div className="lg:col-span-4">
              <Card className="h-full shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Payroll Preview
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setIsPreviewMinimized(true);
                        if (onTogglePreview) onTogglePreview();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-minimize-2"
                      >
                        <polyline points="4 14 10 14 10 20" />
                        <polyline points="20 10 14 10 14 4" />
                        <line x1="14" y1="10" x2="21" y2="3" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="bg-white p-4 rounded-md border border-gray-100">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Employee
                        </p>
                        <p className="font-medium mt-1">
                          {selectedEmployee.firstName}{" "}
                          {selectedEmployee.lastName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Pay Period
                        </p>
                        <p className="font-medium mt-1">
                          {currentPayroll?.payPeriod}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Basic Pay
                        </p>
                        <p className="font-medium mt-1 overflow-hidden text-ellipsis">
                          ₱
                          {currentPayroll?.basicPay.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          Gross Pay
                        </p>
                        <p className="font-medium mt-1 overflow-hidden text-ellipsis">
                          ₱
                          {currentPayroll?.grossPay.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-xs text-red-500 uppercase tracking-wider">
                          Tax Withheld
                        </p>
                        <p className="font-medium text-red-600 mt-1 overflow-hidden text-ellipsis">
                          -₱
                          {currentPayroll?.taxWithheld.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            },
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-xs text-red-500 uppercase tracking-wider">
                          SSS Contribution
                        </p>
                        <p className="font-medium text-red-600 mt-1 overflow-hidden text-ellipsis">
                          -₱
                          {currentPayroll?.sssContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-xs text-red-500 uppercase tracking-wider">
                          PhilHealth
                        </p>
                        <p className="font-medium text-red-600 mt-1 overflow-hidden text-ellipsis">
                          -₱
                          {currentPayroll?.philHealthContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-xs text-red-500 uppercase tracking-wider">
                          Pag-IBIG
                        </p>
                        <p className="font-medium text-red-600 mt-1 overflow-hidden text-ellipsis">
                          -₱
                          {currentPayroll?.pagIbigContribution.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-md col-span-1 sm:col-span-2">
                        <p className="text-xs text-red-500 uppercase tracking-wider">
                          Other Deductions
                        </p>
                        <p className="font-medium text-red-600 mt-1 overflow-hidden text-ellipsis">
                          -₱
                          {currentPayroll?.otherDeductions.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center bg-green-50 p-4 rounded-md mt-3">
                      <p className="text-lg font-bold text-green-800">
                        Net Pay:
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        ₱
                        {calculatedNetPay.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                        onClick={handleNextEmployee}
                        disabled={!selectedEmployee}
                      >
                        Save & Next <ChevronRight className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-3 flex-wrap">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                        >
                          <Printer className="h-4 w-4" />
                          Print Preview
                        </Button>
                        <Button
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
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
            </div>
          )}
      </div>
    </div>
  );
};

export default NewPayrollPage;
