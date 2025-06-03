import { useState, useCallback, useEffect } from 'react';

interface AuditLogEntry {
    id: string;
    action: string;
    entityType: 'employee' | 'payroll' | 'deduction' | 'report';
    entityId: string;
    changes: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    performedBy: string;
    timestamp: string;
    ipAddress: string;
}

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    details?: string;
    timestamp: string;
    read: boolean;
}

interface AuditLogFilters {
    startDate?: string;
    endDate?: string;
    entityType?: string;
    performedBy?: string;
    action?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuditLog = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    const fetchAuditLogs = useCallback(async (filters?: AuditLogFilters) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (filters?.startDate) queryParams.append('start_date', filters.startDate);
            if (filters?.endDate) queryParams.append('end_date', filters.endDate);
            if (filters?.entityType) queryParams.append('entity_type', filters.entityType);
            if (filters?.performedBy) queryParams.append('performed_by', filters.performedBy);
            if (filters?.action) queryParams.append('action', filters.action);

            const response = await fetch(`${API_URL}/audit-logs?${queryParams}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setAuditLogs(data.data);
            return data.data as AuditLogEntry[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching audit logs');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/notifications`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setNotifications(data.data);
            setUnreadCount(data.data.filter((n: Notification) => !n.read).length);
            return data.data as Notification[];
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching notifications');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        try {
            const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error marking notification as read');
            throw err;
        }
    }, []);

    const markAllNotificationsAsRead = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            }

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error marking all notifications as read');
            throw err;
        }
    }, []);

    // Set up WebSocket connection for real-time notifications
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const ws = new WebSocket(`${API_URL.replace('http', 'ws')}/notifications/ws?token=${token}`);

        ws.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return {
        auditLogs,
        notifications,
        unreadCount,
        loading,
        error,
        fetchAuditLogs,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    };
}; 