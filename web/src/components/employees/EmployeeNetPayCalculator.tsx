import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NetPayCalculator from "./NetPayCalculator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EmployeeNetPayCalculatorProps {
  employeeName?: string;
  employeeSalary?: number;
}

const EmployeeNetPayCalculator: React.FC<EmployeeNetPayCalculatorProps> = ({
  employeeName = "Selected Employee",
  employeeSalary = 85000,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calculate Net Pay
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Net Pay Calculator: {employeeName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <NetPayCalculator initialSalary={employeeSalary} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeNetPayCalculator;
