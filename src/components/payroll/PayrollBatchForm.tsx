import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, DollarSign, Users, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface PayrollBatchFormProps {
  onSubmit?: (data: PayrollBatchData) => void;
}

interface PayrollBatchData {
  batchName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;
  department: string;
  employeeIds: string[];
  notes: string;
}

const PayrollBatchForm: React.FC<PayrollBatchFormProps> = ({
  onSubmit = () => {},
}) => {
  const [step, setStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const form = useForm<PayrollBatchData>({
    defaultValues: {
      batchName: "",
      payPeriodStart: "",
      payPeriodEnd: "",
      paymentDate: "",
      department: "",
      employeeIds: [],
      notes: "",
    },
  });

  const handleSubmit = (data: PayrollBatchData) => {
    data.employeeIds = selectedEmployees;
    onSubmit(data);
    // Reset form and step
    form.reset();
    setStep(1);
    setSelectedEmployees([]);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id],
    );
  };

  // Mock employees data
  const employees = [
    {
      id: "1",
      name: "John Doe",
      department: "Computer Science",
      position: "Associate Professor",
    },
    {
      id: "2",
      name: "Jane Smith",
      department: "Mathematics",
      position: "Professor",
    },
    {
      id: "3",
      name: "Robert Johnson",
      department: "Physics",
      position: "Assistant Professor",
    },
    {
      id: "4",
      name: "Emily Williams",
      department: "Chemistry",
      position: "Lab Technician",
    },
    {
      id: "5",
      name: "Michael Brown",
      department: "Biology",
      position: "Department Chair",
    },
    {
      id: "6",
      name: "Sarah Davis",
      department: "Engineering",
      position: "Adjunct Professor",
    },
  ];

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Create New Payroll Batch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    Step 1
                  </Badge>
                  <h3 className="text-lg font-medium">Basic Information</h3>
                </div>

                <FormField
                  control={form.control}
                  name="batchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., June 2023 Faculty Payroll"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="payPeriodStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Period Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payPeriodEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay Period End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next Step
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Select Employees */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    Step 2
                  </Badge>
                  <h3 className="text-lg font-medium">Select Employees</h3>
                </div>

                <div className="border rounded-md p-4">
                  <div className="mb-4">
                    <Label>
                      Select employees to include in this payroll batch:
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedEmployees.length} employees selected
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                      >
                        <Checkbox
                          id={`employee-${employee.id}`}
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => toggleEmployee(employee.id)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`employee-${employee.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {employee.name}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {employee.department} - {employee.position}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next Step
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    Step 3
                  </Badge>
                  <h3 className="text-lg font-medium">
                    Additional Information
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about this payroll batch"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any special instructions or information for
                        approvers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Batch Summary
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>
                      <span className="font-medium">Batch Name:</span>{" "}
                      {form.getValues("batchName") || "(Not specified)"}
                    </li>
                    <li>
                      <span className="font-medium">Pay Period:</span>{" "}
                      {form.getValues("payPeriodStart") ||
                        "(Start date not specified)"}{" "}
                      to{" "}
                      {form.getValues("payPeriodEnd") ||
                        "(End date not specified)"}
                    </li>
                    <li>
                      <span className="font-medium">Payment Date:</span>{" "}
                      {form.getValues("paymentDate") || "(Not specified)"}
                    </li>
                    <li>
                      <span className="font-medium">Department:</span>{" "}
                      {form.getValues("department") || "(Not specified)"}
                    </li>
                    <li>
                      <span className="font-medium">Employees:</span>{" "}
                      {selectedEmployees.length} selected
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous Step
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Submit for Approval
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PayrollBatchForm;
