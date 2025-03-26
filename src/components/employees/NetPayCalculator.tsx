import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface NetPayCalculatorProps {
  initialSalary?: number;
  onCalculate?: (netPay: number) => void;
}

const NetPayCalculator: React.FC<NetPayCalculatorProps> = ({
  initialSalary = 85000,
  onCalculate = () => {},
}) => {
  // Convert annual salary to monthly for display
  const [grossSalary, setGrossSalary] = useState(initialSalary);
  const [taxRate, setTaxRate] = useState(20); // Default tax rate 20%
  const [sssContribution, setSssContribution] = useState(1375); // Default SSS contribution
  const [philHealthContribution, setPhilHealthContribution] = useState(900); // Default PhilHealth
  const [pagIbigContribution, setPagIbigContribution] = useState(100); // Default Pag-IBIG
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [netPay, setNetPay] = useState(0);
  const [monthlyNetPay, setMonthlyNetPay] = useState(0);
  const [activeTab, setActiveTab] = useState("main");

  // GSIS Loan fields
  const [gsisConsoLoan, setGsisConsoLoan] = useState(0);
  const [gsisEmergency, setGsisEmergency] = useState(0);
  const [gsisPolicyLoan, setGsisPolicyLoan] = useState(0);
  const [gsisOptional, setGsisOptional] = useState(0);
  const [gsisMpl, setGsisMpl] = useState(0);
  const [gsisMplLive, setGsisMplLive] = useState(0);

  // HES fields
  const [hesAllowance, setHesAllowance] = useState(0);
  const [researchIncentive, setResearchIncentive] = useState(0);
  const [academicExcellence, setAcademicExcellence] = useState(0);
  const [totalHesAmount, setTotalHesAmount] = useState(0);
  const [hesWithholdingTax, setHesWithholdingTax] = useState(0);
  const [netHesAmount, setNetHesAmount] = useState(0);

  // Other Deductions fields
  const [taxRefund, setTaxRefund] = useState(0);
  const [philHealthAdj, setPhilHealthAdj] = useState(0);
  const [mpl, setMpl] = useState(0);
  const [cal, setCal] = useState(0);
  const [mp2, setMp2] = useState(0);
  const [sss, setSss] = useState(0);
  const [cfi, setCfi] = useState(0);
  const [cbb, setCbb] = useState(0);
  const [fcbLoan, setFcbLoan] = useState(0);
  const [vasta, setVasta] = useState(0);
  const [deathAid, setDeathAid] = useState(0);
  const [montCont, setMontCont] = useState(0);
  const [pangpat, setPangpat] = useState(0);
  const [annualDues, setAnnualDues] = useState(0);
  const [gf, setGf] = useState(0);
  const [stf, setStf] = useState(0);
  const [noticeOfDisallowance, setNoticeOfDisallowance] = useState(0);
  const [paddyRice, setPaddyRice] = useState(0);
  const [broilerChicken, setBroilerChicken] = useState(0);
  const [talong, setTalong] = useState(0);
  const [okra, setOkra] = useState(0);
  const [batong, setBatong] = useState(0);
  const [sitaw, setSitaw] = useState(0);
  const [sili, setSili] = useState(0);
  const [waterBill, setWaterBill] = useState(0);
  const [electricBill, setElectricBill] = useState(0);
  const [totalOtherDeductions, setTotalOtherDeductions] = useState(0);

  // Calculate net pay whenever inputs change
  useEffect(() => {
    calculateNetPay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    grossSalary,
    taxRate,
    sssContribution,
    philHealthContribution,
    pagIbigContribution,
    otherDeductions,
    gsisConsoLoan,
    gsisEmergency,
    gsisPolicyLoan,
    gsisOptional,
    gsisMpl,
    gsisMplLive,
  ]);

  // Calculate HES amounts
  useEffect(() => {
    const total = hesAllowance + researchIncentive + academicExcellence;
    setTotalHesAmount(total);
    const tax = total * 0.2; // Assuming 20% tax rate for HES
    setHesWithholdingTax(tax);
    setNetHesAmount(total - tax);
  }, [hesAllowance, researchIncentive, academicExcellence]);

  // Calculate Other Deductions total and update otherDeductions field
  useEffect(() => {
    const total =
      taxRefund +
      philHealthAdj +
      mpl +
      cal +
      mp2 +
      sss +
      cfi +
      cbb +
      fcbLoan +
      vasta +
      deathAid +
      montCont +
      pangpat +
      annualDues +
      gf +
      stf +
      noticeOfDisallowance +
      paddyRice +
      broilerChicken +
      talong +
      okra +
      batong +
      sitaw +
      sili +
      waterBill +
      electricBill;
    setTotalOtherDeductions(total);
    setOtherDeductions(total); // Update the otherDeductions field to reflect in HES tab
  }, [
    taxRefund,
    philHealthAdj,
    mpl,
    cal,
    mp2,
    sss,
    cfi,
    cbb,
    fcbLoan,
    vasta,
    deathAid,
    montCont,
    pangpat,
    annualDues,
    gf,
    stf,
    noticeOfDisallowance,
    paddyRice,
    broilerChicken,
    talong,
    okra,
    batong,
    sitaw,
    sili,
    waterBill,
    electricBill,
  ]);

  const calculateNetPay = () => {
    // Calculate monthly deductions
    const monthlyGrossSalary = grossSalary / 12;
    const taxDeduction = (monthlyGrossSalary * taxRate) / 100;

    // Calculate GSIS loans total
    const gsisLoansTotal =
      gsisConsoLoan +
      gsisEmergency +
      gsisPolicyLoan +
      gsisOptional +
      gsisMpl +
      gsisMplLive;

    const totalDeductions =
      taxDeduction +
      sssContribution +
      philHealthContribution +
      pagIbigContribution +
      gsisLoansTotal +
      otherDeductions +
      totalOtherDeductions;

    // Calculate monthly net pay
    const monthly = monthlyGrossSalary - totalDeductions + netHesAmount;
    const annual = monthly * 12;

    setNetPay(annual);
    setMonthlyNetPay(monthly);
    onCalculate(annual);
  };

  const handleGrossSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setGrossSalary(value * 12); // Convert to annual for internal calculations
  };

  const handleTaxRateChange = (value: number[]) => {
    setTaxRate(value[0]);
  };

  const handleOtherDeductionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setOtherDeductions(value);
  };

  // Calculate totals
  const monthlyGrossSalary = grossSalary / 12;
  const taxDeduction = (monthlyGrossSalary * taxRate) / 100;
  const gsisLoansTotal =
    gsisConsoLoan +
    gsisEmergency +
    gsisPolicyLoan +
    gsisOptional +
    gsisMpl +
    gsisMplLive;
  const totalDeductions =
    taxDeduction +
    sssContribution +
    philHealthContribution +
    pagIbigContribution +
    gsisLoansTotal +
    otherDeductions +
    totalOtherDeductions;

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Net Pay Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hes" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="hes" className="flex-1">
              HES
            </TabsTrigger>
            <TabsTrigger value="otherDeductions" className="flex-1">
              Other Deductions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hes" className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="text-md font-medium text-blue-800 mb-2">
                Higher Education Subsidy (HES)
              </h3>
              <p className="text-sm text-blue-700">
                Enter HES allowances and incentives to calculate the total HES
                amount and net HES amount after tax.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gross-salary" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Basic Monthly Compensation (₱)
              </Label>
              <Input
                id="gross-salary"
                type="number"
                value={grossSalary / 12}
                className="text-right bg-gray-50"
                disabled={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hes-allowance">HES Allowance (₱)</Label>
                <Input
                  id="hes-allowance"
                  type="number"
                  value={hesAllowance}
                  onChange={(e) =>
                    setHesAllowance(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="research-incentive">
                  Research Incentive (₱)
                </Label>
                <Input
                  id="research-incentive"
                  type="number"
                  value={researchIncentive}
                  onChange={(e) =>
                    setResearchIncentive(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic-excellence">
                Academic Excellence (₱)
              </Label>
              <Input
                id="academic-excellence"
                type="number"
                value={academicExcellence}
                onChange={(e) =>
                  setAcademicExcellence(parseFloat(e.target.value) || 0)
                }
                className="text-right"
              />
            </div>

            {/* Tax Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  Income Tax Rate
                </Label>
                <span className="text-sm font-medium">{taxRate}%</span>
              </div>
              <Slider
                defaultValue={[taxRate]}
                max={50}
                step={1}
                onValueChange={handleTaxRateChange}
              />
              <p className="text-xs text-gray-500">
                Estimated tax rate based on income bracket. Adjust as needed.
              </p>
            </div>

            {/* Payroll Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left font-medium">
                      NAME OF PERSONNEL
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      POSITION
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      BASIC MONTHLY COMPENSATION
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      PERA
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      GROSS AMOUNT EARNED
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      WITHHOLDING TAX
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      GSIS/PAGIBIG
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                      PHILHEALTH
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">
                      Employee
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      Staff
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱
                      {(grossSalary / 12).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱0.00
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱
                      {(grossSalary / 12).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱
                      {taxDeduction.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱
                      {(sssContribution + pagIbigContribution).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 },
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">
                      ₱
                      {philHealthContribution.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* GSIS Loans Table */}
            <div>
              <h3 className="text-sm font-medium mb-2">GSIS Loans</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        CONSO
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        EMRGNCY
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        PL
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        GFAL
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        MPL
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        MPL Live
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        OTHER DEDUCTIONS
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        TOTAL DEDUCTIONS
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-medium">
                        NET PAY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisConsoLoan}
                          onChange={(e) =>
                            setGsisConsoLoan(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisEmergency}
                          onChange={(e) =>
                            setGsisEmergency(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisPolicyLoan}
                          onChange={(e) =>
                            setGsisPolicyLoan(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisOptional}
                          onChange={(e) =>
                            setGsisOptional(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisMpl}
                          onChange={(e) =>
                            setGsisMpl(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Input
                          type="number"
                          value={gsisMplLive}
                          onChange={(e) =>
                            setGsisMplLive(parseFloat(e.target.value) || 0)
                          }
                          className="text-right h-8 p-1"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        ₱
                        {totalOtherDeductions.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-medium">
                        ₱
                        {totalDeductions.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right font-bold text-primary">
                        ₱
                        {monthlyNetPay.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* HES Summary */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total HES Amount:</span>
                <span className="text-lg font-medium">
                  ₱
                  {totalHesAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Withholding Tax (20%):
                </span>
                <span className="text-lg font-medium text-red-600">
                  ₱
                  {hesWithholdingTax.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net HES Amount:</span>
                <span className="text-lg font-bold text-primary">
                  ₱
                  {netHesAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Mandatory Contributions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Adjust Mandatory Monthly Contributions
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="sss" className="text-xs">
                    SSS (₱)
                  </Label>
                  <Input
                    id="sss"
                    type="number"
                    value={sssContribution}
                    onChange={(e) =>
                      setSssContribution(parseFloat(e.target.value) || 0)
                    }
                    className="text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="philhealth" className="text-xs">
                    PhilHealth (₱)
                  </Label>
                  <Input
                    id="philhealth"
                    type="number"
                    value={philHealthContribution}
                    onChange={(e) =>
                      setPhilHealthContribution(parseFloat(e.target.value) || 0)
                    }
                    className="text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pagibig" className="text-xs">
                    Pag-IBIG (₱)
                  </Label>
                  <Input
                    id="pagibig"
                    type="number"
                    value={pagIbigContribution}
                    onChange={(e) =>
                      setPagIbigContribution(parseFloat(e.target.value) || 0)
                    }
                    className="text-right"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="otherDeductions" className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-md mb-4">
              <h3 className="text-md font-medium text-amber-800 mb-2">
                Other Deductions
              </h3>
              <p className="text-sm text-amber-700">
                Enter additional deductions that will be subtracted from the
                employee's pay.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="tax-refund" className="text-xs">
                  Tax Refund
                </Label>
                <Input
                  id="tax-refund"
                  type="number"
                  value={taxRefund}
                  onChange={(e) =>
                    setTaxRefund(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="philhealth-adj" className="text-xs">
                  PHIL HEALTH ADJ.
                </Label>
                <Input
                  id="philhealth-adj"
                  type="number"
                  value={philHealthAdj}
                  onChange={(e) =>
                    setPhilHealthAdj(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mpl" className="text-xs">
                  MPL
                </Label>
                <Input
                  id="mpl"
                  type="number"
                  value={mpl}
                  onChange={(e) => setMpl(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cal" className="text-xs">
                  CAL
                </Label>
                <Input
                  id="cal"
                  type="number"
                  value={cal}
                  onChange={(e) => setCal(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="mp2" className="text-xs">
                  MP2
                </Label>
                <Input
                  id="mp2"
                  type="number"
                  value={mp2}
                  onChange={(e) => setMp2(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sss-other" className="text-xs">
                  SSS
                </Label>
                <Input
                  id="sss-other"
                  type="number"
                  value={sss}
                  onChange={(e) => setSss(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cfi" className="text-xs">
                  CFI
                </Label>
                <Input
                  id="cfi"
                  type="number"
                  value={cfi}
                  onChange={(e) => setCfi(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cbb" className="text-xs">
                  CBB
                </Label>
                <Input
                  id="cbb"
                  type="number"
                  value={cbb}
                  onChange={(e) => setCbb(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="fcb-loan" className="text-xs">
                  FCB LOAN
                </Label>
                <Input
                  id="fcb-loan"
                  type="number"
                  value={fcbLoan}
                  onChange={(e) => setFcbLoan(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vasta" className="text-xs">
                  VASTA
                </Label>
                <Input
                  id="vasta"
                  type="number"
                  value={vasta}
                  onChange={(e) => setVasta(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="death-aid" className="text-xs">
                  Death Aid
                </Label>
                <Input
                  id="death-aid"
                  type="number"
                  value={deathAid}
                  onChange={(e) => setDeathAid(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mont-cont" className="text-xs">
                  Mont. Cont.
                </Label>
                <Input
                  id="mont-cont"
                  type="number"
                  value={montCont}
                  onChange={(e) => setMontCont(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pangpat" className="text-xs">
                  Pangpat
                </Label>
                <Input
                  id="pangpat"
                  type="number"
                  value={pangpat}
                  onChange={(e) => setPangpat(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="annual-dues" className="text-xs">
                  Annual Dues
                </Label>
                <Input
                  id="annual-dues"
                  type="number"
                  value={annualDues}
                  onChange={(e) =>
                    setAnnualDues(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gf" className="text-xs">
                  GF
                </Label>
                <Input
                  id="gf"
                  type="number"
                  value={gf}
                  onChange={(e) => setGf(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="stf" className="text-xs">
                  STF
                </Label>
                <Input
                  id="stf"
                  type="number"
                  value={stf}
                  onChange={(e) => setStf(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="notice-of-disallowance" className="text-xs">
                  Notice of Disallowance
                </Label>
                <Input
                  id="notice-of-disallowance"
                  type="number"
                  value={noticeOfDisallowance}
                  onChange={(e) =>
                    setNoticeOfDisallowance(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="paddy-rice" className="text-xs">
                  Paddy Rice
                </Label>
                <Input
                  id="paddy-rice"
                  type="number"
                  value={paddyRice}
                  onChange={(e) =>
                    setPaddyRice(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="broiler-chicken" className="text-xs">
                  Broiler Chicken
                </Label>
                <Input
                  id="broiler-chicken"
                  type="number"
                  value={broilerChicken}
                  onChange={(e) =>
                    setBroilerChicken(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="talong" className="text-xs">
                  Talong
                </Label>
                <Input
                  id="talong"
                  type="number"
                  value={talong}
                  onChange={(e) => setTalong(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="okra" className="text-xs">
                  Okra
                </Label>
                <Input
                  id="okra"
                  type="number"
                  value={okra}
                  onChange={(e) => setOkra(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="batong" className="text-xs">
                  Batong
                </Label>
                <Input
                  id="batong"
                  type="number"
                  value={batong}
                  onChange={(e) => setBatong(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sitaw" className="text-xs">
                  Sitaw
                </Label>
                <Input
                  id="sitaw"
                  type="number"
                  value={sitaw}
                  onChange={(e) => setSitaw(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sili" className="text-xs">
                  Sili
                </Label>
                <Input
                  id="sili"
                  type="number"
                  value={sili}
                  onChange={(e) => setSili(parseFloat(e.target.value) || 0)}
                  className="text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="water-bill" className="text-xs">
                  WATER BILL
                </Label>
                <Input
                  id="water-bill"
                  type="number"
                  value={waterBill}
                  onChange={(e) =>
                    setWaterBill(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="electric-bill" className="text-xs">
                  ELECT. BILL
                </Label>
                <Input
                  id="electric-bill"
                  type="number"
                  value={electricBill}
                  onChange={(e) =>
                    setElectricBill(parseFloat(e.target.value) || 0)
                  }
                  className="text-right"
                />
              </div>
            </div>

            <div className="overflow-x-auto border rounded-md">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-medium">
                      Name of Employee
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-right font-medium">
                      Total Other Deductions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2">
                      Employee
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-bold text-red-600">
                      ₱
                      {totalOtherDeductions.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total Other Deductions:
                </span>
                <span className="text-lg font-bold text-red-600">
                  ₱
                  {totalOtherDeductions.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Monthly Net Pay (with HES and deductions):
            </span>
            <span className="text-lg font-bold text-primary">
              ₱
              {monthlyNetPay.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Annual Net Pay:</span>
            <span className="text-lg font-bold text-primary">
              ₱
              {netPay.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2 mt-4"
          onClick={calculateNetPay}
        >
          <Calculator className="h-4 w-4" />
          Recalculate
        </Button>
      </CardContent>
    </Card>
  );
};

export default NetPayCalculator;
