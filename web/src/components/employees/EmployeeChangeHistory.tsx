import React from "react";
import { Clock, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChangeRecord {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
  reason: string;
}

interface EmployeeChangeHistoryProps {
  changes?: ChangeRecord[];
}

const EmployeeChangeHistory = ({
  changes = mockChangeHistory,
}: EmployeeChangeHistoryProps) => {
  return (
    <div className="space-y-4 mb-6 pt-4 border-t border-gray-200">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Change History
      </h3>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-8">
          {changes.map((change) => (
            <div
              key={change.id}
              className="relative pl-6 pb-6 border-l border-gray-200 last:border-0 last:pb-0"
            >
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{change.field}</span>
                  <span className="text-xs text-gray-500">
                    {change.timestamp}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Previous Value</p>
                    <p className="text-sm">{change.oldValue}</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <p className="text-xs text-gray-500">New Value</p>
                    <p className="text-sm">{change.newValue}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Reason for change</p>
                    <p className="text-sm">{change.reason}</p>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Changed by {change.changedBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const mockChangeHistory: ChangeRecord[] = [
  {
    id: "1",
    field: "Department",
    oldValue: "Computer Science",
    newValue: "Information Technology",
    changedBy: "Admin User",
    timestamp: "2023-06-15 14:32",
    reason: "Department restructuring as per university policy update",
  },
  {
    id: "2",
    field: "Position",
    oldValue: "Assistant Professor",
    newValue: "Associate Professor",
    changedBy: "HR Manager",
    timestamp: "2023-05-10 09:15",
    reason: "Promotion approved by faculty committee",
  },
  {
    id: "3",
    field: "Salary",
    oldValue: "₱75,000",
    newValue: "₱85,000",
    changedBy: "Finance Director",
    timestamp: "2023-05-10 10:22",
    reason: "Salary adjustment following promotion to Associate Professor",
  },
  {
    id: "4",
    field: "Email",
    oldValue: "john.doe@cs.university.edu",
    newValue: "john.doe@university.edu",
    changedBy: "System Admin",
    timestamp: "2023-04-01 16:45",
    reason: "Email standardization across departments",
  },
  {
    id: "5",
    field: "Status",
    oldValue: "On Leave",
    newValue: "Active",
    changedBy: "HR Assistant",
    timestamp: "2023-03-15 11:30",
    reason: "Return from sabbatical leave",
  },
];

export default EmployeeChangeHistory;
