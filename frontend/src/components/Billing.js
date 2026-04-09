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

    const handlePrintReceipt = (bill) => {
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
            <title>Water Bill Receipt - ${bill.bill_number}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #0f172a; }
                .header { text-align: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 24px; }
                .logo { font-size: 2.5rem; }
                .system-name { font-size: 1.4rem; font-weight: bold; color: #0ea5e9; }
                .receipt-title { font-size: 1rem; color: #475569; margin-top: 4px; }
                .section { margin-bottom: 20px; }
                .section-title { font-weight: bold; color: #0ea5e9; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; }
                .label { color: #475569; }
                .value { font-weight: 600; }
                .total-row { background: #e0f2fe; padding: 12px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; display: flex; justify-content: space-between; margin-top: 12px; }
                .status-paid { color: #10b981; font-weight: bold; }
                .status-pending { color: #f59e0b; font-weight: bold; }
                .footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #94a3b8; }
                .print-btn { display: block; margin: 24px auto; padding: 10px 24px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
                @media print { .print-btn { display: none; } }
            </style>
            </head>
            <body>
            <div class="header">
                <div class="logo">💧</div>
                <div class="system-name">Village Water Management System</div>
                <div class="receipt-title">Official Water Bill Receipt</div>
            </div>

            <div class="section">
                <div class="section-title">Receipt Information</div>
                <div class="row"><span class="label">Receipt No.</span><span class="value">#${bill.bill_number}</span></div>
                <div class="row"><span class="label">Due Date</span><span class="value">${bill.due_date || 'N/A'}</span></div>
                <div class="row"><span class="label">Billing Period</span><span class="value">${bill.billing_period || 'N/A'}</span></div>
            </div>

            <div class="section">
                <div class="section-title">Household Details</div>
                <div class="row"><span class="label">Household Code</span><span class="value">${bill.household_code || 'N/A'}</span></div>
            </div>

            <div class="section">
                <div class="section-title">Usage & Charges</div>
                <div class="row"><span class="label">Water Consumed</span><span class="value">${bill.liters_consumed || 'N/A'} Liters</span></div>
                <div class="row"><span class="label">Tariff Rate</span><span class="value">${bill.rate_applied ? `${parseFloat(bill.rate_applied).toFixed(2)}` : 'N/A'} RWF/Liter</span></div>
                <div class="total-row"><span>Total Amount Due</span><span>${bill.total_amount || 'N/A'} RWF</span></div>
            </div>

            <div class="section">
                <div class="section-title">Payment Status</div>
                <div class="row"><span class="label">Status</span><span class="value ${bill.status === 'Paid' ? 'status-paid' : 'status-pending'}">${bill.status || 'N/A'}</span></div>
            </div>

            <div class="footer">
                <p>Thank you for using Village Water Management System</p>
                <p>For inquiries contact your local water manager or WASAC</p>
                <p>Generated on ${new Date().toLocaleString()}</p>
            </div>

            <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
            </body>
            </html>
        `);
        receiptWindow.document.close();
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
                                    + Generate Monthly Bills
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
                                            <th>Action</th>
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
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handlePrintReceipt(bill)}
                                                        title="Print / View Receipt"
                                                    >
                                                        📥 Receipt
                                                    </button>
                                                </td>
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
                                <h3 className="modal-title">Generate Monthly Bills</h3>
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
