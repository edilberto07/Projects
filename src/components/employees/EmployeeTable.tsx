import React, { useState } from "react";
import {
  UserPlus,
  User,
  Lock,
  Unlock,
  Briefcase,
  DollarSign,
  Pencil,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import EmployeeTableFilters from "./EmployeeTableFilters";
import EmployeeDetailDialog from "./EmployeeDetailDialog";
import AdminAuthDialog from "./AdminAuthDialog";
import ChangeReasonDialog from "./ChangeReasonDialog";
import EmployeeChangeHistory from "./EmployeeChangeHistory";
import "./EmployeeTable.css";

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
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees);
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

  // Update filtered employees when employees prop changes
  React.useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

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

    // Store the reason for later use when saving changes
    if (selectedEmployee) {
      // Store the field and reason for this change
      setChangeHistory((prev) => [
        ...prev,
        {
          field: fieldToEdit,
          reason: reason,
          oldValue: "", // Will be populated when saving
          newValue: "", // Will be populated when saving
        },
      ]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "on leave":
        return "status-on-leave";
      case "terminated":
        return "status-terminated";
      case "retired":
        return "status-retired";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="employee-container">
      {/* Employee Sidebar */}
      <div className="employee-sidebar">
        <div className="sidebar-header">
          <h2 className="text-lg font-semibold">Employees</h2>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <EmployeeTableFilters onSearch={handleSearch} />

        <div className="employee-list">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`employee-card ${selectedEmployee?.id === employee.id ? "selected" : ""}`}
                onClick={() => handleEditEmployee(employee)}
              >
                <div className="flex items-center gap-3">
                  <div className="employee-avatar">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="employee-info">
                    <h3 className="employee-name">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <div className="employee-position">
                      {employee.department} - {employee.position}
                    </div>
                    <div className="mt-1">
                      <Badge
                        className={cn(
                          "status-badge",
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No employees found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedEmployee ? (
          <div className="employee-details">
            <h2 className="details-header">
              <User className="h-5 w-5" />
              Employee Details
            </h2>

            {/* Personal Information Section */}
            <div className="space-y-4 mb-6">
              <h3 className="section-header">
                <User className="h-4 w-4" />
                Personal Information
              </h3>

              <div className="section-content">
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Full Name</p>
                  {editableFields.name ? (
                    <div className="flex gap-2">
                      <Input
                        className="font-medium"
                        defaultValue={selectedEmployee.firstName}
                        placeholder="First Name"
                      />
                      <Input
                        className="font-medium"
                        defaultValue={selectedEmployee.lastName}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p className="field-value">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Email</p>
                  {editableFields.email ? (
                    <Input
                      className="font-medium"
                      defaultValue={selectedEmployee.email}
                      placeholder="Email"
                    />
                  ) : (
                    <p className="field-value">{selectedEmployee.email}</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Phone</p>
                  {editableFields.phone ? (
                    <Input
                      className="font-medium"
                      defaultValue="(555) 123-4567"
                      placeholder="Phone"
                    />
                  ) : (
                    <p className="field-value">(555) 123-4567</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Address</p>
                  {editableFields.address ? (
                    <Input
                      className="font-medium"
                      defaultValue="123 University Ave, Campus City, ST 12345"
                      placeholder="Address"
                    />
                  ) : (
                    <p className="field-value">
                      123 University Ave, Campus City, ST 12345
                    </p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Emergency Contact</p>
                  {editableFields.emergencyContact ? (
                    <Input
                      className="font-medium"
                      defaultValue="Jane Doe, (555) 987-6543"
                      placeholder="Emergency Contact"
                    />
                  ) : (
                    <p className="field-value">Jane Doe, (555) 987-6543</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Basic Monthly Compensation</p>
                  {editableFields.salary ? (
                    <div className="flex items-center">
                      <span className="mr-1">₱</span>
                      <Input
                        className="font-medium"
                        defaultValue={(
                          selectedEmployee.salary / 12
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        placeholder="Monthly Salary"
                        type="number"
                      />
                    </div>
                  ) : (
                    <p className="field-value">
                      ₱
                      {(selectedEmployee.salary / 12).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="space-y-4 mb-6 section-divider">
              <h3 className="section-header">
                <Briefcase className="h-4 w-4" />
                Employment Information
              </h3>

              <div className="section-content">
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Department</p>
                  {editableFields.department ? (
                    <Input
                      className="font-medium"
                      defaultValue={selectedEmployee.department}
                      placeholder="Department"
                    />
                  ) : (
                    <p className="field-value">{selectedEmployee.department}</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Position</p>
                  {editableFields.position ? (
                    <Input
                      className="font-medium"
                      defaultValue={selectedEmployee.position}
                      placeholder="Position"
                    />
                  ) : (
                    <p className="field-value">{selectedEmployee.position}</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Employment Type</p>
                  {editableFields.employmentType ? (
                    <Input
                      className="font-medium"
                      defaultValue={selectedEmployee.employmentType}
                      placeholder="Employment Type"
                    />
                  ) : (
                    <p className="field-value">
                      {selectedEmployee.employmentType}
                    </p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Start Date</p>
                  {editableFields.startDate ? (
                    <Input
                      className="font-medium"
                      defaultValue={selectedEmployee.startDate}
                      placeholder="Start Date"
                      type="date"
                    />
                  ) : (
                    <p className="field-value">{selectedEmployee.startDate}</p>
                  )}
                </div>
                <div className="field-container">
                  <div className="lock-button">
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
                  <p className="field-label">Status</p>
                  {editableFields.status ? (
                    <Select defaultValue={selectedEmployee.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={cn(
                        "font-normal",
                        getStatusColor(selectedEmployee.status),
                      )}
                      variant="outline"
                    >
                      {selectedEmployee.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4 section-divider">
              <h3 className="section-header">
                <Pencil className="h-4 w-4" />
                Additional Information
              </h3>
              <div className="field-container">
                <p className="field-label">Notes</p>
                <p className="field-value">
                  Tenured faculty member with excellent teaching evaluations.
                </p>
              </div>
            </div>

            {/* Employee Change History */}
            <EmployeeChangeHistory changes={changeHistory} />

            {/* Save Changes Button - Only show if any field is editable */}
            {Object.values(editableFields).some((value) => value) && (
              <div className="save-button-container">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Save the changes
                    console.log("Saving employee changes");

                    // Actually update the employee data
                    if (selectedEmployee) {
                      const updatedEmployee = { ...selectedEmployee };

                      // Get all the input values
                      if (editableFields.name) {
                        const firstNameInput = document.querySelector(
                          'input[placeholder="First Name"]',
                        ) as HTMLInputElement;
                        const lastNameInput = document.querySelector(
                          'input[placeholder="Last Name"]',
                        ) as HTMLInputElement;
                        if (firstNameInput && lastNameInput) {
                          updatedEmployee.firstName = firstNameInput.value;
                          updatedEmployee.lastName = lastNameInput.value;
                        }
                      }

                      if (editableFields.email) {
                        const emailInput = document.querySelector(
                          'input[placeholder="Email"]',
                        ) as HTMLInputElement;
                        if (emailInput)
                          updatedEmployee.email = emailInput.value;
                      }

                      if (editableFields.department) {
                        const deptInput = document.querySelector(
                          'input[placeholder="Department"]',
                        ) as HTMLInputElement;
                        if (deptInput)
                          updatedEmployee.department = deptInput.value;
                      }

                      if (editableFields.position) {
                        const posInput = document.querySelector(
                          'input[placeholder="Position"]',
                        ) as HTMLInputElement;
                        if (posInput) updatedEmployee.position = posInput.value;
                      }

                      if (editableFields.employmentType) {
                        const typeInput = document.querySelector(
                          'input[placeholder="Employment Type"]',
                        ) as HTMLInputElement;
                        if (typeInput)
                          updatedEmployee.employmentType = typeInput.value;
                      }

                      if (editableFields.startDate) {
                        const dateInput = document.querySelector(
                          'input[type="date"]',
                        ) as HTMLInputElement;
                        if (dateInput)
                          updatedEmployee.startDate = dateInput.value;
                      }

                      if (editableFields.status) {
                        const statusSelect = document.querySelector(
                          "[data-value]",
                        ) as HTMLElement;
                        if (statusSelect) {
                          const status =
                            statusSelect.getAttribute("data-value");
                          if (status) updatedEmployee.status = status;
                        }
                      }

                      if (editableFields.salary) {
                        const salaryInput = document.querySelector(
                          'input[type="number"]',
                        ) as HTMLInputElement;
                        if (salaryInput) {
                          const monthlySalary = parseFloat(salaryInput.value);
                          updatedEmployee.salary = monthlySalary * 12;
                        }
                      }

                      // Update the employee in the list
                      const updatedEmployees = filteredEmployees.map((emp) =>
                        emp.id === updatedEmployee.id ? updatedEmployee : emp,
                      );

                      setFilteredEmployees(updatedEmployees);
                      setSelectedEmployee(updatedEmployee);

                      // Create change history records for all modified fields
                      const newChangeHistory = [...changeHistory];

                      // Update the oldValue and newValue for each change
                      Object.keys(editableFields).forEach((field) => {
                        if (editableFields[field]) {
                          // Find the change record for this field
                          const changeRecord = newChangeHistory.find(
                            (record) => record.field === field,
                          );

                          if (changeRecord) {
                            // Set the old and new values based on the field
                            switch (field) {
                              case "name":
                                changeRecord.oldValue = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
                                changeRecord.newValue = `${updatedEmployee.firstName} ${updatedEmployee.lastName}`;
                                break;
                              case "email":
                                changeRecord.oldValue = selectedEmployee.email;
                                changeRecord.newValue = updatedEmployee.email;
                                break;
                              case "department":
                                changeRecord.oldValue =
                                  selectedEmployee.department;
                                changeRecord.newValue =
                                  updatedEmployee.department;
                                break;
                              case "position":
                                changeRecord.oldValue =
                                  selectedEmployee.position;
                                changeRecord.newValue =
                                  updatedEmployee.position;
                                break;
                              case "employmentType":
                                changeRecord.oldValue =
                                  selectedEmployee.employmentType;
                                changeRecord.newValue =
                                  updatedEmployee.employmentType;
                                break;
                              case "startDate":
                                changeRecord.oldValue =
                                  selectedEmployee.startDate;
                                changeRecord.newValue =
                                  updatedEmployee.startDate;
                                break;
                              case "status":
                                changeRecord.oldValue = selectedEmployee.status;
                                changeRecord.newValue = updatedEmployee.status;
                                break;
                              case "salary":
                                changeRecord.oldValue = `₱${(selectedEmployee.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
                                changeRecord.newValue = `₱${(updatedEmployee.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
                                break;
                              // Add other fields as needed
                            }

                            // Add timestamp and other metadata
                            changeRecord.id = Date.now().toString();
                            changeRecord.timestamp =
                              new Date().toLocaleString();
                            changeRecord.changedBy = "Current User"; // In a real app, get from auth context
                          }
                        }
                      });

                      // Filter out any records that don't have both old and new values
                      const validChangeRecords = newChangeHistory.filter(
                        (record) =>
                          record.oldValue &&
                          record.newValue &&
                          record.oldValue !== record.newValue,
                      );

                      // In a real app, you would call an API to update the employee
                      console.log("Updated employee:", updatedEmployee);
                      console.log("Change history:", validChangeRecords);

                      // Update the change history
                      setChangeHistory(validChangeRecords);
                    }

                    // Reset all editable fields
                    setEditableFields({
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
                    });

                    // Show success message
                    alert("Changes saved successfully!");
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <User className="empty-state-icon" />
            <h3 className="empty-state-title">Select an Employee</h3>
            <p className="empty-state-description">
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
