import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { useAuth } from "../lib/auth";
import {
  Users,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { employeeApi, clearStatsCache } from "../lib/api";
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

const Home: React.FC = () => {
  const { user, loading: authLoading, employeeStats, fetchEmployeeStats } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  console.log('Home component render. user:', user ? 'Authenticated' : 'Not Authenticated', 'authLoading:', authLoading, 'local loading:', loading, 'current stats:', employeeStats, 'Auth Context Stats:', employeeStats);

  useEffect(() => {
    console.log('Home component mounted effect. user:', user ? 'Authenticated' : 'Not Authenticated', 'authLoading:', authLoading);
    
    // Attempt to fetch stats if authenticated and auth loading is complete
    // and if stats haven't been fetched yet in AuthProvider
    if (user && !authLoading && !employeeStats) {
      console.log('User authenticated, auth loading finished, and stats not yet in context. Attempting to fetch stats via context function.');
       // Clear the stats cache when component mounts and we're ready to fetch - No longer needed here
       // clearStatsCache(); 
       fetchEmployeeStats(); // Call fetch function from context
    } else if (employeeStats) { // Added else if to log when stats are available
      console.log('Stats already available in Auth Context.');
      setLoading(false); // Ensure loading is false if stats are already there
    }
     else {
       console.log('Waiting for authentication to fetch stats or stats already available. user:', user ? 'Authenticated' : 'Not Authenticated', 'authLoading:', authLoading, 'Auth Context Stats:', !!employeeStats);
    }

    return () => {
      console.log('Home component unmounting effect.'); // Debug log
      mountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [user, authLoading, employeeStats, fetchEmployeeStats]);

  const handleRefresh = () => {
    console.log('Manual refresh triggered'); // Debug log
    if (!loading) {  // Only allow refresh if not already loading
      // No longer calling local fetchStats, call the one from context
      fetchEmployeeStats(); // Call fetch function from context
    }
  };

  // Mock data for recent activities - replace with actual API call when available
  const recentActivities = [
    { id: 1, type: "payroll", message: "May payroll processed", date: "2 hours ago" },
    { id: 2, type: "employee", message: "New employee added", date: "5 hours ago" },
    { id: 3, type: "report", message: "Monthly report generated", date: "1 day ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : employeeStats?.totalEmployees ?? '-'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : employeeStats?.activeEmployees ?? '-'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '-' : `₱${employeeStats?.totalPayroll.toLocaleString() ?? '-'}`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '-' : employeeStats?.pendingApprovals ?? '-'}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Payroll Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{loading ? '-' : employeeStats?.upcomingPayroll ?? '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {activity.type === "payroll" && <DollarSign className="h-5 w-5 text-green-500" />}
                    {activity.type === "employee" && <Users className="h-5 w-5 text-blue-500" />}
                    {activity.type === "report" && <FileText className="h-5 w-5 text-purple-500" />}
                    <div>
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Home;
