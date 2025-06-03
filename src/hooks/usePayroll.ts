import { useState, useCallback } from 'react';

interface PayrollBatch {
    id: string;
    batchName: string;
    payPeriodStart: string;
    payPeriodEnd: string;
    paymentDate: string;
    department: string;
    employeeCount: number;
    totalAmount: number;
    status: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
}

interface PayrollRecord {
    id: string;
    payrollBatchId: string;
    employeeId: string;
    payPeriod: string;
    basicPay: number;
    allowances: number;
    overtime: number;
    grossPay: number;
    taxWithheld: number;
    sssContribution: number;
    philHealthContribution: number;
    pagIbigContribution: number;
    otherDeductions: number;
    netPay: number;
    paymentDate: string;
    paymentMethod?: string;
    taxFilingReference?: string;
    notes?: string;
}

interface PayrollSummary {
    department: string;
    employeeCount: number;
    totalBasicPay: number;
    totalAllowances: number;
    totalOvertime: number;
    totalGrossPay: number;
    totalNetPay: number;
}

interface PayrollResponse {
    error: boolean;
    message?: string;
    data?: PayrollBatch | PayrollBatch[] | PayrollRecord | PayrollRecord[] | PayrollSummary[];
}

interface PayrollFilters {
    keyword?: string;
    page?: number;
    limit?: number;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const usePayroll = () => {
    const [batches, setBatches] = useState<PayrollBatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    const fetchPayrollBatches = useCallback(async (filters?: PayrollFilters) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters?.keyword) queryParams.append('keyword', filters.keyword);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.limit) queryParams.append('limit', filters.limit.toString());
            if (filters?.sortColumn) queryParams.append('sort_column', filters.sortColumn);
            if (filters?.sortType) queryParams.append('sort_type', filters.sortType);

            const response = await fetch(`${API_URL}/payroll/batches?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            const batchList = Array.isArray(data.data) ? data.data as PayrollBatch[] : [];
            setBatches(batchList);
            return batchList;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching payroll batches');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createPayrollBatch = useCallback(async (batchData: Omit<PayrollBatch, 'id' | 'employeeCount' | 'totalAmount' | 'createdAt'>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/payroll/batches`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(batchData),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            await fetchPayrollBatches();
            return data.data as PayrollBatch;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating payroll batch');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrollBatches]);

    const getPayrollRecords = useCallback(async (batchId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/payroll/batches/${batchId}/records`, {
                headers: getAuthHeaders(),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return Array.isArray(data.data) ? data.data as PayrollRecord[] : [];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching payroll records');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const processPayrollBatch = useCallback(async (batchId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/payroll/batches/${batchId}/process`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            await fetchPayrollBatches();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error processing payroll batch');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchPayrollBatches]);

    const updatePayrollRecord = useCallback(async (
        recordId: string,
        updates: Partial<PayrollRecord>
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/payroll/records/${recordId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating payroll record');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPayrollSummary = useCallback(async (
        startDate: string,
        endDate: string,
        department?: string
    ) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                start_date: startDate,
                end_date: endDate,
                ...(department && { department }),
            });

            const response = await fetch(`${API_URL}/payroll/summary?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            const data: PayrollResponse = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return Array.isArray(data.data) ? data.data as PayrollSummary[] : [];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching payroll summary');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        batches,
        loading,
        error,
        fetchPayrollBatches,
        createPayrollBatch,
        getPayrollRecords,
        processPayrollBatch,
        updatePayrollRecord,
        getPayrollSummary,
    };
}; 