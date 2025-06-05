import React, { useState } from "react";
import Header from "./Header";
import ChatbotSidebar from "./ChatbotSidebar";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children = null,
}) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 relative">
      {/* Header with Navigation */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Page Content */}
        <main
          className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
            isChatbotOpen ? "mr-80" : "mr-0"
          }`}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Chatbot Sidebar */}
        <ChatbotSidebar
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      </div>

      {/* Footer */}
      <footer
        className={`bg-white border-t border-gray-200 py-4 px-6 transition-all duration-300 ${
          isChatbotOpen ? "mr-80" : "mr-0"
        }`}
      >
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Campus Admin Payroll Portal. All rights
          reserved.
        </div>
      </footer>

      {/* Floating Chatbot Toggle Button */}
      {!isChatbotOpen && (
        <Button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default DashboardLayout;
