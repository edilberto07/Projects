import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Bell, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">
              {mobileMenuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/employees"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Employees
            </Link>
            <Link
              to="/payroll"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Payroll
            </Link>
            <Link
              to="/reports"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Reports
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <nav className="flex flex-col space-y-1 px-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/employees"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Employees
            </Link>
            <Link
              to="/payroll"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Payroll
            </Link>
            <Link
              to="/reports"
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reports
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
