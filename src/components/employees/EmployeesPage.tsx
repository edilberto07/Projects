import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import EmployeeTable from "./EmployeeTable";

const EmployeesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-gray-500 mt-2">
            View and manage employee records, update information, and track
            employment status.
          </p>
        </div>

        {/* Employee Table */}
        <EmployeeTable />
      </div>
    </DashboardLayout>
  );
};

export default EmployeesPage;
