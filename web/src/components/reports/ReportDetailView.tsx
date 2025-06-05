import React, { useState } from "react";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportDetailViewProps {
  report: {
    id: string;
    name: string;
    type: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
    createdAt: string;
  };
  onBack: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("employees");

  // Mock data for employees in the report
  const employees = [
    {
      id: "EMP-001",
      name: "John Doe",
      position: "Associate Professor",
      basicMonthlyCompensation: 35416.67,
      absences: 0,
      pvr: 0,
      pera: 2000,
      hpra: 1500,
      grossAmountEarned: 38916.67,
      totalAmountEarned: 38916.67,
      withholdingTax: 8083.33,
      gsisRlip: 1375,
      hdmf: 100,
      philhealth: 900,
      gsisLoans: {
        conso: 0,
        emergency: 0,
        pl: 0,
        gfal: 0,
        mpl: 0,
        cpl: 0,
        mplLive: 0,
      },
      otherDeductions: 0,
      totalDeductions: 10458.33,
      netPay: 28458.34,
      firstHalf: 14229.17,
    },
    {
      id: "EMP-002",
      name: "Jane Smith",
      position: "Professor",
      basicMonthlyCompensation: 39583.33,
      absences: 0,
      pvr: 0,
      pera: 2000,
      hpra: 1500,
      grossAmountEarned: 43083.33,
      totalAmountEarned: 43083.33,
      withholdingTax: 9116.67,
      gsisRlip: 1375,
      hdmf: 100,
      philhealth: 900,
      gsisLoans: {
        conso: 0,
        emergency: 0,
        pl: 0,
        gfal: 0,
        mpl: 2000,
        cpl: 0,
        mplLive: 0,
      },
      otherDeductions: 0,
      totalDeductions: 13491.67,
      netPay: 29591.66,
      firstHalf: 14795.83,
    },
    {
      id: "EMP-003",
      name: "Robert Johnson",
      position: "Assistant Professor",
      basicMonthlyCompensation: 32500,
      absences: 1,
      pvr: 0,
      pera: 2000,
      hpra: 1500,
      grossAmountEarned: 34541.67,
      totalAmountEarned: 34541.67,
      withholdingTax: 7660,
      gsisRlip: 1375,
      hdmf: 100,
      philhealth: 900,
      gsisLoans: {
        conso: 1500,
        emergency: 0,
        pl: 0,
        gfal: 0,
        mpl: 0,
        cpl: 0,
        mplLive: 0,
      },
      otherDeductions: 500,
      totalDeductions: 12035,
      netPay: 22506.67,
      firstHalf: 11253.34,
    },
  ];

  // Mock data for HES (Higher Education Subsidy) records
  const hesRecords = [
    {
      id: "HES-001",
      name: "John Doe",
      position: "Associate Professor",
      basicSalary: 35416.67,
      hesAllowance: 5000,
      researchIncentive: 2500,
      academicExcellence: 1500,
      totalHesAmount: 9000,
      withholdingTax: 1800,
      netHesAmount: 7200,
      dateReleased: "2023-07-15",
      remarks: "Regular HES payment",
    },
    {
      id: "HES-002",
      name: "Jane Smith",
      position: "Professor",
      basicSalary: 39583.33,
      hesAllowance: 6000,
      researchIncentive: 3000,
      academicExcellence: 2000,
      totalHesAmount: 11000,
      withholdingTax: 2200,
      netHesAmount: 8800,
      dateReleased: "2023-07-15",
      remarks: "Regular HES payment",
    },
    {
      id: "HES-003",
      name: "Robert Johnson",
      position: "Assistant Professor",
      basicSalary: 32500,
      hesAllowance: 4500,
      researchIncentive: 2000,
      academicExcellence: 1000,
      totalHesAmount: 7500,
      withholdingTax: 1500,
      netHesAmount: 6000,
      dateReleased: "2023-07-15",
      remarks: "Regular HES payment",
    },
  ];

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {report.name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <p className="text-sm text-gray-500">Report Type</p>
              <p className="font-medium">{report.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Range</p>
              <p className="font-medium">
                {report.dateRange.startDate} to {report.dateRange.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Generated On</p>
              <p className="font-medium">{report.createdAt}</p>
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="hes" className="flex items-center gap-2">
                HES
              </TabsTrigger>
              <TabsTrigger
                value="otherDeductions"
                className="flex items-center gap-2"
              >
                Other Deductions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hes" className="mt-4">
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">
                        Name of Personnel
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Position
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Basic Monthly Compensation
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Absences
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        PVR
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        PERA
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        HPRA
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Gross Amount Earned
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Total Amount Earned
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Withholding Tax
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        GSIS RLIP
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        HDMF
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        PhilHealth
                      </TableHead>
                      <TableHead
                        className="whitespace-nowrap text-center"
                        colSpan={7}
                      >
                        GSIS Loans
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Other Deductions
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Total Deductions
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        Net Pay
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right">
                        First Half
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={12}></TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        CONSO
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        EMRGY
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        PL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        GFAL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        MPL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        CPL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        MPL Live
                      </TableHead>
                      <TableHead colSpan={3}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="whitespace-nowrap">
                          {employee.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {employee.position}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.basicMonthlyCompensation.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {employee.absences}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.pvr.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.pera.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.hpra.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.grossAmountEarned.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.totalAmountEarned.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.withholdingTax.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisRlip.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.hdmf.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.philhealth.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.conso.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.emergency.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.pl.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.gfal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.mpl.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.cpl.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.gsisLoans.mplLive.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.otherDeductions.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱
                          {employee.totalDeductions.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ₱
                          {employee.netPay.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱
                          {employee.firstHalf.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="otherDeductions" className="mt-4">
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">
                        Name of Employee
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Tax Refund
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        PHIL HEALTH ADJ.
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        MPL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        CAL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        MP2
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        SSS
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        CFI
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        CBB
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        FCB LOAN
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        VASTA
                      </TableHead>
                      <TableHead
                        className="whitespace-nowrap text-center"
                        colSpan={3}
                      >
                        T & E
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        FA
                      </TableHead>
                      <TableHead
                        className="whitespace-nowrap text-center"
                        colSpan={2}
                      >
                        DISALLOWANCES
                      </TableHead>
                      <TableHead
                        className="whitespace-nowrap text-center"
                        colSpan={2}
                      >
                        IGP
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Broiler Chicken
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Talong
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Okra
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Batong
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Sitaw
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Sili
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        WATER BILL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        ELECT. BILL
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        TOTAL DEDUCTIONS
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Death Aid
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Mont. Cont.
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Pangpat
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Annual Dues
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        GF
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        STF
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Notice of Disallowance
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center">
                        Paddy Rice
                      </TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="whitespace-nowrap">
                          {employee.name}
                        </TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center">0.00</TableCell>
                        <TableCell className="text-center font-bold">
                          0.00
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDetailView;
