import React, { useState } from "react";
import {
  Calendar,
  Download,
  FileText,
  Search,
  Filter,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface EmployeePayrollHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
  records: PayrollRecord[];
}

const EmployeePayrollHistory: React.FC<EmployeePayrollHistoryProps> = ({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  records,
}) => {
  const [periodFilter, setPeriodFilter] = useState("all");

  // Filter records for this specific employee
  const employeeRecords = records.filter(
    (record) => record.employeeId === employeeId,
  );

  // Further filter by period if needed
  const filteredRecords =
    periodFilter === "all"
      ? employeeRecords
      : employeeRecords.filter((record) =>
          record.payPeriod.includes(periodFilter),
        );

  // Sort records by payment date (most recent first)
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return (
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  });

  // Get unique years for filtering
  const uniqueYears = Array.from(
    new Set(
      employeeRecords
        .map((record) => {
          const match = record.payPeriod.match(/(\d{4})/);
          return match ? match[1] : "";
        })
        .filter((year) => year),
    ),
  );

  // Calculate totals
  const calculateTotals = () => {
    return sortedRecords.reduce(
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

  // Function to highlight changes between records
  const getChangeHighlight = (currentValue: number, index: number) => {
    if (index === sortedRecords.length - 1) return "";

    const nextRecord = sortedRecords[index + 1];
    const fieldName = Object.keys(currentValue)[0];
    const currentFieldValue = Object.values(currentValue)[0] as number;
    const nextFieldValue = nextRecord[
      fieldName as keyof PayrollRecord
    ] as number;

    if (currentFieldValue > nextFieldValue) {
      return "text-green-600";
    } else if (currentFieldValue < nextFieldValue) {
      return "text-red-600";
    }
    return "";
  };

  // Function to calculate percentage change
  const getPercentageChange = (currentValue: number, index: number) => {
    if (index === sortedRecords.length - 1) return null;

    const nextRecord = sortedRecords[index + 1];
    const fieldName = Object.keys(currentValue)[0];
    const currentFieldValue = Object.values(currentValue)[0] as number;
    const nextFieldValue = nextRecord[
      fieldName as keyof PayrollRecord
    ] as number;

    if (nextFieldValue === 0) return null;

    const percentChange =
      ((currentFieldValue - nextFieldValue) / nextFieldValue) * 100;

    if (percentChange === 0) return null;

    return (
      <span className={percentChange > 0 ? "text-green-600" : "text-red-600"}>
        {percentChange > 0 ? "+" : ""}
        {percentChange.toFixed(1)}%
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payroll History for {employeeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info Card */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium">{employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">
                  {sortedRecords[0]?.department || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Position</p>
                <p className="font-medium">
                  {sortedRecords[0]?.position || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Records</p>
                <p className="font-medium">{employeeRecords.length}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">Filter by year:</div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={periodFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setPeriodFilter("all")}
              >
                All Years
              </Badge>
              {uniqueYears.map((year) => (
                <Badge
                  key={year}
                  variant={periodFilter === year ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPeriodFilter(year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Pay Period
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Position</TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecords.length > 0 ? (
                  sortedRecords.map((record, index) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">
                        {record.payPeriod}
                      </TableCell>
                      <TableCell>
                        {record.position}
                        {index > 0 &&
                          sortedRecords[index - 1].position !==
                            record.position && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-blue-50 text-blue-700"
                            >
                              Changed
                            </Badge>
                          )}
                      </TableCell>
                      <TableCell
                        className={`text-right ${getChangeHighlight({ basicPay: record.basicPay }, index)}`}
                      >
                        ₱
                        {record.basicPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { basicPay: record.basicPay },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right ${getChangeHighlight({ allowances: record.allowances }, index)}`}
                      >
                        ₱
                        {record.allowances.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { allowances: record.allowances },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.overtime.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getChangeHighlight({ grossPay: record.grossPay }, index)}`}
                      >
                        ₱
                        {record.grossPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { grossPay: record.grossPay },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.taxWithheld.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell
                        className={`text-right ${getChangeHighlight({ sssContribution: record.sssContribution }, index)}`}
                      >
                        ₱
                        {record.sssContribution.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { sssContribution: record.sssContribution },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right ${getChangeHighlight({ philHealthContribution: record.philHealthContribution }, index)}`}
                      >
                        ₱
                        {record.philHealthContribution.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                        <div className="text-xs">
                          {getPercentageChange(
                            {
                              philHealthContribution:
                                record.philHealthContribution,
                            },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right ${getChangeHighlight({ pagIbigContribution: record.pagIbigContribution }, index)}`}
                      >
                        ₱
                        {record.pagIbigContribution.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { pagIbigContribution: record.pagIbigContribution },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₱
                        {record.otherDeductions.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${getChangeHighlight({ netPay: record.netPay }, index)}`}
                      >
                        ₱
                        {record.netPay.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <div className="text-xs">
                          {getPercentageChange(
                            { netPay: record.netPay },
                            index,
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {record.paymentDate}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="text-center py-6 text-gray-500"
                    >
                      No payroll records found for this employee.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-gray-50">
                <TableRow>
                  <TableCell colSpan={2} className="font-bold">
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
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {sortedRecords.length} of {employeeRecords.length} records
            </div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Records
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeePayrollHistory;
