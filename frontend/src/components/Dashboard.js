/**
 * Dashboard Component - Role-based dashboard with statistics and charts
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, billsAPI, paymentsAPI, usageAPI, householdsAPI, tariffsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard = () => {
    const { user, isManagerOrAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [recentBills, setRecentBills] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [recentUsage, setRecentUsage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
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
                setRecentUsage(usage);

                // Calculate household-specific stats
                const totalBills = bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);
                const totalPayments = payments.reduce((sum, payment) => sum + parseFloat(payment.amount_paid || 0), 0);
                const pendingBills = bills.filter(bill => bill.status === 'Pending').length;
                const totalUsage = usage.reduce((sum, u) => sum + parseFloat(u.liters_used || 0), 0);

                setStats({
                    total_bills: totalBills.toFixed(2),
                    total_payments: totalPayments.toFixed(2),
                    pending_bills: pendingBills,
                    total_usage: totalUsage.toFixed(2)
                });
            } else {
                // Admin/Manager view - fetch system-wide stats
                const statsResponse = await dashboardAPI.getStats();
                setStats(statsResponse.data);

                // Fetch charts (only for admin/manager)
                if (isManagerOrAdmin) {
                    const chartsResponse = await dashboardAPI.getCharts();
                    setCharts(chartsResponse.data);
                }

                // Fetch recent data
                const billsResponse = await billsAPI.getAll({ page_size: 5 });
                setRecentBills(billsResponse.data.results || billsResponse.data);

                const paymentsResponse = await paymentsAPI.getAll({ page_size: 5 });
                setRecentPayments(paymentsResponse.data.results || paymentsResponse.data);

                const usageResponse = await usageAPI.getAll({ page_size: 5 });
                setRecentUsage(usageResponse.data.results || usageResponse.data);
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
                            <div className="stat-value">{stats?.total_bills || 0} RWF</div>
                            <div className="stat-label">Total Bills</div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-icon">✓</div>
                            <div className="stat-value">{stats?.total_payments || 0} RWF</div>
                            <div className="stat-label">Total Payments</div>
                        </div>

                        <div className="stat-card danger">
                            <div className="stat-icon">📄</div>
                            <div className="stat-value">{stats?.pending_bills || 0}</div>
                            <div className="stat-label">Pending Bills</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">💧</div>
                            <div className="stat-value">{stats?.total_usage || 0} L</div>
                            <div className="stat-label">Water Usage</div>
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

                {/* Charts - Admin/Manager Only */}
                {isManagerOrAdmin && charts && (
                    <div className="grid grid-cols-2 mb-4 animate-fade-in">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Revenue Trend (Last 6 Months)</h3>
                            </div>
                            <div className="card-body">
                                <Line
                                    data={{
                                        labels: charts.revenue_trend?.map(item => item.month) || [],
                                        datasets: [{
                                            label: 'Revenue (RWF)',
                                            data: charts.revenue_trend?.map(item => item.revenue) || [],
                                            borderColor: '#2563eb',
                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                            tension: 0.4,
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Bill Status Distribution</h3>
                            </div>
                            <div className="card-body">
                                <Pie
                                    data={{
                                        labels: charts.bill_status?.map(item => item.status) || [],
                                        datasets: [{
                                            data: charts.bill_status?.map(item => item.count) || [],
                                            backgroundColor: [
                                                '#f59e0b',
                                                '#22c55e',
                                                '#ef4444',
                                                '#94a3b8',
                                            ],
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Consumers - Admin/Manager Only */}
                {isManagerOrAdmin && charts?.top_consumers && (
                    <div className="card mb-4 animate-fade-in">
                        <div className="card-header">
                            <h3 className="card-title">Top 5 Water Consumers</h3>
                        </div>
                        <div className="card-body">
                            <Bar
                                data={{
                                    labels: charts.top_consumers.map(item => item.household_code),
                                    datasets: [{
                                        label: 'Liters Consumed',
                                        data: charts.top_consumers.map(item => item.total_consumption),
                                        backgroundColor: '#10b981',
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
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
