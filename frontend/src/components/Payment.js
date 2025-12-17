/**
 * Payment Component
 */
import React, { useState, useEffect } from 'react';
import { paymentsAPI, billsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Payment = () => {
    const { isManagerOrAdmin } = useAuth();
    const [payments, setPayments] = useState([]);
    const [pendingBills, setPendingBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [formData, setFormData] = useState({
        bill: '',
        amount_paid: '',
        payment_method: 'Cash',
        transaction_reference: '',
        payer_name: '',
        payer_phone: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentsResponse, billsResponse] = await Promise.all([
                paymentsAPI.getAll(),
                billsAPI.getAll({ status: 'Pending' }),
            ]);
            setPayments(paymentsResponse.data.results || paymentsResponse.data);
            setPendingBills(billsResponse.data.results || billsResponse.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!confirmationStep) {
            setConfirmationStep(true);
            return;
        }

        try {
            // Ensure payment_date and payment_time are set
            const today = new Date();
            const payload = {
                ...formData,
                payment_date: formData.payment_date || today.toISOString().split('T')[0],
                payment_time: formData.payment_time || today.toTimeString().split(' ')[0].substring(0, 5)
            };

            await paymentsAPI.create(payload);
            toast.success('Payment recorded successfully');
            setShowModal(false);
            setConfirmationStep(false);
            resetForm();
            fetchData();
        } catch (error) {
            const errorMsg = error.response?.data || 'Payment failed';
            toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
    };

    const resetForm = () => {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);

        setFormData({
            bill: '',
            amount_paid: '',
            payment_date: dateStr,
            payment_time: timeStr,
            payment_method: 'Cash',
            transaction_reference: '',
            payer_name: '',
            payer_phone: '',
        });
        setConfirmationStep(false);
    };

    return (
        <div className="page">
            <div className="container">
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title">Payments</h2>
                                <p className="card-subtitle">Process and track payments</p>
                            </div>
                            {isManagerOrAdmin && (
                                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                                    + Record Payment
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Unpaid Bills Section - For Household Users */}
                    {!isManagerOrAdmin && pendingBills.length > 0 && (
                        <div className="card-body" style={{ borderBottom: '1px solid #0b2049ff' }}>
                            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>💳 Unpaid Bills</h3>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Bill Number</th>
                                            <th>Period</th>
                                            <th>Amount Due</th>
                                            <th>Due Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingBills.map((bill) => (
                                            <tr key={bill.bill_id}>
                                                <td><strong>{bill.bill_number}</strong></td>
                                                <td>{bill.billing_period}</td>
                                                <td><strong style={{ color: '#dc2626' }}>{bill.total_amount} RWF</strong></td>
                                                <td>{bill.due_date}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                bill: bill.bill_id,
                                                                amount_paid: bill.total_amount,
                                                                payer_name: bill.household_code || '',
                                                                payer_phone: ''
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        Pay Now
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payment History */}
                    <div className="card-body">
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>📋 Payment History</h3>
                        {loading ? (
                            <div className="text-center"><div className="spinner"></div></div>
                        ) : payments.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Receipt</th>
                                            <th>Bill Number</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Date</th>
                                            <th>Payer</th>
                                            {!isManagerOrAdmin && <th>Submitted By</th>}
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment.payment_id}>
                                                <td><strong>{payment.receipt_number}</strong></td>
                                                <td>{payment.bill_number}</td>
                                                <td><strong>{payment.amount_paid} RWF</strong></td>
                                                <td><span className={`badge ${payment.payment_method === 'Mobile Money' ? 'badge-primary' : 'badge-secondary'}`}>{payment.payment_method}</span></td>
                                                <td>{payment.payment_date}</td>
                                                <td>{payment.payer_name}</td>
                                                {!isManagerOrAdmin && (
                                                    <td>
                                                        {payment.submitted_by_name ? (
                                                            <span className="badge badge-info">You</span>
                                                        ) : (
                                                            <span className="badge badge-secondary">Admin</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td><span className={`badge badge-${payment.payment_status === 'Completed' ? 'success' : 'warning'}`}>{payment.payment_status}</span></td>
                                                <td>
                                                    {payment.payment_status === 'Completed' && (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await paymentsAPI.downloadReceipt(payment.payment_id);
                                                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                                                    const link = document.createElement('a');
                                                                    link.href = url;
                                                                    link.setAttribute('download', `Receipt_${payment.receipt_number}.pdf`);
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    link.parentNode.removeChild(link);
                                                                } catch (error) {
                                                                    toast.error('Failed to download receipt');
                                                                }
                                                            }}
                                                            title="Download Receipt"
                                                        >
                                                            📥
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">💰</div>
                                <h3 className="empty-title">No payments found</h3>
                                <p className="empty-message">Record payments for bills</p>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    {confirmationStep ? 'Confirm Payment Details' : (isManagerOrAdmin ? 'Record Payment' : 'Submit Payment')}
                                </h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {!confirmationStep ? (
                                        <>
                                            {isManagerOrAdmin && (
                                                <div className="form-group">
                                                    <label className="form-label required">Bill</label>
                                                    <select className="form-select" value={formData.bill} onChange={(e) => setFormData({ ...formData, bill: e.target.value })} required>
                                                        <option value="">Select Bill</option>
                                                        {pendingBills.map((bill) => (
                                                            <option key={bill.bill_id} value={bill.bill_id}>{bill.bill_number} - {bill.household_code} ({bill.total_amount} RWF)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="form-group">
                                                    <label className="form-label required">Amount Paid</label>
                                                    <input type="number" step="0.01" className="form-input" value={formData.amount_paid} onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label required">Payment Method</label>
                                                    <select className="form-select" value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} required>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Mobile Money">Mobile Money</option>
                                                        <option value="Bank Transfer">Bank Transfer</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Phone Number for Households */}
                                            {!isManagerOrAdmin && (
                                                <div className="form-group">
                                                    <label className="form-label required">Phone Number (For SMS)</label>
                                                    <input
                                                        type="tel"
                                                        className="form-input"
                                                        value={formData.payer_phone}
                                                        onChange={(e) => setFormData({ ...formData, payer_phone: e.target.value })}
                                                        placeholder="e.g 078xxxxxxx"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            {isManagerOrAdmin && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="form-group">
                                                            <label className="form-label required">Payment Date</label>
                                                            <input type="date" className="form-input" value={formData.payment_date} onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label required">Payment Time</label>
                                                            <input type="time" className="form-input" value={formData.payment_time} onChange={(e) => setFormData({ ...formData, payment_time: e.target.value })} required />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="form-group">
                                                            <label className="form-label required">Payer Name</label>
                                                            <input type="text" className="form-input" value={formData.payer_name} onChange={(e) => setFormData({ ...formData, payer_name: e.target.value })} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Payer Phone</label>
                                                            <input type="tel" className="form-input" value={formData.payer_phone} onChange={(e) => setFormData({ ...formData, payer_phone: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div className="form-group">
                                                <label className="form-label">{isManagerOrAdmin ? 'Transaction Reference' : 'Transaction Reference (Optional)'}</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.transaction_reference}
                                                    onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
                                                    placeholder={isManagerOrAdmin ? "For Mobile Money or Bank Transfer" : "Leave blank to auto-generate"}
                                                    required={false}
                                                />
                                                {!isManagerOrAdmin && (
                                                    <span className="form-help">Optional: Enter mobile money transaction ID or leave blank to auto-generate</span>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="confirmation-summary p-4 bg-gray-50 rounded mb-4">
                                            <p className="mb-2"><strong>Bill:</strong> {pendingBills.find(b => b.bill_id === formData.bill)?.bill_number || `Bill #${formData.bill}`}</p>
                                            <p className="mb-2"><strong>Amount:</strong> {formData.amount_paid} RWF</p>
                                            <p className="mb-2"><strong>Method:</strong> {formData.payment_method}</p>
                                            <p className="mb-2"><strong>Phone:</strong> {formData.payer_phone || 'N/A'}</p>
                                            {formData.transaction_reference && <p className="mb-2"><strong>Ref:</strong> {formData.transaction_reference}</p>}
                                            <div className="alert alert-info mt-3">
                                                Click OK to confirm payment. SMS notification will be sent to <strong>{formData.payer_phone}</strong>.
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => confirmationStep ? setConfirmationStep(false) : setShowModal(false)}>
                                        {confirmationStep ? 'Back' : 'Cancel'}
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {confirmationStep ? 'OK' : 'Record Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
