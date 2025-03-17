import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Pencil,
  Briefcase,
  DollarSign,
  Calendar,
  Save,
  Calculator,
  Lock,
  Unlock,
  ShieldAlert,
} from "lucide-react";
import NetPayCalculator from "./NetPayCalculator";
import AdminAuthDialog from "./AdminAuthDialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeDetailDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  employee?: Employee;
  onSave?: (employee: Employee) => void;
}

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

const defaultEmployee: Employee = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@university.edu",
  phone: "(555) 123-4567",
  department: "Computer Science",
  position: "Associate Professor",
  employmentType: "Full-time",
  startDate: "2020-09-01",
  salary: 85000,
  bankAccount: "****4321",
  taxId: "***-**-1234",
  address: "123 University Ave, Campus City, ST 12345",
  emergencyContact: "Jane Doe, (555) 987-6543",
  notes: "Tenured faculty member with excellent teaching evaluations.",
};

const EmployeeDetailDialog: React.FC<EmployeeDetailDialogProps> = ({
  open = true,
  onOpenChange,
  employee = defaultEmployee,
  onSave,
}) => {
  const [personalEditable, setPersonalEditable] = useState(false);
  const [employmentEditable, setEmploymentEditable] = useState(false);
  const [financialEditable, setFinancialEditable] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<string>("");
  const [personalChanged, setPersonalChanged] = useState(false);
  const [employmentChanged, setEmploymentChanged] = useState(false);
  const [financialChanged, setFinancialChanged] = useState(false);

  const form = useForm<Employee>({
    defaultValues: employee,
  });

  // Watch for changes in each section
  const watchPersonalFields = form.watch([
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "emergencyContact",
  ]);
  const watchEmploymentFields = form.watch([
    "department",
    "position",
    "employmentType",
    "startDate",
  ]);
  const watchFinancialFields = form.watch(["salary", "bankAccount", "taxId"]);

  // Update changed state when fields change
  React.useEffect(() => {
    if (personalEditable) setPersonalChanged(true);
  }, [watchPersonalFields, personalEditable]);

  React.useEffect(() => {
    if (employmentEditable) setEmploymentChanged(true);
  }, [watchEmploymentFields, employmentEditable]);

  React.useEffect(() => {
    if (financialEditable) setFinancialChanged(true);
  }, [watchFinancialFields, financialEditable]);

  const handleSave = (data: Employee) => {
    if (onSave) {
      onSave(data);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Reset editable and changed states when closing
    setPersonalEditable(false);
    setEmploymentEditable(false);
    setFinancialEditable(false);
    setPersonalChanged(false);
    setEmploymentChanged(false);
    setFinancialChanged(false);
  };

  const handleSectionSave = (section: string) => {
    // Save just the specific section
    console.log(`Saving ${section} section changes`);

    switch (section) {
      case "Personal":
        setPersonalChanged(false);
        setPersonalEditable(false);
        break;
      case "Employment":
        setEmploymentChanged(false);
        setEmploymentEditable(false);
        break;
      case "Financial":
        setFinancialChanged(false);
        setFinancialEditable(false);
        break;
    }
  };

  const handleSectionClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSectionToEdit(section);
    setAuthDialogOpen(true);
  };

  const handleAuthentication = (success: boolean) => {
    if (success) {
      switch (sectionToEdit) {
        case "Personal":
          setPersonalEditable(true);
          break;
        case "Employment":
          setEmploymentEditable(true);
          break;
        case "Financial":
          setFinancialEditable(true);
          break;
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Employee: {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h3>
                  <div className="flex items-center gap-2">
                    {personalEditable && personalChanged && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600"
                        onClick={() => handleSectionSave("Personal")}
                        type="button"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={(e) => handleSectionClick("Personal", e)}
                      type="button"
                    >
                      {personalEditable ? (
                        <Unlock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                      {personalEditable ? "Unlocked" : "Locked"}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!personalEditable}
                            className={!personalEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!personalEditable}
                            className={!personalEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            disabled={!personalEditable}
                            className={!personalEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!personalEditable}
                            className={!personalEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!personalEditable}
                          className={!personalEditable ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!personalEditable}
                          className={!personalEditable ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employment Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Employment Information
                  </h3>
                  <div className="flex items-center gap-2">
                    {employmentEditable && employmentChanged && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600"
                        onClick={() => handleSectionSave("Employment")}
                        type="button"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={(e) => handleSectionClick("Employment", e)}
                      type="button"
                    >
                      {employmentEditable ? (
                        <Unlock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                      {employmentEditable ? "Unlocked" : "Locked"}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!employmentEditable}
                          >
                            <SelectTrigger
                              className={
                                !employmentEditable ? "bg-gray-50" : ""
                              }
                            >
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Computer Science">
                                Computer Science
                              </SelectItem>
                              <SelectItem value="Mathematics">
                                Mathematics
                              </SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">
                                Chemistry
                              </SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Engineering">
                                Engineering
                              </SelectItem>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Arts">Arts</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!employmentEditable}
                            className={!employmentEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!employmentEditable}
                          >
                            <SelectTrigger
                              className={
                                !employmentEditable ? "bg-gray-50" : ""
                              }
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">
                                Full-time
                              </SelectItem>
                              <SelectItem value="Part-time">
                                Part-time
                              </SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Temporary">
                                Temporary
                              </SelectItem>
                              <SelectItem value="Adjunct">Adjunct</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={!employmentEditable}
                            className={!employmentEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Information
                  </h3>
                  <div className="flex items-center gap-2">
                    {financialEditable && financialChanged && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600"
                        onClick={() => handleSectionSave("Financial")}
                        type="button"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={(e) => handleSectionClick("Financial", e)}
                      type="button"
                    >
                      {financialEditable ? (
                        <Unlock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                      {financialEditable ? "Unlocked" : "Locked"}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Monthly Compensation (₱)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            disabled={!financialEditable}
                            className={!financialEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!financialEditable}
                            className={!financialEditable ? "bg-gray-50" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!financialEditable}
                          className={!financialEditable ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Net Pay Calculator Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Net Pay Calculator
                </h3>
                <NetPayCalculator
                  initialSalary={form.getValues("salary")}
                  onCalculate={(netPay) =>
                    console.log("Calculated net pay:", netPay)
                  }
                />
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Additional Information
                </h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[150px]"
                          placeholder="Enter any additional notes about the employee"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Admin Authentication Dialog */}
            <AdminAuthDialog
              open={authDialogOpen}
              onOpenChange={setAuthDialogOpen}
              onAuthenticate={handleAuthentication}
              section={sectionToEdit}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailDialog;
