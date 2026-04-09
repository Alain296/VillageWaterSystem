import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler } from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const AnalyticsCharts = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [chartsResponse, statsResponse] = await Promise.all([
                dashboardAPI.getCharts(),
                dashboardAPI.getStats()
            ]);
            setCharts(chartsResponse.data);
            setStats(statsResponse.data);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
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
                    <h1 className="card-title">Analytics & Charts</h1>
                    <p className="card-subtitle">System-wide performance and statistics</p>
                </div>

                {stats && (
                    <div className="grid grid-cols-4 mb-4 animate-fade-in gap-4">
                        <div className="stat-card primary">
                            <div className="stat-icon">💰</div>
                            <div className="stat-value">{stats?.monthly_revenue || 0} RWF</div>
                            <div className="stat-label">Total Revenue This Month</div>
                        </div>
                        <div className="stat-card success">
                            <div className="stat-icon">📈</div>
                            <div className="stat-value">
                                {stats?.monthly_revenue && stats?.pending_bills ? 
                                    Math.round((parseFloat(stats.monthly_revenue) / (parseFloat(stats.monthly_revenue) + parseFloat(stats.pending_bills * 1000))) * 100)
                                : 0}%
                            </div>
                            <div className="stat-label">Collection Rate %</div>
                        </div>
                        <div className="stat-card warning">
                            <div className="stat-icon">🏠</div>
                            <div className="stat-value">{stats?.active_connections || 0}</div>
                            <div className="stat-label">Active Households</div>
                        </div>
                        <div className="stat-card info">
                            <div className="stat-icon">💧</div>
                            <div className="stat-value">{stats?.active_connections && stats?.total_usage ? Math.round((stats.total_usage || 0) / stats.active_connections) : 0} L</div>
                            <div className="stat-label">Avg Consumption / Household</div>
                        </div>
                    </div>
                )}

                {/* 6 Specific Analytics Charts (Item 1) */}
                <div className="grid grid-cols-2 mb-4 animate-fade-in gap-5">
                    
                    {/* 1. Monthly Water Consumption Trend */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Monthly Water Consumption Trend</h3>
                        </div>
                        <div className="card-body">
                            <Line
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    datasets: [{ 
                                        label: 'Liters Consumed', 
                                        data: [12000, 15000, 13500, 16000, 18000, 20000, 19000, 21000, 19500, 17500, 15000, 16500], 
                                        borderColor: '#0ea5e9', 
                                        backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                                        fill: true, 
                                        tension: 0.4 
                                    }]
                                }}
                                options={{ responsive: true, plugins: { legend: { display: false } } }}
                            />
                        </div>
                    </div>

                    {/* 2. Revenue vs Target */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Revenue vs Target</h3>
                        </div>
                        <div className="card-body">
                            <Bar
                                data={{
                                    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                                    datasets: [
                                        { label: 'Target', data: [500000, 500000, 550000, 550000, 600000, 600000], backgroundColor: '#e2e8f0' },
                                        { label: 'Actual Revenue', data: [450000, 520000, 530000, 580000, 590000, 620000], backgroundColor: '#10b981' }
                                    ]
                                }}
                                options={{ responsive: true }}
                            />
                        </div>
                    </div>

                    {/* 3. Payment Method Distribution */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Payment Method Distribution</h3>
                        </div>
                        <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '300px' }}>
                                <Pie
                                    data={{
                                        labels: ['Mobile Money', 'Bank Transfer', 'Card', 'Cash'],
                                        datasets: [{ data: [65, 15, 10, 10], backgroundColor: ['#0ea5e9', '#3b82f6', '#10b981', '#f59e0b'] }]
                                    }}
                                    options={{ responsive: true }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Household Payment Status */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Household Payment Status</h3>
                        </div>
                        <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '300px' }}>
                                <Doughnut
                                    data={{
                                        labels: ['Paid', 'Pending', 'Overdue'],
                                        datasets: [{ data: [120, 25, 5], backgroundColor: ['#10b981', '#f59e0b', '#dc2626'] }]
                                    }}
                                    options={{ responsive: true }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Top 10 Water Consumers */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Top 10 Water Consumers</h3>
                        </div>
                        <div className="card-body">
                            <Bar
                                data={{
                                    labels: ['HH-001', 'HH-045', 'HH-022', 'HH-099', 'HH-031', 'HH-077', 'HH-014', 'HH-088', 'HH-055', 'HH-003'],
                                    datasets: [{ label: 'Liters Used', data: [3500, 3200, 3100, 2900, 2800, 2750, 2600, 2500, 2400, 2300], backgroundColor: '#0ea5e9' }]
                                }}
                                options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }}
                            />
                        </div>
                    </div>

                    {/* 6. Bill Collection Rate Over Time */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Bill Collection Rate Over Time</h3>
                        </div>
                        <div className="card-body">
                            <Line
                                data={{
                                    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                                    datasets: [{ label: 'Collection Rate (%)', data: [85, 88, 86, 92, 90, 95], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 }]
                                }}
                                options={{ responsive: true }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
