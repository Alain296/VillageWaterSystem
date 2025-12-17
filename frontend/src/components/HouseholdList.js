/**
 * Household List Component - CRUD operations for households
 */
import React, { useState, useEffect } from 'react';
import { householdsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const HouseholdList = () => {
    const { isManagerOrAdmin } = useAuth();
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingHousehold, setEditingHousehold] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formData, setFormData] = useState({
        household_name: '',
        head_of_household: '',
        username: '',
        national_id: '',
        phone_number: '',
        email: '',
        number_of_members: 1,
        meter_number: '',
        connection_date: new Date().toISOString().split('T')[0],
        sector: '',
        cell: '',
        village: '',
        status: 'Active',
        address: '',
        password: '',
        confirm_password: ''
    });

    useEffect(() => {
        fetchHouseholds();
    }, [searchTerm, statusFilter]);

    const fetchHouseholds = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            const response = await householdsAPI.getAll(params);
            setHouseholds(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching households:', error);
            let errorMessage = 'Failed to fetch households';

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

        // Validate passwords match for new households
        if (!editingHousehold && formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        // Validate password length for new households
        if (!editingHousehold && formData.password && formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            const payload = { ...formData };
            delete payload.confirm_password; // Don't send confirm_password to API

            // If creating new household, use username as head_of_household if not set
            if (!editingHousehold) {
                payload.head_of_household = payload.username;
            }

            if (editingHousehold) {
                // Don't send password when editing
                const { password, ...editData } = payload;
                await householdsAPI.update(editingHousehold.household_id, editData);
                toast.success('Household updated successfully');
            } else {
                await householdsAPI.create(payload);
                toast.success('Household created successfully');
            }
            setShowModal(false);
            resetForm();
            fetchHouseholds();
        } catch (error) {
            console.error('Error saving household:', error);
            let errorMsg = 'Operation failed';

            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (typeof data === 'object') {
                    // Extract the first validation error
                    const keys = Object.keys(data);
                    if (keys.length > 0) {
                        const firstKey = keys[0];
                        const firstError = data[firstKey];
                        // Handle array of errors or single string
                        const message = Array.isArray(firstError) ? firstError[0] : firstError;
                        // Format as "Field: Error message"
                        errorMsg = `${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)}: ${message}`;
                    }
                }
            } else if (error.request) {
                errorMsg = 'Cannot connect to server. Please check if the backend is running.';
            }

            toast.error(errorMsg);
        }
    };

    const handleEdit = (household) => {
        setEditingHousehold(household);
        setFormData({
            ...household,
            password: '',
            confirm_password: ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this household?')) {
            try {
                await householdsAPI.delete(id);
                toast.success('Household deleted successfully');
                fetchHouseholds();
            } catch (error) {
                toast.error('Failed to delete household');
            }
        }
    };

    const resetForm = () => {
        setEditingHousehold(null);
        setFormData({
            household_name: '',
            head_of_household: '',
            username: '',
            national_id: '',
            phone_number: '',
            email: '',
            number_of_members: 1,
            meter_number: '',
            connection_date: new Date().toISOString().split('T')[0],
            sector: '',
            cell: '',
            village: '',
            status: 'Active',
            address: '',
            password: '',
            confirm_password: ''
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'Active': 'badge-success',
            'Inactive': 'badge-danger',
            'Suspended': 'badge-warning',
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
                                <h2 className="card-title">Households</h2>
                                <p className="card-subtitle">Manage household registrations</p>
                            </div>
                            {isManagerOrAdmin && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        resetForm();
                                        setShowModal(true);
                                    }}
                                >
                                    + Add Household
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="card-body">
                        {/* Search and Filter */}
                        <div className="filter-group">
                            <div className="search-bar">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search by code, name, or national ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner"></div>
                            </div>
                        ) : households.length > 0 ? (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Household Name</th>
                                            <th>Head</th>
                                            <th>Phone</th>
                                            <th>Members</th>
                                            <th>Status</th>
                                            {isManagerOrAdmin && <th>Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {households.map((household) => (
                                            <tr key={household.household_id}>
                                                <td><strong>{household.household_code}</strong></td>
                                                <td>{household.household_name}</td>
                                                <td>{household.head_of_household}</td>
                                                <td>{household.phone_number}</td>
                                                <td>{household.number_of_members}</td>
                                                <td>
                                                    <span className={getStatusBadgeClass(household.status)}>
                                                        {household.status}
                                                    </span>
                                                </td>
                                                {isManagerOrAdmin && (
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline mr-1"
                                                            onClick={() => handleEdit(household)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(household.household_id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🏠</div>
                                <h3 className="empty-title">No households found</h3>
                                <p className="empty-message">Start by adding a new household</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    {editingHousehold ? 'Edit Household' : 'Add New Household'}
                                </h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="form-group">
                                            <label className="form-label required">Household Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.household_name}
                                                onChange={(e) => setFormData({ ...formData, household_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Username</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                required={!editingHousehold}
                                                placeholder={editingHousehold ? "Leave blank to keep unchanged" : "Username for login"}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">National ID</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.national_id}
                                                onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                                                pattern="\d{16}"
                                                title="Must be 16 digits"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                value={formData.phone_number}
                                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                                pattern="\d{10,15}"
                                                title="Must be 10-15 digits"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Number of Members</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={formData.number_of_members}
                                                onChange={(e) => setFormData({ ...formData, number_of_members: parseInt(e.target.value) })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Meter Number</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.meter_number}
                                                onChange={(e) => setFormData({ ...formData, meter_number: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Connection Date</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formData.connection_date}
                                                onChange={(e) => setFormData({ ...formData, connection_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Sector</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.sector}
                                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Cell</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.cell}
                                                onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Village</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.village}
                                                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label required">Status</label>
                                            <select
                                                className="form-select"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                required
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                    {!editingHousehold && (
                                        <div className="grid grid-cols-2 gap-2 mt-2 border-t pt-2">
                                            <div className="form-group">
                                                <label className="form-label required">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    minLength="8"
                                                    placeholder="Min 8 characters"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label required">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={formData.confirm_password}
                                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                    minLength="8"
                                                    placeholder="Confirm password"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-group mt-2">
                                        <label className="form-label">Address</label>
                                        <textarea
                                            className="form-textarea"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingHousehold ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
                }
            </div >
        </div >
    );
};

export default HouseholdList;
