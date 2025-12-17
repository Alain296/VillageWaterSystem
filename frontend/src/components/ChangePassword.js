import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ChangePassword = ({ onClose }) => {
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.new_password !== formData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (formData.new_password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            setLoading(true);
            await authAPI.changePassword({
                old_password: formData.old_password,
                new_password: formData.new_password
            });
            toast.success('Password changed successfully');
            if (onClose) onClose();
            setFormData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to change password';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card animate-fade-in mt-4">
            <div className="card-header">
                <h3 className="card-title">Change Password</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label required">Current Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.old_password}
                            onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="form-group">
                            <label className="form-label required">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                minLength="8"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.confirm_password}
                                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                minLength="8"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
