import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, path, isActive = false }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <span className="text-xl">{icon}</span>
            <span className="flex-1">{label}</span>
            {isActive && <ChevronRight className="h-4 w-4" />}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard" },
    { icon: <Users />, label: "Employee Management", path: "/employees" },
    { icon: <DollarSign />, label: "Payroll Processing", path: "/payroll" },
    { icon: <FileText />, label: "Report Generation", path: "/reports" },
    { icon: <Settings />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-[280px] h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Campus Admin</h1>
        <p className="text-sm text-gray-500">Payroll Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={currentPath === item.path}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-sm">Admin User</p>
            <p className="text-xs text-gray-500">admin@university.edu</p>
          </div>
        </div>

        <button
          onClick={() => useAuth().logout()}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
