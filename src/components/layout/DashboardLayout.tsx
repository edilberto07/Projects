import React from "react";
import Header from "./Header";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children = null,
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Campus Admin Payroll Portal. All
            rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
