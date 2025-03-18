import React, { useState } from "react";
import {
  UserPlus,
  User,
  Lock,
  Unlock,
  Briefcase,
  DollarSign,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import EmployeeTableFilters from "./EmployeeTableFilters";
import EmployeeDetailDialog from "./EmployeeDetailDialog";
import AdminAuthDialog from "./AdminAuthDialog";
import ChangeReasonDialog from "./ChangeReasonDialog";

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
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<string>("");
  const [fieldToEdit, setFieldToEdit] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {
      name: false,
      email: false,
      phone: false,
      address: false,
      emergencyContact: false,
      department: false,
      position: false,
      employmentType: false,
      startDate: false,
      status: false,
      salary: false,
    },
  );

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });

    setFilteredEmployees(filtered);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    onView(employee);
  };

  const handleFieldClick = (field: string, section: string) => {
    setFieldToEdit(field);
    setSectionToEdit(section);
    setAuthDialogOpen(true);
  };

  const handleAuthentication = (success: boolean) => {
    if (success) {
      setReasonDialogOpen(true);
    }
  };

  const handleReasonSubmit = (reason: string) => {
    console.log(`Change reason for ${fieldToEdit}: ${reason}`);
    // Update the editable state for the field
    setEditableFields((prev) => ({
      ...prev,
      [fieldToEdit]: true,
    }));
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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Employee Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Employees</h2>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <EmployeeTableFilters onSearch={handleSearch} />

        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedEmployee?.id === employee.id ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-gray-50"}`}
              onClick={() => handleEditEmployee(employee)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {employee.department} - {employee.position}
                  </div>
                  <div className="mt-1">
                    <Badge
                      className={cn(
                        "font-normal text-xs",
                        getStatusColor(employee.status),
                      )}
                      variant="outline"
                    >
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {selectedEmployee ? (
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Details
            </h2>

            {/* Personal Information Section */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("name", "Personal")}
                    >
                      {editableFields.name ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("email", "Personal")}
                    >
                      {editableFields.email ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("phone", "Personal")}
                    >
                      {editableFields.phone ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">(555) 123-4567</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("address", "Personal")}
                    >
                      {editableFields.address ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    123 University Ave, Campus City, ST 12345
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        handleFieldClick("emergencyContact", "Personal")
                      }
                    >
                      {editableFields.emergencyContact ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-medium">Jane Doe, (555) 987-6543</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("salary", "Personal")}
                    >
                      {editableFields.salary ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Basic Monthly Compensation
                  </p>
                  <p className="font-medium">
                    ₱
                    {(selectedEmployee.salary / 12).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        handleFieldClick("department", "Employment")
                      }
                    >
                      {editableFields.department ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("position", "Employment")}
                    >
                      {editableFields.position ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{selectedEmployee.position}</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        handleFieldClick("employmentType", "Employment")
                      }
                    >
                      {editableFields.employmentType ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">
                    {selectedEmployee.employmentType}
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        handleFieldClick("startDate", "Employment")
                      }
                    >
                      {editableFields.startDate ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{selectedEmployee.startDate}</p>
                </div>
                <div className="relative group">
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFieldClick("status", "Employment")}
                    >
                      {editableFields.status ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    className={cn(
                      "font-normal",
                      getStatusColor(selectedEmployee.status),
                    )}
                    variant="outline"
                  >
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Additional Information
              </h3>
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium">
                  Tenured faculty member with excellent teaching evaluations.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select an Employee</h3>
            <p className="text-gray-500">
              Please select an employee from the sidebar to view their details.
            </p>
          </div>
        )}
      </div>

      {/* Authentication Dialog */}
      <AdminAuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthenticate={handleAuthentication}
        section={sectionToEdit}
      />

      {/* Change Reason Dialog */}
      <ChangeReasonDialog
        open={reasonDialogOpen}
        onOpenChange={setReasonDialogOpen}
        onSubmit={handleReasonSubmit}
        fieldName={fieldToEdit}
      />

      {/* Detail Dialog (keeping this for compatibility) */}
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
