import React, { useState } from "react";
import { FileText, Download, Trash2, Calendar, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReportDetailView from "./ReportDetailView";

interface SavedReport {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  createdBy: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  format: "pdf" | "excel" | "csv";
  size: string;
  downloadCount: number;
}

interface SavedReportsProps {
  reports?: SavedReport[];
  onDownload?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
}

const getFormatBadge = (format: string) => {
  switch (format) {
    case "pdf":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          PDF
        </Badge>
      );
    case "excel":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Excel
        </Badge>
      );
    case "csv":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          CSV
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {format.toUpperCase()}
        </Badge>
      );
  }
};

// Mock data for saved reports
const mockSavedReports: SavedReport[] = [
  {
    id: "report-001",
    name: "Q2 2023 Payroll Summary",
    type: "Payroll Summary Report",
    createdAt: "2023-07-01T10:30:00",
    createdBy: "Admin User",
    dateRange: {
      startDate: "2023-04-01",
      endDate: "2023-06-30",
    },
    format: "pdf",
    size: "2.4 MB",
    downloadCount: 12,
  },
  {
    id: "report-002",
    name: "June 2023 Employee Directory",
    type: "Employee Directory Report",
    createdAt: "2023-06-15T14:45:00",
    createdBy: "Admin User",
    dateRange: {
      startDate: "2023-06-01",
      endDate: "2023-06-30",
    },
    format: "excel",
    size: "1.8 MB",
    downloadCount: 8,
  },
  {
    id: "report-003",
    name: "Q2 2023 Tax Withholding",
    type: "Tax Withholding Report",
    createdAt: "2023-07-02T09:15:00",
    createdBy: "Admin User",
    dateRange: {
      startDate: "2023-04-01",
      endDate: "2023-06-30",
    },
    format: "csv",
    size: "1.2 MB",
    downloadCount: 5,
  },
  {
    id: "report-004",
    name: "2023 Benefits Enrollment",
    type: "Benefits Enrollment Report",
    createdAt: "2023-05-10T11:20:00",
    createdBy: "Admin User",
    dateRange: {
      startDate: "2023-01-01",
      endDate: "2023-05-01",
    },
    format: "pdf",
    size: "3.1 MB",
    downloadCount: 15,
  },
  {
    id: "report-005",
    name: "Q1 2023 Attendance & Leave",
    type: "Attendance & Leave Report",
    createdAt: "2023-04-05T13:40:00",
    createdBy: "Admin User",
    dateRange: {
      startDate: "2023-01-01",
      endDate: "2023-03-31",
    },
    format: "excel",
    size: "2.2 MB",
    downloadCount: 10,
  },
];

const SavedReports: React.FC<SavedReportsProps> = ({
  reports = mockSavedReports,
  onDownload = () => {},
  onDelete = () => {},
}) => {
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(
    null,
  );

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Saved Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.type}</p>
                  </div>
                  <div>{getFormatBadge(report.format)}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(report.dateRange.startDate)} -{" "}
                      {formatDate(report.dateRange.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Created on {formatDate(report.createdAt)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {report.size}
                  </div>
                  <div>
                    <span className="font-medium">Downloads:</span>{" "}
                    {report.downloadCount}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onDownload(report.id)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No saved reports found. Generate a new report to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedReports;
