/**
 * API Service - Axios configuration and API calls
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ============================================
// Authentication API
// ============================================
export const authAPI = {
    register: (data) => api.post('/auth/register/', data),
    login: (data) => api.post('/auth/login/', data),
    logout: (refreshToken) => api.post('/auth/logout/', { refresh_token: refreshToken }),
    getUser: () => api.get('/auth/user/'),
    changePassword: (data) => api.post('/users/change_password/', data),
};

// ============================================
// Users API
// ============================================
export const usersAPI = {
    getAll: (params) => api.get('/users/', { params }),
    getById: (id) => api.get(`/users/${id}/`),
    create: (data) => api.post('/users/', data),
    update: (id, data) => api.put(`/users/${id}/`, data),
    delete: (id) => api.delete(`/users/${id}/`),
};

// ============================================
// Households API
// ============================================
export const householdsAPI = {
    getAll: (params) => api.get('/households/', { params }),
    getById: (id) => api.get(`/households/${id}/`),
    create: (data) => api.post('/households/', data),
    update: (id, data) => api.put(`/households/${id}/`, data),
    delete: (id) => api.delete(`/households/${id}/`),
    exportCSV: () => api.get('/households/export_csv/', { responseType: 'blob' }),
    exportPDF: () => api.get('/households/export_pdf/', { responseType: 'blob' }),
};

// ============================================
// Tariff Rates API
// ============================================
export const tariffsAPI = {
    getAll: (params) => api.get('/tariffs/', { params }),
    getById: (id) => api.get(`/tariffs/${id}/`),
    create: (data) => api.post('/tariffs/', data),
    update: (id, data) => api.put(`/tariffs/${id}/`, data),
    delete: (id) => api.delete(`/tariffs/${id}/`),
    exportCSV: () => api.get('/tariffs/export_csv/', { responseType: 'blob' }),
    exportPDF: () => api.get('/tariffs/export_pdf/', { responseType: 'blob' }),
};

// ============================================
// Water Usage API
// ============================================
export const usageAPI = {
    getAll: (params) => api.get('/usage/', { params }),
    getById: (id) => api.get(`/usage/${id}/`),
    create: (data) => api.post('/usage/', data),
    update: (id, data) => api.put(`/usage/${id}/`, data),
    delete: (id) => api.delete(`/usage/${id}/`),
    exportCSV: () => api.get('/usage/export_csv/', { responseType: 'blob' }),
    exportPDF: () => api.get('/usage/export_pdf/', { responseType: 'blob' }),
};

// ============================================
// Bills API
// ============================================
export const billsAPI = {
    getAll: (params) => api.get('/bills/', { params }),
    getById: (id) => api.get(`/bills/${id}/`),
    create: (data) => api.post('/bills/', data),
    update: (id, data) => api.put(`/bills/${id}/`, data),
    delete: (id) => api.delete(`/bills/${id}/`),
    generateBills: (data) => api.post('/bills/generate_bills/', data),
    exportCSV: () => api.get('/bills/export_csv/', { responseType: 'blob' }),
    exportPDF: () => api.get('/bills/export_pdf/', { responseType: 'blob' }),
};

// ============================================
// Payments API
// ============================================
export const paymentsAPI = {
    getAll: (params) => api.get('/payments/', { params }),
    getById: (id) => api.get(`/payments/${id}/`),
    create: (data) => api.post('/payments/', data),
    update: (id, data) => api.put(`/payments/${id}/`, data),
    delete: (id) => api.delete(`/payments/${id}/`),
    exportCSV: () => api.get('/payments/export_csv/', { responseType: 'blob' }),
    exportPDF: () => api.get('/payments/export_pdf/', { responseType: 'blob' }),
    downloadReceipt: (id) => api.get(`/payments/${id}/download_receipt/`, { responseType: 'blob' }),
};

// ============================================
// SMS API
// ============================================
export const smsAPI = {
    getAll: (params) => api.get('/sms/', { params }),
    getAll: (params) => api.get('/sms/', { params }),
};

// ============================================
// Notification API
// ============================================
export const notificationsAPI = {
    getAll: (params) => api.get('/notifications/', { params }),
    getUnreadCount: () => api.get('/notifications/unread_count/'),
    markRead: (id) => api.post(`/notifications/${id}/mark_read/`),
    markAllRead: () => api.post('/notifications/mark_all_read/'),
};

// ============================================
// Dashboard API
// ============================================
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats/'),
    getCharts: () => api.get('/dashboard/charts/'),
};

export default api;
