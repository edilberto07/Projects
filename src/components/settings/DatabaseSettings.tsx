import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Table, FileText } from "lucide-react";
import DatabaseConfig, {
  DatabaseConfig as DBConfig,
} from "../database/DatabaseConfig";

const DatabaseSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("config");

  const handleSaveConfig = (config: DBConfig) => {
    // In a real app, you would save this to localStorage or a settings API
    console.log("Saving database config:", config);
    localStorage.setItem("dbConfig", JSON.stringify(config));
    alert("Database configuration saved successfully!");
  };

  const handleTestConnection = async (config: DBConfig): Promise<boolean> => {
    // In a real app, you would make an API call to test the connection
    // For demo purposes, we'll simulate a successful connection after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  };

  // Load saved config from localStorage if available
  const getSavedConfig = (): DBConfig | undefined => {
    const saved = localStorage.getItem("dbConfig");
    if (saved) {
      try {
        return JSON.parse(saved) as DBConfig;
      } catch (e) {
        console.error("Error parsing saved database config", e);
      }
    }
    return undefined;
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Tables
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-4">
            <DatabaseConfig
              onSave={handleSaveConfig}
              onTest={handleTestConnection}
              initialConfig={getSavedConfig()}
            />
          </TabsContent>

          <TabsContent value="tables" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                The application requires the following tables in your database.
                You can use SQLyog to create these tables if they don't exist.
              </p>

              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    employees
                  </h3>
                  <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                    {`CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  employmentType VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  salary DECIMAL(12, 2) NOT NULL,
  bankAccount VARCHAR(100),
  taxId VARCHAR(50),
  address TEXT,
  emergencyContact TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-md font-medium mb-2 flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    payroll_records
                  </h3>
                  <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-x-auto">
                    {`CREATE TABLE IF NOT EXISTS payroll_records (
  id VARCHAR(36) PRIMARY KEY,
  payPeriod VARCHAR(100) NOT NULL,
  employeeId VARCHAR(36) NOT NULL,
  basicPay DECIMAL(12, 2) NOT NULL,
  allowances DECIMAL(12, 2) NOT NULL DEFAULT 0,
  overtime DECIMAL(12, 2) NOT NULL DEFAULT 0,
  grossPay DECIMAL(12, 2) NOT NULL,
  taxWithheld DECIMAL(12, 2) NOT NULL,
  sssContribution DECIMAL(12, 2) NOT NULL,
  philHealthContribution DECIMAL(12, 2) NOT NULL,
  pagIbigContribution DECIMAL(12, 2) NOT NULL,
  otherDeductions DECIMAL(12, 2) NOT NULL DEFAULT 0,
  netPay DECIMAL(12, 2) NOT NULL,
  paymentDate DATE NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  taxFilingReference VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);`}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
