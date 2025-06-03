import React, { useState, useEffect } from "react";
import {
  UserPlus,
  User,
  Lock,
  Unlock,
  Briefcase,
  DollarSign,
  Pencil,
  Save,
  RefreshCw,
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
import AddEmployeeDialog from "./AddEmployeeDialog";
import { useEmployees } from '../../hooks/useEmployees';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  employment_type: string;
  status: string;
  salary: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  phone?: string;
  bank_account?: string;
  tax_id?: string;
  address?: string;
  emergency_contact?: string;
  notes?: string;
}

const EmployeeTable: React.FC = () => {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<string>("");
  const [fieldToEdit, setFieldToEdit] = useState<string>("");
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('EmployeeTable: Fetching employees on mount.');
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log('Selected employee:', employee);
    setSelectedEmployee({
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        start_date: employee.start_date,
        salary: employee.salary,
        bank_account: employee.bank_account || '',
        tax_id: employee.tax_id || '',
        address: employee.address || '',
        emergency_contact: employee.emergency_contact || '',
        notes: employee.notes || '',
        status: employee.status || 'Active',
        is_active: employee.is_active,
        created_at: employee.created_at,
        updated_at: employee.updated_at
    });
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

  const handleAddEmployee = async (data: any) => {
    try {
      console.log('Adding employee with data:', data);
      const employeeData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        department: data.department,
        position: data.position,
        employment_type: data.employment_type,
        status: data.status || 'Active',
        salary: parseFloat(data.salary),
        start_date: data.start_date,
        is_active: true
      };
      console.log('Processed employee data:', employeeData);
      await addEmployee(employeeData);
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please check the console for details.');
    }
  };

  const handleUpdateEmployee = async (id: number, field: string, value: string, reason: string) => {
    try {
      await updateEmployee(id, field, value, reason);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return "bg-blue-100 text-blue-800";
    
    switch (status.toLowerCase()) {
      case "active":
        return "status-active";
      case "on leave":
        return "status-on-leave";
      case "inactive":
        return "status-terminated";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Filter employees directly in render
  const displayedEmployees = employees?.filter((employee) => {
    const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.toLowerCase();
    const department = (employee.department || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return fullName.includes(searchLower) || 
           department.includes(searchLower);
  }) || []; // Provide empty array if employees is null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      {/* Employee Sidebar */}
      <div className="employee-sidebar">
        <div className="sidebar-header">
          <h2 className="text-lg font-semibold">Employees</h2>
          <Button className="flex items-center gap-2" onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <EmployeeTableFilters onSearch={handleSearch} />

        <div className="employee-list">
          {displayedEmployees.length > 0 ? (
            displayedEmployees.map((employee) => (
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
                      {employee.first_name} {employee.last_name}
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
            <div className="text-center text-gray-500 py-4">
              No employees found
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
                  <p className="field-label">First Name</p>
                  <p className="field-value">{selectedEmployee.first_name}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Last Name</p>
                  <p className="field-value">{selectedEmployee.last_name}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Email</p>
                  <p className="field-value">{selectedEmployee.email}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Phone</p>
                  <p className="field-value">{selectedEmployee.phone || 'Not provided'}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Basic Monthly Compensation</p>
                  <p className="field-value">
                    ₱{(selectedEmployee.salary || 0).toLocaleString()}
                  </p>
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
                  <p className="field-label">Department</p>
                  <p className="field-value">{selectedEmployee.department}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Position</p>
                  <p className="field-value">{selectedEmployee.position}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Employment Type</p>
                  <p className="field-value">{selectedEmployee.employment_type}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Start Date</p>
                  <p className="field-value">{selectedEmployee.start_date}</p>
                </div>
                <div className="field-container">
                  <p className="field-label">Status</p>
                  <Badge
                    className={cn(
                      "font-normal",
                      getStatusColor(selectedEmployee.status || 'Active')
                    )}
                    variant="outline"
                  >
                    {selectedEmployee.status || 'Active'}
                  </Badge>
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
                <p className="field-label">Bank Account</p>
                <p className="field-value">{selectedEmployee.bank_account || 'Not provided'}</p>
              </div>
              <div className="field-container">
                <p className="field-label">Tax ID</p>
                <p className="field-value">{selectedEmployee.tax_id || 'Not provided'}</p>
              </div>
              <div className="field-container">
                <p className="field-label">Address</p>
                <p className="field-value">{selectedEmployee.address || 'Not provided'}</p>
              </div>
              <div className="field-container">
                <p className="field-label">Emergency Contact</p>
                <p className="field-value">{selectedEmployee.emergency_contact || 'Not provided'}</p>
              </div>
              <div className="field-container">
                <p className="field-label">Notes</p>
                <p className="field-value">{selectedEmployee.notes || 'No notes available'}</p>
              </div>
            </div>

            {/* Employee Change History */}
            <EmployeeChangeHistory changes={changeHistory} />
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

      {/* Add Employee Dialog */}
      {addDialogOpen && (
        <AddEmployeeDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSubmit={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
