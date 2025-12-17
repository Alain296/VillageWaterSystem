/**
 * Tariff Rates Component - Manage water tariff rates
 */
import React, { useState, useEffect } from 'react';
import { tariffsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TariffRates = () => {
    const { isManagerOrAdmin } = useAuth();
    const [tariffs, setTariffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTariff, setEditingTariff] = useState(null);
    const [formData, setFormData] = useState({
        rate_per_liter: '',
        rate_name: '',
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
        is_active: true,
    });

    useEffect(() => {
        fetchTariffs();
    }, []);

    const fetchTariffs = async () => {
        try {
            setLoading(true);
            const response = await tariffsAPI.getAll();
            setTariffs(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching tariffs:', error);
            toast.error('Failed to fetch tariff rates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                effective_to: formData.effective_to || null,
            };

            if (editingTariff) {
                await tariffsAPI.update(editingTariff.tariff_id, submitData);
                toast.success('Tariff rate updated successfully');
            } else {
                await tariffsAPI.create(submitData);
                toast.success('Tariff rate created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchTariffs();
        } catch (error) {
            const errorMsg = error.response?.data || 'Operation failed';
            toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
    };

    const handleEdit = (tariff) => {
        setEditingTariff(tariff);
        setFormData({
            rate_per_liter: tariff.rate_per_liter,
            rate_name: tariff.rate_name || '',
            effective_from: tariff.effective_from,
            effective_to: tariff.effective_to || '',
            is_active: tariff.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tariff rate?')) {
            try {
                await tariffsAPI.delete(id);
                toast.success('Tariff rate deleted successfully');
                fetchTariffs();
            } catch (error) {
                toast.error('Failed to delete tariff rate');
            }
        }
    };

    const resetForm = () => {
        setEditingTariff(null);
        setFormData({
            rate_per_liter: '',
            rate_name: '',
            effective_from: new Date().toISOString().split('T')[0],
            effective_to: '',
            is_active: true,
        });
    };

    return (
        <div className="page">
            <div className="container">
                <div className="card animate-fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="card-title">Tariff Rates</h2>
                                <p className="card-subtitle">
                                    {isManagerOrAdmin ? 'Manage water billing rates' : 'View current water billing rates'}
                                </p>
                            </div>
                            {isManagerOrAdmin && (
                                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                                    + Add Tariff Rate
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <div className="text-center"><div className="spinner"></div></div>
                        ) : tariffs.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Rate (RWF/L)</th>
                                            <th>Rate Name</th>
                                            <th>Effective From</th>
                                            <th>Effective To</th>
                                            <th>Status</th>
                                            {isManagerOrAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tariffs.map((tariff) => (
                                            <tr key={tariff.tariff_id}>
                                                <td><strong>{parseFloat(tariff.rate_per_liter).toFixed(2)} RWF</strong></td>
                                                <td>{tariff.rate_name || 'N/A'}</td>
                                                <td>{tariff.effective_from}</td>
                                                <td>{tariff.effective_to || 'Ongoing'}</td>
                                                <td>
                                                    <span className={`badge ${tariff.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                        {tariff.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                {isManagerOrAdmin && (
                                                    <td>
                                                        <button className="btn btn-sm btn-outline mr-1" onClick={() => handleEdit(tariff)}>Edit</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tariff.tariff_id)}>Delete</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">💰</div>
                                <h3 className="empty-title">No tariff rates found</h3>
                                <p className="empty-message">Start by adding a new tariff rate</p>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">{editingTariff ? 'Edit Tariff Rate' : 'Add New Tariff Rate'}</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label required">Rate per Liter (RWF)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.rate_per_liter}
                                            onChange={(e) => setFormData({ ...formData, rate_per_liter: e.target.value })}
                                            required
                                        />
                                        <span className="form-help">Enter the rate in Rwandan Francs per liter</span>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Rate Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.rate_name}
                                            onChange={(e) => setFormData({ ...formData, rate_name: e.target.value })}
                                            placeholder="e.g., Standard Rate 2025"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="form-group">
                                            <label className="form-label required">Effective From</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formData.effective_from}
                                                onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Effective To</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formData.effective_to}
                                                onChange={(e) => setFormData({ ...formData, effective_to: e.target.value })}
                                            />
                                            <span className="form-help">Leave empty for ongoing</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <span>Active (Only one tariff should be active at a time)</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingTariff ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TariffRates;
