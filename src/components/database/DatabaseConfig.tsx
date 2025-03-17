import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Save, RefreshCw } from "lucide-react";

interface DatabaseConfigProps {
  onSave?: (config: DatabaseConfig) => void;
  onTest?: (config: DatabaseConfig) => Promise<boolean>;
  initialConfig?: DatabaseConfig;
}

export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({
  onSave = () => {},
  onTest = async () => true,
  initialConfig = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "",
  },
}) => {
  const [config, setConfig] = useState<DatabaseConfig>(initialConfig);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (field: keyof DatabaseConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const success = await onTest(config);
      setTestResult({
        success,
        message: success
          ? "Connection successful!"
          : "Connection failed. Please check your settings.",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error.message || "Unknown error"}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave(config);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => handleChange("host", e.target.value)}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={config.port}
                onChange={(e) => handleChange("port", e.target.value)}
                placeholder="3306"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <Input
              id="database"
              value={config.database}
              onChange={(e) => handleChange("database", e.target.value)}
              placeholder="Enter your existing database name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input
                id="user"
                value={config.user}
                onChange={(e) => handleChange("user", e.target.value)}
                placeholder="root"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter database password"
              />
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-md ${testResult.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {testResult.message}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Test Connection
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConfig;
