import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import PayrollBatchForm from "./PayrollBatchForm";
import PayrollHistory from "./PayrollHistory";
import PayrollRecords from "./PayrollRecords";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, History, PlusCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const PayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [showForm, setShowForm] = useState(false);

  const handleCreateBatch = () => {
    setActiveTab("create");
    setShowForm(true);
  };

  const handleBatchSubmit = (data: any) => {
    console.log("Batch submitted:", data);
    setShowForm(false);
    setActiveTab("history");
    // Here you would typically send the data to your backend
    // and then refresh the payroll history
  };

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
          <Button
            onClick={handleCreateBatch}
            className="flex items-center gap-2 self-start"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Batch
          </Button>
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Payroll History
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payroll Records
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Create Batch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <PayrollHistory
              onViewDetails={(batchId) =>
                console.log("View details for batch:", batchId)
              }
              onDownloadReport={(batchId) =>
                console.log("Download report for batch:", batchId)
              }
            />
          </TabsContent>

          <TabsContent value="records" className="mt-4">
            <PayrollRecords />
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            {showForm ? (
              <PayrollBatchForm onSubmit={handleBatchSubmit} />
            ) : (
              <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-medium mb-2">
                  Create a New Payroll Batch
                </h3>
                <p className="text-gray-500 mb-4">
                  Start the process of creating a new payroll batch for your
                  employees.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <PlusCircle className="h-4 w-4" />
                  Get Started
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
