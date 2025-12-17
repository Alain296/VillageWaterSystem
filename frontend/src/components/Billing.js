/**
 * Billing Component
 */
import React, { useState, useEffect } from 'react';
import { billsAPI, householdsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Billing = () => {
    const { isManagerOrAdmin, user } = useAuth();
    const [bills, setBills] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateData, setGenerateData] = useState({
        household_id: '',
        billing_period: new Date().toISOString().slice(0, 7),
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-select household for household users
    useEffect(() => {
        if (showGenerateModal && user?.role === 'Household' && households.length > 0) {
            if (user.household_id) {
                setGenerateData(prev => ({ ...prev, household_id: user.household_id }));
            } else if (households.length === 1) {
                setGenerateData(prev => ({ ...prev, household_id: households[0].household_id }));
            }
        }
    }, [showGenerateModal, user, households]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [billsResponse, householdsResponse] = await Promise.all([
                billsAPI.getAll(),
                householdsAPI.getAll({ status: 'Active' }),
            ]);
            setBills(billsResponse.data.results || billsResponse.data);
            setHouseholds(householdsResponse.data.results || householdsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            let errorMessage = 'Failed to fetch data';

            if (error.response) {
                errorMessage = error.response.data?.error || error.response.data?.detail || errorMessage;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please check if the backend is running.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateBills = async (e) => {
        e.preventDefault();
        try {
            const data = {
                billing_period: generateData.billing_period,
            };
            if (generateData.household_id) {
                data.household_id = generateData.household_id;
            }

            const response = await billsAPI.generateBills(data);
            toast.success(response.data.message);
            if (response.data.errors && response.data.errors.length > 0) {
                response.data.errors.forEach(err => toast.warning(err));
            }
            setShowGenerateModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate bills');
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'Pending': 'badge-warning',
            'Paid': 'badge-success',
            'Overdue': 'badge-danger',
            'Cancelled': 'badge-info',
        };
        return `badge ${statusMap[status] || 'badge-info'}`;
    };

    return (
        <div className="page">
            <div className="container">
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title">Bills</h2>
                                <p className="card-subtitle">Manage water bills</p>
                            </div>
                            {(isManagerOrAdmin || user?.role === 'Household') && (
                                <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
                                    + Generate Bills
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center"><div className="spinner"></div></div>
                        ) : bills.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Bill Number</th>
                                            <th>Household</th>
                                            <th>Period</th>
                                            <th>Liters</th>
                                            <th>Tariff Rate</th>
                                            <th>Amount</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.map((bill) => (
                                            <tr key={bill.bill_id}>
                                                <td><strong>{bill.bill_number}</strong></td>
                                                <td>{bill.household_code}</td>
                                                <td>{bill.billing_period}</td>
                                                <td>{bill.liters_consumed} L</td>
                                                <td>{bill.rate_applied ? `${parseFloat(bill.rate_applied).toFixed(2)} RWF` : 'N/A'}</td>
                                                <td><strong>{bill.total_amount} RWF</strong></td>
                                                <td>{bill.due_date}</td>
                                                <td><span className={getStatusBadgeClass(bill.status)}>{bill.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">📄</div>
                                <h3 className="empty-title">No bills found</h3>
                                <p className="empty-message">Generate bills for households</p>
                            </div>
                        )}
                    </div>
                </div>

                {showGenerateModal && (
                    <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">Generate Bills</h3>
                                <button className="modal-close" onClick={() => setShowGenerateModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleGenerateBills}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label required">Billing Period</label>
                                        <input type="month" className="form-input" value={generateData.billing_period} onChange={(e) => setGenerateData({ ...generateData, billing_period: e.target.value })} required />
                                        <span className="form-help">Select the month for billing</span>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Household {user?.role !== 'Household' && '(Optional)'}</label>
                                        <select
                                            className="form-select"
                                            value={generateData.household_id}
                                            onChange={(e) => setGenerateData({ ...generateData, household_id: e.target.value })}
                                            disabled={user?.role === 'Household'}
                                            required={user?.role === 'Household'}
                                        >
                                            {user?.role !== 'Household' && <option value="">All Active Households</option>}
                                            {households.map((h) => (
                                                <option key={h.household_id} value={h.household_id}>{h.household_code} - {h.household_name}</option>
                                            ))}
                                        </select>
                                        {user?.role !== 'Household' && <span className="form-help">Leave empty to generate for all households</span>}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Generate</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Billing;
