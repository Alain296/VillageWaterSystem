/**
 * Dashboard Component - Role-based dashboard with statistics and charts
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, billsAPI, paymentsAPI, usageAPI, householdsAPI, tariffsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard = () => {
    const { user, isManagerOrAdmin } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentBills, setRecentBills] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // For household users, fetch only their data
            if (user?.role === 'Household') {
                // Fetch household-specific data
                const billsResponse = await billsAPI.getAll({ page_size: 5 });
                const bills = billsResponse.data.results || billsResponse.data;
                setRecentBills(bills);

                const paymentsResponse = await paymentsAPI.getAll({ page_size: 5 });
                const payments = paymentsResponse.data.results || paymentsResponse.data;
                setRecentPayments(payments);

                const usageResponse = await usageAPI.getAll({ page_size: 5 });
                const usage = usageResponse.data.results || usageResponse.data;

                // Calculate household-specific stats
                const pendingBillsObj = bills.filter(bill => bill.status === 'Pending' || bill.status === 'Overdue');
                const totalDue = pendingBillsObj.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);
                const nextBillingDate = bills.length > 0 && bills[0].due_date ? bills[0].due_date : 'Next Month';
                const status = pendingBillsObj.length > 0 ? (pendingBillsObj.some(b => b.status === 'Overdue') ? 'Overdue' : 'Pending') : 'Paid';

                setStats({
                    minimum_due: totalDue.toFixed(2),
                    recent_usage: usage.length > 0 ? usage[0].liters_consumed || usage[0].liters_used || 0 : 0,
                    next_billing_date: nextBillingDate,
                    status: status
                });
            } else {
                // Admin/Manager view - fetch system-wide stats
                const statsResponse = await dashboardAPI.getStats();
                setStats(statsResponse.data);

                // Charts moved to Analytics page

                // Fetch recent data
                const billsResponse = await billsAPI.getAll({ page_size: 5 });
                setRecentBills(billsResponse.data.results || billsResponse.data);

                const paymentsResponse = await paymentsAPI.getAll({ page_size: 5 });
                setRecentPayments(paymentsResponse.data.results || paymentsResponse.data);

                const usageResponse = await usageAPI.getAll({ page_size: 5 });
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            let errorMessage = 'Failed to load dashboard data';

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.error || error.response.data?.detail || errorMessage;
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'Cannot connect to server. Please check if the backend is running.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'Active': 'badge-success',
            'Pending': 'badge-warning',
            'Paid': 'badge-success',
            'Overdue': 'badge-danger',
            'Completed': 'badge-success',
            'Failed': 'badge-danger',
        };
        return `badge ${statusMap[status] || 'badge-info'}`;
    };

    const handleDownload = async (apiFunc, filename) => {
        try {
            const response = await apiFunc();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Report downloaded successfully');
        } catch (error) {
            console.error('Error downloading report:', error);
            toast.error('Failed to download report');
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="mb-4">
                    <h1 className="card-title">Dashboard</h1>
                    <p className="card-subtitle">Welcome back, {user?.full_name}!</p>
                </div>

                {/* Statistics Cards */}
                {user?.role === 'Household' ? (
                    // Household-specific stats
                    <div className="grid grid-cols-4 mb-4 animate-fade-in">
                        <div className="stat-card warning">
                            <div className="stat-icon">💰</div>
                            <div className="stat-value">{stats?.minimum_due || 0} RWF</div>
                            <div className="stat-label">Current Minimum Due</div>
                        </div>

                        <div className="stat-card info">
                            <div className="stat-icon">💧</div>
                            <div className="stat-value">{stats?.recent_usage || 0} L</div>
                            <div className="stat-label">Recent Water Usage</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '0.8rem' }}>{stats?.next_billing_date || '-'}</div>
                            <div className="stat-label">Next Billing Date</div>
                        </div>

                        <div className={`stat-card ${stats?.status === 'Overdue' ? 'danger' : stats?.status === 'Paid' ? 'success' : 'warning'}`}>
                            <div className="stat-icon">{stats?.status === 'Overdue' ? '⚠️' : '✓'}</div>
                            <div className="stat-value" style={{ fontSize: '1.8rem', marginTop: '0.6rem' }}>{stats?.status || '-'}</div>
                            <div className="stat-label">Status</div>
                        </div>
                    </div>
                ) : (
                    // Admin/Manager stats
                    <div className="grid grid-cols-4 mb-4 animate-fade-in">
                        <div className="stat-card">
                            <div className="stat-icon">🏠</div>
                            <div className="stat-value">{stats?.total_households || 0}</div>
                            <div className="stat-label">Total Households</div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-icon">✓</div>
                            <div className="stat-value">{stats?.active_connections || 0}</div>
                            <div className="stat-label">Active Connections</div>
                        </div>

                        <div className="stat-card warning">
                            <div className="stat-icon">💰</div>
                            <div className="stat-value">{stats?.monthly_revenue || 0} RWF</div>
                            <div className="stat-label">Monthly Revenue</div>
                        </div>

                        <div className="stat-card danger">
                            <div className="stat-icon">📄</div>
                            <div className="stat-value">{stats?.pending_bills || 0}</div>
                            <div className="stat-label">Pending Bills</div>
                        </div>
                    </div>
                )}

                {/* Reports Section - Admin/Manager Only */}
                {isManagerOrAdmin && (
                    <div className="card mb-4 animate-fade-in">
                        <div className="card-header">
                            <h3 className="card-title">Reports</h3>
                            <p className="card-subtitle">Download system reports in CSV or PDF format</p>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Registered Households */}
                                <div className="report-item">
                                    <h4 className="text-lg font-semibold mb-2">📋 Registered Households</h4>
                                    <p className="text-sm text-gray-600 mb-3">Complete list of all registered households with details</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(householdsAPI.exportCSV, 'households.csv')}
                                        >
                                            📊 Download CSV
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownload(householdsAPI.exportPDF, 'households.pdf')}
                                        >
                                            📄 Download PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Bills Report */}
                                <div className="report-item">
                                    <h4 className="text-lg font-semibold mb-2">💰 Bills Report</h4>
                                    <p className="text-sm text-gray-600 mb-3">All bills with amounts, status, and billing periods</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(billsAPI.exportCSV, 'bills.csv')}
                                        >
                                            📊 Download CSV
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownload(billsAPI.exportPDF, 'bills.pdf')}
                                        >
                                            📄 Download PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Water Usage Report */}
                                <div className="report-item">
                                    <h4 className="text-lg font-semibold mb-2">💧 Water Usage Report</h4>
                                    <p className="text-sm text-gray-600 mb-3">Water consumption records with meter readings</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(usageAPI.exportCSV, 'water_usage.csv')}
                                        >
                                            📊 Download CSV
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownload(usageAPI.exportPDF, 'water_usage.pdf')}
                                        >
                                            📄 Download PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Payments Report */}
                                <div className="report-item">
                                    <h4 className="text-lg font-semibold mb-2">💳 Payments Report</h4>
                                    <p className="text-sm text-gray-600 mb-3">Financial transactions and payment history</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(paymentsAPI.exportCSV, 'payments.csv')}
                                        >
                                            📊 Download CSV
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownload(paymentsAPI.exportPDF, 'payments.pdf')}
                                        >
                                            📄 Download PDF
                                        </button>
                                    </div>
                                </div>

                                {/* Tariff Rates Report */}
                                <div className="report-item">
                                    <h4 className="text-lg font-semibold mb-2">📈 Tariff Rates Report</h4>
                                    <p className="text-sm text-gray-600 mb-3">Current and historical tariff rate information</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(tariffsAPI.exportCSV, 'tariff_rates.csv')}
                                        >
                                            📊 Download CSV
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDownload(tariffsAPI.exportPDF, 'tariff_rates.pdf')}
                                        >
                                            📄 Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Recent Activity */}
                <div className="grid grid-cols-2 animate-fade-in">
                    {/* Recent Bills */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Bills</h3>
                        </div>
                        <div className="card-body">
                            {recentBills.length > 0 ? (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Bill Number</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                {user?.role === 'Household' && <th>Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentBills.map((bill) => (
                                                <tr key={bill.bill_id}>
                                                    <td>{bill.bill_number}</td>
                                                    <td>{bill.total_amount} RWF</td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(bill.status)}>
                                                            {bill.status}
                                                        </span>
                                                    </td>
                                                    {user?.role === 'Household' && (
                                                        <td>
                                                        {(bill.status === 'Pending' || bill.status === 'Overdue') && (
                                                            <button 
                                                                className="btn btn-sm btn-success" 
                                                                onClick={() => navigate('/payments', { state: { prefillBillId: bill.bill_id, prefillAmount: bill.total_amount } })}
                                                            >
                                                                💳 Quick Pay
                                                            </button>
                                                        )}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">📄</div>
                                    <p className="empty-message">No bills yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Payments</h3>
                        </div>
                        <div className="card-body">
                            {recentPayments.length > 0 ? (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Receipt</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentPayments.map((payment) => (
                                                <tr key={payment.payment_id}>
                                                    <td>{payment.receipt_number}</td>
                                                    <td>{payment.amount_paid} RWF</td>
                                                    <td>{payment.payment_method}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">💰</div>
                                    <p className="empty-message">No payments yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
