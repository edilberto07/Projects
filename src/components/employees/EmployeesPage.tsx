import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import EmployeeTable from "./EmployeeTable";

const EmployeesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Employee Management
            </h1>
            <p className="text-gray-500 mt-2">
              View and manage employee records, update information, and track
              employment status.
            </p>
          </div>
        </div>

        {/* Employee Table with Sidebar Layout */}
        <EmployeeTable />
      </div>
    </DashboardLayout>
  );
};

export default EmployeesPage;
