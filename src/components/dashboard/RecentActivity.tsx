import React from "react";
import { cn } from "@/lib/utils";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityStatus = "pending" | "approved" | "rejected" | "completed";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: ActivityStatus;
  user: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const getStatusIcon = (status: ActivityStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusClass = (status: ActivityStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Payroll batch #4872 submitted",
    description: "Monthly payroll for Science department",
    timestamp: "2023-06-15T09:30:00",
    status: "pending",
    user: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  },
  {
    id: "2",
    title: "New employee record created",
    description: "Dr. Michael Chen added to Computer Science",
    timestamp: "2023-06-14T14:45:00",
    status: "completed",
    user: {
      name: "Amanda Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda",
    },
  },
  {
    id: "3",
    title: "Payroll batch #4865 approved",
    description: "Administrative staff bi-weekly payroll",
    timestamp: "2023-06-13T11:20:00",
    status: "approved",
    user: {
      name: "Robert Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
  },
  {
    id: "4",
    title: "Expense reimbursement rejected",
    description: "Missing receipts for travel expenses",
    timestamp: "2023-06-12T16:10:00",
    status: "rejected",
    user: {
      name: "Jennifer Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer",
    },
  },
  {
    id: "5",
    title: "Quarterly tax report generated",
    description: "Q2 2023 tax withholdings report",
    timestamp: "2023-06-10T08:15:00",
    status: "completed",
    user: {
      name: "David Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
  },
];

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = defaultActivities,
  title = "Recent Activity",
  maxItems = 5,
}) => {
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, maxItems).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                  {activity.user.avatar ? (
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                      {activity.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium">
                    {activity.user.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      getStatusClass(activity.status),
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(activity.status)}
                      <span className="capitalize">{activity.status}</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length > maxItems && (
          <div className="mt-4 text-center">
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View all activity
            </button>
          </div>
        )}

        {activities.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No recent activity to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
