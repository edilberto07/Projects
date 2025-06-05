import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import DatabaseSettings from "./DatabaseSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, User, Palette } from "lucide-react";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2">
            Configure system settings, manage user permissions, and customize
            the application.
          </p>
        </div>

        <Tabs defaultValue="database">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="mt-4">
            <DatabaseSettings />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <p className="text-center text-gray-500 py-8">
                User management functionality coming soon.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-4">
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <p className="text-center text-gray-500 py-8">
                Appearance customization coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
