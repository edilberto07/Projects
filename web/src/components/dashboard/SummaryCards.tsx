import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

const SummaryCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: SummaryCardProps) => {
  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "flex items-center text-xs",
                trend.isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">{trend.label}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  totalPayroll?: {
    value: string;
    trend?: {
      value: number;
      isPositive: boolean;
      label: string;
    };
    description?: string;
  };
  pendingApprovals?: {
    value: string;
    trend?: {
      value: number;
      isPositive: boolean;
      label: string;
    };
    description?: string;
  };
  recentTransactions?: {
    value: string;
    trend?: {
      value: number;
      isPositive: boolean;
      label: string;
    };
    description?: string;
  };
  className?: string;
}

const SummaryCards = ({
  totalPayroll = {
    value: "₱1,284,500",
    trend: {
      value: 3.2,
      isPositive: true,
      label: "from last month",
    },
    description: "Total payroll for current period",
  },
  pendingApprovals = {
    value: "24",
    trend: {
      value: 12,
      isPositive: false,
      label: "more than yesterday",
    },
    description: "Payroll batches awaiting approval",
  },
  recentTransactions = {
    value: "156",
    trend: {
      value: 8.1,
      isPositive: true,
      label: "more than last week",
    },
    description: "Transactions in the last 7 days",
  },
  className,
}: SummaryCardsProps) => {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      <SummaryCard
        title="Total Payroll"
        value={totalPayroll.value}
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        trend={totalPayroll.trend}
        description={totalPayroll.description}
      />
      <SummaryCard
        title="Pending Approvals"
        value={pendingApprovals.value}
        icon={<Clock className="h-4 w-4 text-amber-500" />}
        trend={pendingApprovals.trend}
        description={pendingApprovals.description}
      />
      <SummaryCard
        title="Recent Transactions"
        value={recentTransactions.value}
        icon={<AlertCircle className="h-4 w-4 text-blue-500" />}
        trend={recentTransactions.trend}
        description={recentTransactions.description}
      />
    </div>
  );
};

export default SummaryCards;
