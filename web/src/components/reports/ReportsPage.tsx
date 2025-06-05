import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import ReportGenerator from "./ReportGenerator";
import SavedReports from "./SavedReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, History, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("saved");

  const handleGenerateReport = (data: any) => {
    console.log("Report generated:", data);
    // Here you would typically send the data to your backend
    // and then refresh the saved reports list
  };

  const handleDownloadReport = (reportId: string) => {
    console.log("Downloading report:", reportId);
    // Here you would typically trigger a download of the report
  };

  const handleDeleteReport = (reportId: string) => {
    console.log("Deleting report:", reportId);
    // Here you would typically delete the report from your backend
    // and then refresh the saved reports list
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Report Generation
            </h1>
            <p className="text-gray-500 mt-2">
              Generate and export various reports for payroll, employees, and
              financial data.
            </p>
          </div>
          <Button
            onClick={() => setActiveTab("generate")}
            className="flex items-center gap-2 self-start"
          >
            <PlusCircle className="h-4 w-4" />
            New Report
          </Button>
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Saved Reports
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-4">
            <SavedReports
              onDownload={handleDownloadReport}
              onDelete={handleDeleteReport}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-4">
            <ReportGenerator onGenerateReport={handleGenerateReport} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
