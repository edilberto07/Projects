import { useState, useCallback } from 'react';

interface TaxBracket {
    id: string;
    minAmount: number;
    maxAmount: number;
    rate: number;
    effectiveDate: string;
}

interface DeductionRule {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    maxAmount?: number;
    applicableToSalaryRange?: {
        min: number;
        max: number;
    };
}

interface DeductionCalculation {
    basicPay: number;
    taxAmount: number;
    sssDeduction: number;
    philHealthDeduction: number;
    pagIbigDeduction: number;
    otherDeductions: {
        name: string;
        amount: number;
    }[];
    totalDeductions: number;
    netPay: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useDeductions = () => {
    const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([]);
    const [deductionRules, setDeductionRules] = useState<DeductionRule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    const fetchTaxBrackets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/deductions/tax-brackets`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setTaxBrackets(data.data);
            return data.data as TaxBracket[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching tax brackets');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDeductionRules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/deductions/rules`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setDeductionRules(data.data);
            return data.data as DeductionRule[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching deduction rules');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const calculateDeductions = useCallback(async (
        employeeId: string,
        basicPay: number,
        payPeriod: string,
        additionalDeductions?: { name: string; amount: number }[]
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/deductions/calculate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    employeeId,
                    basicPay,
                    payPeriod,
                    additionalDeductions,
                }),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            return data.data as DeductionCalculation;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error calculating deductions');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDeductionRule = useCallback(async (
        ruleId: string,
        updates: Partial<DeductionRule>
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/deductions/rules/${ruleId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            await fetchDeductionRules();
            return data.data as DeductionRule;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating deduction rule');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDeductionRules]);

    return {
        taxBrackets,
        deductionRules,
        loading,
        error,
        fetchTaxBrackets,
        fetchDeductionRules,
        calculateDeductions,
        updateDeductionRule,
    };
}; 