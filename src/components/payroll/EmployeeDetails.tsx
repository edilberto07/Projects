import React, { useState } from "react";
import { User, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

interface EmployeeDetailsProps {
  employee: Employee;
  payPeriod: string;
  onFieldChange: (fieldName: string) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  payPeriod,
  onFieldChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {employee.firstName} {employee.lastName}
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="font-medium">{employee.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{employee.startDate}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Basic Monthly Compensation
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-lg">
                    ₱
                    {(employee.salary / 12).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onFieldChange("Basic Monthly Compensation")}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Annual Salary</p>
                <p className="font-medium">
                  ₱{employee.salary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pay Period</p>
                <p className="font-medium">{payPeriod}</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default EmployeeDetails;
