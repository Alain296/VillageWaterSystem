import React, { useState, useEffect } from 'react';
import { smsAPI } from '../services/api';
import { toast } from 'react-toastify';

const SMSLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await smsAPI.getAll();
            setLogs(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching SMS logs:', error);
            toast.error('Failed to load SMS logs');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        return status === 'Sent' ? 'badge badge-success' : 'badge badge-danger';
    };

    const filteredLogs = filter === 'All'
        ? logs
        : logs.filter(log => log.notification_type === filter);

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
                <div className="card mb-4">
                    <div className="card-header flex justify-between items-center">
                        <div>
                            <h1 className="card-title">SMS Logs</h1>
                            <p className="card-subtitle">History of sent SMS notifications</p>
                        </div>
                        <button onClick={fetchLogs} className="btn btn-secondary">
                            🔄 Refresh
                        </button>
                    </div>

                    <div className="card-body">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 mb-4">
                            {['All', 'Bill Generated', 'Payment Confirmation'].map(type => (
                                <button
                                    key={type}
                                    className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setFilter(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {filteredLogs.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Type</th>
                                            <th>Phone Number</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.map((log) => (
                                            <tr key={log.sms_id}>
                                                <td>{new Date(log.sent_at).toLocaleString()}</td>
                                                <td>
                                                    <span className="font-semibold">{log.notification_type}</span>
                                                </td>
                                                <td>{log.phone_number}</td>
                                                <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                                                    {log.message}
                                                </td>
                                                <td>
                                                    <span className={getStatusBadge(log.status)}>
                                                        {log.status}
                                                    </span>
                                                    {log.error_message && (
                                                        <div className="text-xs text-red-500 mt-1">
                                                            {log.error_message}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📱</div>
                                <p className="empty-message">No SMS logs found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SMSLogs;
