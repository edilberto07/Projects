import { useState, useCallback, useEffect, useRef } from 'react';
import { employeeApi } from '../lib/api';

// Request queue implementation
class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;

    async add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        while (this.queue.length > 0) {
            const request = this.queue.shift();
            if (request) {
                await request();
            }
        }
        this.processing = false;
    }
}

// Create a singleton queue instance
const requestQueue = new RequestQueue();

// Cache for employee data
let employeeCache = {
    data: null as Employee[] | null,
    lastChecked: 0,
    checking: false,
    error: null as string | null
};

// Cache duration in milliseconds (e.g., 5 minutes for employees)
const EMPLOYEE_CACHE_DURATION = 5 * 60 * 1000;

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department: string;
    position: string;
    employment_type: string;
    status: string;
    salary: number;
    start_date: string;
    bank_account?: string;
    tax_id?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

interface EmployeeFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    department: string;
    position: string;
    employment_type: string;
    start_date: string;
    salary: number;
    bank_account?: string;
    tax_id?: string;
    address?: string;
    emergency_contact?: string;
    notes?: string;
}

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchEmployees = useCallback(async (forceRefresh = false) => {

        // Check if we have a recent cache and are not already checking
        const now = Date.now();
        if (employeeCache.data && (now - employeeCache.lastChecked < EMPLOYEE_CACHE_DURATION || employeeCache.checking)) {
            console.log('useEmployees: fetchEmployees - Using cached or currently fetching data.');
            // If using cache, update state and set loading to false immediately
            if (!employeeCache.checking) {
                 setEmployees(employeeCache.data);
                 setLoading(false); // Set loading to false immediately if using cache
                 setError(employeeCache.error); // Set error from cache
            }
             // If checking is true, the loading state is already handled
            return;
        }

        try {
            console.log('useEmployees: fetchEmployees - Setting loading to true.');
            setLoading(true);
            setError(null);
            employeeCache.checking = true; // Mark as checking
            employeeCache.error = null; // Clear previous cache error

            console.log('useEmployees: fetchEmployees - Calling employeeApi.getAll()...');
            const response = await requestQueue.add(() => employeeApi.getAll());
            console.log('useEmployees: fetchEmployees - employeeApi.getAll() response:', response);
            
            if (!mountedRef.current) {
              console.log('useEmployees: fetchEmployees - Component unmounted after API call.');
              // Even if unmounted, update cache for next mount
              if (!response.error && response.data) {
                  employeeCache.data = response.data;
                  employeeCache.lastChecked = Date.now();
                  employeeCache.error = null;
                  console.log('useEmployees: fetchEmployees - Updated cache after unmount.');
              }
              // Still return as component is unmounted
              return;
            }

            if (response.error) {
                console.log('useEmployees: fetchEmployees - Server reported an error.', response.message);
                employeeCache.error = response.message || 'Failed to fetch employees'; // Store error in cache
                throw new Error(response.message || 'Failed to fetch employees');
            }
            
            console.log('useEmployees: fetchEmployees - Setting employees state with data.', response.data);
            setEmployees(response.data || []);
            
            // Update cache with new data
            employeeCache.data = response.data || [];
            employeeCache.lastChecked = Date.now();
            employeeCache.error = null; // Clear error on success

        } catch (err: any) {
            if (!mountedRef.current) {
              console.log('useEmployees: fetchEmployees - Component unmounted in catch.');
              // Even if unmounted, update cache error
              employeeCache.error = err.message || 'Failed to fetch employees';
              console.log('useEmployees: fetchEmployees - Updated cache error after unmount.');
              // Still throw to be caught by any consuming component if needed
              throw err;
            }

            console.error('Error fetching employees:', err);
            // Store error in cache
            employeeCache.error = err.message || 'Failed to fetch employees';

            if (err.response?.status === 401) {
                setError('Please log in to view employees');
            } else if (err.response?.status === 429) {
                setError('Too many requests. Please wait a moment and try again.');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to fetch employees');
            }
            // Re-throw the error so consuming components can handle it if necessary
            throw err;
        } finally {
            console.log('useEmployees: fetchEmployees - Finally block reached.');
             employeeCache.checking = false; // Mark as not checking
            if (mountedRef.current) {
                console.log('useEmployees: fetchEmployees - Setting loading to false in finally (mounted).');
                setLoading(false);
            } else {
               console.log('useEmployees: fetchEmployees - Skipping setLoading(false) in finally (unmounted).');
            }
        }
    }, []);

    useEffect(() => {
        console.log('useEmployees: useEffect - Initial fetch or fetchEmployees dependency changed.');
        fetchEmployees();
    }, [fetchEmployees]);

    const addEmployee = useCallback(async (data: EmployeeFormData) => {
        try {
            setError(null);
            
            console.log('useEmployees: addEmployee - Calling employeeApi.create()...');
            const response = await requestQueue.add(() => employeeApi.create(data));
            console.log('useEmployees: addEmployee - employeeApi.create() response:', response);
            
            if (!mountedRef.current) {
              console.log('useEmployees: addEmployee - Component unmounted during API call.');
               return; // Stop execution for this unmounted instance
            }

            if (response && response.data && !response.error) { // Check for successful response with data
                console.log('useEmployees: addEmployee - Employee created successfully. Updating local state.', response.data);
                // Update the employees state with the new employee from the response
                setEmployees(prevEmployees => [...prevEmployees, response.data]);
                return response; // Return the response for potential use in UI (e.e.g., showing success message)
            }
            
            // If response had an error property or was unexpected
            const errorMessage = response?.message || 'Failed to add employee';
            // Check mountedRef before setting state
            if (mountedRef.current) {
               setError(errorMessage); // Set error state
            }
            console.error('useEmployees: addEmployee - Server reported error or invalid response:', response); // Added log
            throw new Error(errorMessage);

        } catch (err: any) {
            if (!mountedRef.current) {
              console.log('useEmployees: addEmployee - Component unmounted in catch block.');
              throw err; // Re-throw error for component to handle
            }

            console.error('useEmployees: addEmployee - Error adding employee:', err);
            setError(err.message || 'Failed to add employee');
             setLoading(false); // Ensure loading is false in case of error before fetchEmployees is called
            throw err; // Re-throw error for component to handle
        }
        finally {
            console.log('useEmployees: addEmployee - Finally block reached.');
             // Loading state is primarily managed by fetchEmployees
         }
    }, [fetchEmployees, mountedRef]);

    const updateEmployee = useCallback(async (id: number, field: string, value: string, reason: string) => {
        try {
            setError(null);
            
            console.log(`useEmployees: updateEmployee - Calling employeeApi.update() for id ${id}, field ${field}...`);
            const response = await requestQueue.add(() => employeeApi.update(id, field, value, reason));
             console.log('useEmployees: updateEmployee - employeeApi.update() response:', response);
            
            if (!mountedRef.current) return;
            
            if (response && !response.error) {
                console.log('useEmployees: updateEmployee - Employee updated successfully.');
                await fetchEmployees(true);
                console.log('useEmployees: Returning hook state - loading:', loading, 'employees count:', employees.length);
                return response; // Return response if needed
            }

            const errorMessage = response?.message || 'Failed to update employee';
            if (mountedRef.current) {
               setError(errorMessage);
            }
            console.error('useEmployees: updateEmployee - Server reported error or invalid response:', response);
            throw new Error(errorMessage);

        } catch (err: any) {
            if (!mountedRef.current) return;

            console.error('useEmployees: updateEmployee - Error updating employee:', err);
            setError(err.message || 'Failed to update employee');
            setLoading(false);
            throw err;
        }
    }, [fetchEmployees, mountedRef]);

    const deleteEmployee = useCallback(async (id: number) => {
        try {
            setError(null);
            
            console.log(`useEmployees: deleteEmployee - Calling employeeApi.delete() for id ${id}...`);
            const response = await requestQueue.add(() => employeeApi.delete(id));
            console.log('useEmployees: deleteEmployee - employeeApi.delete() response:', response);

            if (!mountedRef.current) return;
            
             if (response && !response.error) {
                console.log('useEmployees: deleteEmployee - Employee deleted successfully.');
                await fetchEmployees(true);
                console.log('useEmployees: deleteEmployee - fetchEmployees(true) called after success.');
                return response; // Return response if needed
            }

            const errorMessage = response?.message || 'Failed to delete employee';
            if (mountedRef.current) {
               setError(errorMessage);
            }
            console.error('useEmployees: deleteEmployee - Server reported error or invalid response:', response);
            throw new Error(errorMessage);

        } catch (err: any) {
            if (!mountedRef.current) return;

            console.error('useEmployees: deleteEmployee - Error deleting employee:', err);
            setError(err.message || 'Failed to delete employee');
             setLoading(false);
            throw err;
        }
    }, [fetchEmployees, mountedRef]);

    const getEmployeeStats = useCallback(async () => {
        if (!mountedRef.current) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await requestQueue.add(() => employeeApi.getStats());
            
            if (!mountedRef.current) return;
            
            return response;
        } catch (err) {
            if (!mountedRef.current) return;

            setError('Failed to fetch employee statistics');
            console.error('Error fetching employee statistics:', err);
            throw err;
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    console.log('useEmployees: Returning hook state - loading:', loading, 'employees count:', employees.length);

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeStats
    };
}; 