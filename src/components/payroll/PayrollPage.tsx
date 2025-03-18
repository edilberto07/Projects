import React from "react";
import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, FileText } from "lucide-react";
import NewPayrollPage from "./NewPayrollPage";
import PayrollRecords from "./PayrollRecords";

const PayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payroll Processing
            </h1>
            <p className="text-gray-500 mt-2">
              Create and manage payroll batches, process payments, and track
              payment history.
            </p>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payroll Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4">
            <NewPayrollPage />
          </TabsContent>
          <TabsContent value="records" className="mt-4">
            <PayrollRecords />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
