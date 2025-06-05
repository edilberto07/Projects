import React from "react";
import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { DollarSign, FileText } from "lucide-react";
import NewPayrollPage from "./NewPayrollPage";
import PayrollRecords from "./PayrollRecords";

const PayrollPage: React.FC = () => {
  const [previewToggled, setPreviewToggled] = useState(false);

  const handleTogglePreview = () => {
    setPreviewToggled(!previewToggled);
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
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Payroll Processing Section */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <h2 className="text-xl font-semibold p-5 pb-4 flex items-center gap-2 border-b border-gray-100">
                <DollarSign className="h-5 w-5 text-primary" />
                Payroll Processing
              </h2>
              <NewPayrollPage
                showPayrollPreview={true}
                onTogglePreview={handleTogglePreview}
              />
            </div>
          </div>

          {/* Recent Records Section */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <h2 className="text-xl font-semibold p-5 pb-4 flex items-center gap-2 border-b border-gray-100">
                <FileText className="h-5 w-5 text-primary" />
                Recent Records
              </h2>
              <div className="p-5 pt-4">
                <PayrollRecords compact={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
