import React, { useState } from "react";
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
  Loader2,
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
  isLoading?: boolean;
}

const NavItem = ({
  icon,
  label,
  path,
  isActive = false,
  isLoading = false,
}: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={path}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <span className="text-xl relative">
              {isLoading ? (
                <>
                  <span className="opacity-50">{icon}</span>
                  <Loader2 className="h-5 w-5 animate-spin absolute top-0 left-0" />
                </>
              ) : (
                icon
              )}
            </span>
            <span className="flex-1 text-sm">{label}</span>
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
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  // Simulate loading for demo purposes
  const handleNavClick = (path: string) => {
    if (path === currentPath) return;
    setLoadingSection(path);
    setTimeout(() => setLoadingSection(null), 2000);
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Employee Management",
      path: "/employees",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Payroll Processing",
      path: "/payroll",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Report Generation",
      path: "/reports",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div className="w-[260px] h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary">BISU - Bilar</h1>
        <p className="text-sm text-gray-500 mt-1">Payroll Portal</p>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <div key={item.path} onClick={() => handleNavClick(item.path)}>
              <NavItem
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={currentPath === item.path}
                isLoading={loadingSection === item.path}
              />
            </div>
          ))}
        </div>
      </nav>
      <div className="p-4 mt-auto border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden shadow-sm">
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
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-sm border border-gray-100"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
