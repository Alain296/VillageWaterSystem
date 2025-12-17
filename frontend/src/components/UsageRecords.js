/**
 * Water Usage Records Component
 */
import React, { useState, useEffect } from 'react';
import { usageAPI, householdsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UsageRecords = () => {
    const { isManagerOrAdmin, user } = useAuth();
    const [usageRecords, setUsageRecords] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        household: '',
        previous_reading: 0,
        current_reading: 0,
        reading_date: new Date().toISOString().split('T')[0],
        reading_month: new Date().toISOString().slice(0, 7),
        status: 'Pending',
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-select household for household users
    useEffect(() => {
        if (showModal && user?.role === 'Household' && households.length > 0) {
            // Find logic to match if backend provides household_id
            // Since API filters list to 1, we can pick the first one
            if (households.length === 1) {
                setFormData(prev => ({ ...prev, household: households[0].household_id }));
            } else if (user.household_id) {
                setFormData(prev => ({ ...prev, household: user.household_id }));
            }
        }
    }, [showModal, user, households]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usageResponse, householdsResponse] = await Promise.all([
                usageAPI.getAll(),
                householdsAPI.getAll({ status: 'Active' }),
            ]);
            setUsageRecords(usageResponse.data.results || usageResponse.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out read-only household from formData if needed, but backend handles it
            if (editingRecord) {
                await usageAPI.update(editingRecord.usage_id, formData);
                toast.success('Usage record updated successfully');
            } else {
                await usageAPI.create(formData);
                toast.success('Usage record created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Operation failed:', error);
            if (error.response?.data) {
                const data = error.response.data;
                // Handle non-field errors (like unique constraints)
                if (data.non_field_errors) {
                    if (data.non_field_errors[0].includes('unique set')) {
                        toast.error('A usage record already exists for this household in this month.');
                    } else {
                        toast.error(data.non_field_errors[0]);
                    }
                }
                // Handle field-specific errors
                else if (data.household) {
                    toast.error(`Household: ${data.household[0]}`);
                } else if (data.reading_month) {
                    toast.error(data.reading_month[0] || data.reading_month.join(' ')); // Handle array or string
                } else {
                    // Fallback to displaying the first error found
                    const firstError = Object.values(data)[0];
                    toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
                }
            } else {
                toast.error('Operation failed. Please try again.');
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            household: record.household,
            previous_reading: record.previous_reading,
            current_reading: record.current_reading,
            reading_date: record.reading_date,
            reading_month: record.reading_month,
            status: record.status,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await usageAPI.delete(id);
                toast.success('Record deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete record');
            }
        }
    };

    const resetForm = () => {
        setEditingRecord(null);
        setFormData({
            household: '',
            previous_reading: 0,
            current_reading: 0,
            reading_date: new Date().toISOString().split('T')[0],
            reading_month: new Date().toISOString().slice(0, 7),
            status: 'Pending',
        });
    };

    return (
        <div className="page">
            <div className="container">
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title">Water Usage Records</h2>
                                <p className="card-subtitle">Track water meter readings</p>
                            </div>
                            {(isManagerOrAdmin || user?.role === 'Household') && (
                                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                                    + Record Usage
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center"><div className="spinner"></div></div>
                        ) : usageRecords.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Household</th>
                                            <th>Previous</th>
                                            <th>Current</th>
                                            <th>Liters Used</th>
                                            <th>Month</th>
                                            <th>Status</th>
                                            {isManagerOrAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usageRecords.map((record) => (
                                            <tr key={record.usage_id}>
                                                <td><strong>{record.household_code}</strong></td>
                                                <td>{record.previous_reading}</td>
                                                <td>{record.current_reading}</td>
                                                <td><strong>{record.liters_used} L</strong></td>
                                                <td>{record.reading_month}</td>
                                                <td><span className={`badge badge-${record.status === 'Billed' ? 'success' : 'warning'}`}>{record.status}</span></td>
                                                {isManagerOrAdmin && (
                                                    <td>
                                                        <button className="btn btn-sm btn-outline mr-1" onClick={() => handleEdit(record)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(record.usage_id)}>Delete</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">💧</div>
                                <h3 className="empty-title">No usage records found</h3>
                                <p className="empty-message">Start by recording water usage</p>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">{editingRecord ? 'Edit Usage Record' : 'Record Water Usage'}</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label required">Household</label>
                                        <select
                                            className="form-select"
                                            value={formData.household}
                                            onChange={(e) => setFormData({ ...formData, household: e.target.value })}
                                            required
                                            disabled={user?.role === 'Household'} // Lock for household users
                                        >
                                            <option value="">Select Household</option>
                                            {households.map((h) => (
                                                <option key={h.household_id} value={h.household_id}>{h.household_code} - {h.household_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="form-group">
                                            <label className="form-label required">Previous Reading</label>
                                            <input type="number" step="0.01" className="form-input" value={formData.previous_reading} onChange={(e) => setFormData({ ...formData, previous_reading: parseFloat(e.target.value) })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Current Reading</label>
                                            <input type="number" step="0.01" className="form-input" value={formData.current_reading} onChange={(e) => setFormData({ ...formData, current_reading: parseFloat(e.target.value) })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Reading Date</label>
                                            <input type="date" className="form-input" value={formData.reading_date} onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Reading Month</label>
                                            <input type="month" className="form-input" value={formData.reading_month} onChange={(e) => setFormData({ ...formData, reading_month: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                            <option value="Pending">Pending</option>
                                            <option value="Verified">Verified</option>
                                            <option value="Billed">Billed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingRecord ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsageRecords;
