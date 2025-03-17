import React, { useState } from "react";
import {
  Calendar,
  Download,
  FileText,
  Search,
  Filter,
  X,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import EmployeePayrollHistory from "./EmployeePayrollHistory";

interface PayrollRecord {
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

interface PayrollRecordsProps {
  initialRecords?: PayrollRecord[];
}

const PayrollRecords: React.FC<PayrollRecordsProps> = ({
  initialRecords = mockPayrollRecords,
}) => {
  const [records, setRecords] = useState<PayrollRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Filter records based on search and filters
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || record.department === departmentFilter;

    const matchesPeriod =
      periodFilter === "all" || record.payPeriod === periodFilter;

    return matchesSearch && matchesDepartment && matchesPeriod;
  });

  // Calculate totals for the footer
  const calculateTotals = () => {
    return filteredRecords.reduce(
      (totals, record) => {
        return {
          basicPay: totals.basicPay + record.basicPay,
          allowances: totals.allowances + record.allowances,
          overtime: totals.overtime + record.overtime,
          grossPay: totals.grossPay + record.grossPay,
          taxWithheld: totals.taxWithheld + record.taxWithheld,
          sssContribution: totals.sssContribution + record.sssContribution,
          philHealthContribution:
            totals.philHealthContribution + record.philHealthContribution,
          pagIbigContribution:
            totals.pagIbigContribution + record.pagIbigContribution,
          otherDeductions: totals.otherDeductions + record.otherDeductions,
          netPay: totals.netPay + record.netPay,
        };
      },
      {
        basicPay: 0,
        allowances: 0,
        overtime: 0,
        grossPay: 0,
        taxWithheld: 0,
        sssContribution: 0,
        philHealthContribution: 0,
        pagIbigContribution: 0,
        otherDeductions: 0,
        netPay: 0,
      },
    );
  };

  const totals = calculateTotals();

  // Get unique pay periods for filter
  const uniquePayPeriods = Array.from(
    new Set(records.map((record) => record.payPeriod)),
  );

  // Get unique departments for filter
  const uniqueDepartments = Array.from(
    new Set(records.map((record) => record.department)),
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("all");
    setPeriodFilter("all");
  };

  const handleExportRecords = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log("Exporting records:", filteredRecords);
    alert("Records exported successfully!");
  };

  const handleViewEmployeeHistory = (
    employeeId: string,
    employeeName: string,
  ) => {
    setSelectedEmployee({ id: employeeId, name: employeeName });
    setHistoryDialogOpen(true);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Payroll Records
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleExportRecords}
        >
          <Download className="h-4 w-4" />
          Export Records
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Pay Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {uniquePayPeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              className="md:ml-2"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Pay Period
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Employee</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Department
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Basic Pay
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Allowances
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Overtime
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Gross Pay
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Tax Withheld
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    SSS
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    PhilHealth
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Pag-IBIG
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Other Deductions
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right">
                    Net Pay
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Payment Date
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Tax Reference
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">
                        {record.payPeriod}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {record.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.employeeId}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEmployeeHistory(
                                record.employeeId,
                                record.employeeName,
                              );
                            }}
                          >
                            <History className="h-3 w-3" />
                            History
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{record.department}</div>
                          <div className="text-sm text-gray-500">
                            {record.position}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.basicPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.allowances.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.overtime.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₱
                        {record.grossPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.taxWithheld.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.sssContribution.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.philHealthContribution.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.pagIbigContribution.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.otherDeductions.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₱
                        {record.netPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.paymentDate}
                      </TableCell>
                      <TableCell>{record.taxFilingReference}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={15}
                      className="text-center py-6 text-gray-500"
                    >
                      No payroll records found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-gray-50">
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">
                    TOTALS
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.basicPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.allowances.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.overtime.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.grossPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.taxWithheld.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.sssContribution.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.philHealthContribution.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.pagIbigContribution.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.otherDeductions.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₱
                    {totals.netPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredRecords.length} of {records.length} records
          </div>

          {/* Employee Payroll History Dialog */}
          {selectedEmployee && (
            <EmployeePayrollHistory
              open={historyDialogOpen}
              onOpenChange={setHistoryDialogOpen}
              employeeId={selectedEmployee.id}
              employeeName={selectedEmployee.name}
              records={records}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for payroll records
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PR-2023-06-001",
    payPeriod: "June 1-15, 2023",
    employeeId: "EMP-001",
    employeeName: "John Doe",
    department: "Computer Science",
    position: "Associate Professor",
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
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-06-001",
    notes: "Regular payroll",
  },
  {
    id: "PR-2023-06-002",
    payPeriod: "June 1-15, 2023",
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    department: "Mathematics",
    position: "Professor",
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
    paymentDate: "June 20, 2023",
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-06-002",
    notes: "Regular payroll",
  },
  {
    id: "PR-2023-06-003",
    payPeriod: "June 16-30, 2023",
    employeeId: "EMP-001",
    employeeName: "John Doe",
    department: "Computer Science",
    position: "Associate Professor",
    basicPay: 35416.67,
    allowances: 5000,
    overtime: 2500,
    grossPay: 42916.67,
    taxWithheld: 8583.33,
    sssContribution: 1375,
    philHealthContribution: 900,
    pagIbigContribution: 100,
    otherDeductions: 0,
    netPay: 31958.34,
    paymentDate: "July 5, 2023",
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-07-001",
    notes: "Includes overtime for special project",
  },
  {
    id: "PR-2023-06-004",
    payPeriod: "June 16-30, 2023",
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    department: "Mathematics",
    position: "Professor",
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
    paymentDate: "July 5, 2023",
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-07-002",
    notes: "Regular payroll",
  },
  {
    id: "PR-2023-07-001",
    payPeriod: "July 1-15, 2023",
    employeeId: "EMP-001",
    employeeName: "John Doe",
    department: "Computer Science",
    position: "Associate Professor",
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
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-07-003",
    notes: "Regular payroll",
  },
  {
    id: "PR-2023-07-002",
    payPeriod: "July 1-15, 2023",
    employeeId: "EMP-003",
    employeeName: "Robert Johnson",
    department: "Physics",
    position: "Assistant Professor",
    basicPay: 32500,
    allowances: 4000,
    overtime: 1800,
    grossPay: 38300,
    taxWithheld: 7660,
    sssContribution: 1375,
    philHealthContribution: 900,
    pagIbigContribution: 100,
    otherDeductions: 1500,
    netPay: 26765,
    paymentDate: "July 20, 2023",
    paymentMethod: "Direct Deposit",
    taxFilingReference: "TF-2023-07-004",
    notes: "Includes overtime for lab setup",
  },
];

export default PayrollRecords;
