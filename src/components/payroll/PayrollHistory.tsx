import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PayrollStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "completed";

interface PayrollBatch {
  id: string;
  batchName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;
  department: string;
  employeeCount: number;
  totalAmount: number;
  status: PayrollStatus;
  createdAt: string;
  createdBy: string;
}

interface PayrollHistoryProps {
  batches?: PayrollBatch[];
  onViewDetails?: (batchId: string) => void;
  onDownloadReport?: (batchId: string) => void;
}

const getStatusBadge = (status: PayrollStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          Pending Approval
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    case "processing":
      return (
        <Badge
          variant="outline"
          className="bg-purple-100 text-purple-800 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Unknown
        </Badge>
      );
  }
};

// Mock data for payroll batches
const mockPayrollBatches: PayrollBatch[] = [
  {
    id: "PB-2023-06-001",
    batchName: "June 2023 Faculty Payroll",
    payPeriodStart: "2023-06-01",
    payPeriodEnd: "2023-06-15",
    paymentDate: "2023-06-20",
    department: "All Departments",
    employeeCount: 45,
    totalAmount: 1250000,
    status: "completed",
    createdAt: "2023-06-16T09:30:00",
    createdBy: "Admin User",
  },
  {
    id: "PB-2023-06-002",
    batchName: "June 2023 Staff Payroll",
    payPeriodStart: "2023-06-01",
    payPeriodEnd: "2023-06-15",
    paymentDate: "2023-06-20",
    department: "All Departments",
    employeeCount: 32,
    totalAmount: 850000,
    status: "completed",
    createdAt: "2023-06-16T10:15:00",
    createdBy: "Admin User",
  },
  {
    id: "PB-2023-07-001",
    batchName: "July 2023 Faculty Payroll",
    payPeriodStart: "2023-07-01",
    payPeriodEnd: "2023-07-15",
    paymentDate: "2023-07-20",
    department: "All Departments",
    employeeCount: 47,
    totalAmount: 1275000,
    status: "approved",
    createdAt: "2023-07-16T08:45:00",
    createdBy: "Admin User",
  },
  {
    id: "PB-2023-07-002",
    batchName: "July 2023 Staff Payroll",
    payPeriodStart: "2023-07-01",
    payPeriodEnd: "2023-07-15",
    paymentDate: "2023-07-20",
    department: "All Departments",
    employeeCount: 33,
    totalAmount: 865000,
    status: "processing",
    createdAt: "2023-07-16T09:20:00",
    createdBy: "Admin User",
  },
  {
    id: "PB-2023-08-001",
    batchName: "August 2023 Faculty Payroll",
    payPeriodStart: "2023-08-01",
    payPeriodEnd: "2023-08-15",
    paymentDate: "2023-08-20",
    department: "All Departments",
    employeeCount: 46,
    totalAmount: 1260000,
    status: "pending",
    createdAt: "2023-08-16T10:00:00",
    createdBy: "Admin User",
  },
];

const PayrollHistory: React.FC<PayrollHistoryProps> = ({
  batches = mockPayrollBatches,
  onViewDetails = () => {},
  onDownloadReport = () => {},
}) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Payroll History</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Export All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batches.length > 0 ? (
            batches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{batch.batchName}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(batch.payPeriodStart)} -{" "}
                          {formatDate(batch.payPeriodEnd)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Payment Date:</span>{" "}
                        {formatDate(batch.paymentDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(batch.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{batch.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="font-medium">{batch.employeeCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      ₱{batch.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Created on {formatDate(batch.createdAt)} by{" "}
                    {batch.createdBy}
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onViewDetails(batch.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onDownloadReport(batch.id)}
                    >
                      <FileText className="h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payroll batches found. Create a new batch to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollHistory;
