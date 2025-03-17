import React, { useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface EmployeeTableFiltersProps {
  onSearch?: (query: string) => void;
  onDepartmentFilter?: (department: string) => void;
  onStatusFilter?: (status: string) => void;
  onRoleFilter?: (roles: string[]) => void;
  onClear?: () => void;
}

const EmployeeTableFilters = ({
  onSearch = () => {},
  onDepartmentFilter = () => {},
  onStatusFilter = () => {},
  onRoleFilter = () => {},
  onClear = () => {},
}: EmployeeTableFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Mock data for filters
  const departments = [
    { value: "all", label: "All Departments" },
    { value: "academic", label: "Academic Affairs" },
    { value: "admin", label: "Administration" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "Human Resources" },
    { value: "it", label: "IT Services" },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "onleave", label: "On Leave" },
    { value: "terminated", label: "Terminated" },
    { value: "retired", label: "Retired" },
  ];

  const roles = [
    { value: "faculty", label: "Faculty" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Administrator" },
    { value: "contractor", label: "Contractor" },
    { value: "parttime", label: "Part-time" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) => {
      const newRoles = prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role];

      onRoleFilter(newRoles);
      return newRoles;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRoles([]);
    onClear();
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Department Filter */}
        <Select onValueChange={onDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select onValueChange={onStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role Filter (Multi-select) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[150px] justify-between"
            >
              Roles
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {roles.map((role) => (
              <DropdownMenuCheckboxItem
                key={role.value}
                checked={selectedRoles.includes(role.value)}
                onCheckedChange={() => handleRoleToggle(role.value)}
              >
                {role.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setSelectedRoles([])}
              >
                Clear Selection
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleClearFilters}
          className="md:ml-2"
          title="Clear all filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedRoles.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchQuery && (
            <div className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center">
              <span className="mr-1">Search: {searchQuery}</span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedRoles.map((role) => {
            const roleLabel =
              roles.find((r) => r.value === role)?.label || role;
            return (
              <div
                key={role}
                className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center"
              >
                <span className="mr-1">Role: {roleLabel}</span>
                <button onClick={() => handleRoleToggle(role)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeTableFilters;
