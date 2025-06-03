import { useState, useCallback } from 'react';

interface PayrollReport {
    id: string;
    reportType: 'monthly' | 'quarterly' | 'annual';
    periodStart: string;
    periodEnd: string;
    department?: string;
    totalEmployees: number;
    totalBasicPay: number;
    totalDeductions: number;
    totalNetPay: number;
    generatedAt: string;
    status: 'generating' | 'completed' | 'error';
    downloadUrl?: string;
}

interface ReportFilters {
    startDate: string;
    endDate: string;
    department?: string;
    reportType: 'monthly' | 'quarterly' | 'annual';
}

interface PayrollAnalytics {
    averageSalary: number;
    totalPayroll: number;
    departmentBreakdown: {
        department: string;
        employeeCount: number;
        totalSalary: number;
    }[];
    monthlyTrend: {
        month: string;
        totalPayroll: number;
    }[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useReports = () => {
    const [reports, setReports] = useState<PayrollReport[]>([]);
    const [analytics, setAnalytics] = useState<PayrollAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    const generateReport = useCallback(async (filters: ReportFilters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/reports/generate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(filters),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return data.data as PayrollReport;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error generating report');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchReports = useCallback(async (filters?: Partial<ReportFilters>) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters?.startDate) queryParams.append('start_date', filters.startDate);
            if (filters?.endDate) queryParams.append('end_date', filters.endDate);
            if (filters?.department) queryParams.append('department', filters.department);
            if (filters?.reportType) queryParams.append('report_type', filters.reportType);

            const response = await fetch(`${API_URL}/reports?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setReports(data.data);
            return data.data as PayrollReport[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching reports');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAnalytics = useCallback(async (period: 'month' | 'quarter' | 'year') => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/reports/analytics?period=${period}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setAnalytics(data.data);
            return data.data as PayrollAnalytics;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching analytics');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const downloadReport = useCallback(async (reportId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/reports/${reportId}/download`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payroll-report-${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error downloading report');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        reports,
        analytics,
        loading,
        error,
        generateReport,
        fetchReports,
        getAnalytics,
        downloadReport,
    };
}; 