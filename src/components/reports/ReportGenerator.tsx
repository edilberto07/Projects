import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FileText,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportGeneratorProps {
  onGenerateReport?: (data: ReportFormData) => void;
}

interface ReportFormData {
  reportType: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  departments: string[];
  employmentTypes: string[];
  includeInactive: boolean;
  groupBy: string;
  sortBy: string;
  exportFormat: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerateReport = () => {},
}) => {
  const [previewReady, setPreviewReady] = useState(false);

  const form = useForm<ReportFormData>({
    defaultValues: {
      reportType: "payroll",
      dateRange: {
        startDate: "",
        endDate: "",
      },
      departments: [],
      employmentTypes: [],
      includeInactive: false,
      groupBy: "department",
      sortBy: "name",
      exportFormat: "pdf",
    },
  });

  const handleSubmit = (data: ReportFormData) => {
    console.log("Report data:", data);
    setPreviewReady(true);
    onGenerateReport(data);
  };

  const reportTypes = [
    { value: "payroll", label: "Payroll Summary Report" },
    { value: "employee", label: "Employee Directory Report" },
    { value: "tax", label: "Tax Withholding Report" },
    { value: "benefits", label: "Benefits Enrollment Report" },
    { value: "attendance", label: "Attendance & Leave Report" },
  ];

  const departments = [
    { value: "computer-science", label: "Computer Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "engineering", label: "Engineering" },
    { value: "business", label: "Business" },
  ];

  const employmentTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "adjunct", label: "Adjunct" },
  ];

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Report Parameters
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              disabled={!previewReady}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Preview & Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="reportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Report Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {reportTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the type of report you want to generate.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateRange.startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dateRange.endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="departments"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Departments</FormLabel>
                            <FormDescription>
                              Select the departments to include in the report.
                            </FormDescription>
                          </div>
                          <div className="space-y-2">
                            {departments.map((department) => (
                              <FormField
                                key={department.value}
                                control={form.control}
                                name="departments"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={department.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            department.value,
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  department.value,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !==
                                                      department.value,
                                                  ),
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {department.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="employmentTypes"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Employment Types</FormLabel>
                            <FormDescription>
                              Select the employment types to include in the
                              report.
                            </FormDescription>
                          </div>
                          <div className="space-y-2">
                            {employmentTypes.map((type) => (
                              <FormField
                                key={type.value}
                                control={form.control}
                                name="employmentTypes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={type.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            type.value,
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  type.value,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== type.value,
                                                  ),
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {type.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includeInactive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Include inactive employees</FormLabel>
                            <FormDescription>
                              Include employees who are on leave, terminated, or
                              retired.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="groupBy"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Group By</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="department" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Department
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="employmentType" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Employment Type
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="none" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No Grouping
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exportFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Export Format</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select export format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="excel">
                                Excel Spreadsheet
                              </SelectItem>
                              <SelectItem value="csv">CSV File</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the format for exporting the report.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Preview
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="space-y-6">
              <div className="border rounded-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">
                    {reportTypes.find(
                      (r) => r.value === form.getValues("reportType"),
                    )?.label || "Report Preview"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {form.getValues("dateRange.startDate") ||
                      "(Start date not specified)"}{" "}
                    to{" "}
                    {form.getValues("dateRange.endDate") ||
                      "(End date not specified)"}
                  </div>
                </div>

                <div className="h-[400px] flex items-center justify-center bg-gray-50 border rounded-md">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Report Preview</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Your report preview would appear here. In a real
                      implementation, this would show a preview of the actual
                      report data based on your selected parameters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewReady(false)}
                >
                  Modify Parameters
                </Button>

                <div className="flex items-center gap-2">
                  {form.getValues("exportFormat") === "pdf" && (
                    <Button className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      Download PDF
                    </Button>
                  )}
                  {form.getValues("exportFormat") === "excel" && (
                    <Button className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Download Excel
                    </Button>
                  )}
                  {form.getValues("exportFormat") === "csv" && (
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download CSV
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
