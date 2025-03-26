import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import SummaryCards from "./dashboard/SummaryCards";
import EmployeeTable from "./employees/EmployeeTable";
import RecentActivity from "./dashboard/RecentActivity";

const Home: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Welcome to the Campus Admin Payroll Portal. View key metrics and
            manage employee data.
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Table (takes up 2/3 of the space on large screens) */}
          <div className="lg:col-span-2">
            <EmployeeTable />
          </div>

          {/* Recent Activity (takes up 1/3 of the space on large screens) */}
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
