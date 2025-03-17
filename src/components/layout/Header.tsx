import React from "react";
import { Bell, Search, Settings, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
  universityName?: string;
  userFullName?: string;
  userRole?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const Header = ({
  universityName = "State University",
  userFullName = "Jane Smith",
  userRole = "Campus Administrator",
  userAvatar = "",
  notificationCount = 3,
}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 h-20 px-6 flex items-center justify-between w-full">
      {/* University Branding */}
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">SU</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            {universityName}
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees, payroll batches..."
            className="pl-9 w-full bg-gray-50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                  variant="destructive"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Payroll batch awaiting approval</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">New employee record created</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    Monthly payroll report generated
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center text-blue-600">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-0"
            >
              <Avatar>
                <AvatarImage src={userAvatar} alt={userFullName} />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {userFullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start mr-2">
                <span className="text-sm font-medium">{userFullName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
