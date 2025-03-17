import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-3xl">SU</span>
              </div>
            </div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Campus Admin Payroll Portal
            </h1>
            <p className="mt-3 text-center text-sm text-gray-500">
              Secure access for authorized administrators only
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Button onClick={() => navigate("/login")} className="w-full py-3">
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/register")}
              className="w-full py-3"
            >
              Register New Account
            </Button>
          </div>
          <div className="mt-6">
            <p className="text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} State University. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
