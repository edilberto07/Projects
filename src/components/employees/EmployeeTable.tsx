import React, { useState } from "react";
import { UserPlus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import EmployeeTableFilters from "./EmployeeTableFilters";
import EmployeeDetailDialog from "./EmployeeDetailDialog";
import EmployeeNetPayCalculator from "./EmployeeNetPayCalculator";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  employmentType: string;
  status: string;
  salary: number;
  startDate: string;
}

interface EmployeeTableProps {
  employees?: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
  onView?: (employee: Employee) => void;
}

const EmployeeTable = ({
  employees = mockEmployees,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
}: EmployeeTableProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailDialogOpen(true);
    onEdit(employee);
    onView(employee); // Also trigger view since we're combining actions
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeTableFilters />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Basic Monthly Compensation
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleEditEmployee(employee)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.employmentType}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "font-normal",
                      getStatusColor(employee.status),
                    )}
                    variant="outline"
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ₱
                  {(employee.salary / 12).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmployee(employee);
                    }}
                  >
                    <Calculator className="h-3 w-3" />
                    Net Pay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {employees.length} of {employees.length} employees
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          employee={{
            ...selectedEmployee,
            phone: "(555) 123-4567",
            bankAccount: "****4321",
            taxId: "***-**-1234",
            address: "123 University Ave, Campus City, ST 12345",
            emergencyContact: "Jane Doe, (555) 987-6543",
            notes:
              "Tenured faculty member with excellent teaching evaluations.",
          }}
          onSave={(updatedEmployee) => {
            console.log("Employee updated:", updatedEmployee);
            setDetailDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Mock data for the employee table
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    department: "Computer Science",
    position: "Associate Professor",
    employmentType: "Full-time",
    status: "Active",
    salary: 85000,
    startDate: "2020-09-01",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@university.edu",
    department: "Mathematics",
    position: "Professor",
    employmentType: "Full-time",
    status: "Active",
    salary: 95000,
    startDate: "2015-08-15",
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@university.edu",
    department: "Physics",
    position: "Assistant Professor",
    employmentType: "Full-time",
    status: "On Leave",
    salary: 78000,
    startDate: "2019-01-10",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@university.edu",
    department: "Chemistry",
    position: "Lab Technician",
    employmentType: "Part-time",
    status: "Active",
    salary: 45000,
    startDate: "2021-03-22",
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@university.edu",
    department: "Biology",
    position: "Department Chair",
    employmentType: "Full-time",
    status: "Active",
    salary: 110000,
    startDate: "2010-07-01",
  },
  {
    id: "6",
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@university.edu",
    department: "Engineering",
    position: "Adjunct Professor",
    employmentType: "Contract",
    status: "Active",
    salary: 65000,
    startDate: "2022-01-15",
  },
  {
    id: "7",
    firstName: "David",
    lastName: "Miller",
    email: "david.miller@university.edu",
    department: "Business",
    position: "Professor",
    employmentType: "Full-time",
    status: "Retired",
    salary: 0,
    startDate: "2000-08-30",
  },
];

export default EmployeeTable;
