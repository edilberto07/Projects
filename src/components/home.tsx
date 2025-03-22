import React from "react";
import DashboardLayout from "./layout/DashboardLayout";

const Home: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50 p-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Welcome to the Campus Admin Payroll Portal. Use the navigation menu
            to access different sections.
          </p>
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-dashboard"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Dashboard Coming Soon
              </h2>
              <p className="text-gray-500 text-center max-w-md">
                This dashboard has been simplified. Use the sidebar navigation
                to access employee records, payroll management, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
