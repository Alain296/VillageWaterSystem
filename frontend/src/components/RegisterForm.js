/**
 * Register Form Component
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        full_name: '',
        email: '',
        phone_number: '',
        role: 'Household',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (formData.username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
        }

        // Password validation
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Phone validation
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            newErrors.phone_number = 'Phone number must be 10-15 digits';
        }

        // Household specific validation
        if (formData.role === 'Household') {
            if (!formData.national_id || formData.national_id.length !== 16) {
                newErrors.national_id = 'National ID must be 16 digits';
            }
            if (!formData.address) {
                newErrors.address = 'Address is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else if (result.error) {
            setErrors(result.error);
        }

        setLoading(false);
    };

    return (
        <div 
            className="auth-container"
            style={{
                position: 'relative',
                backgroundImage: "url('/Image/rwanda-water3.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            {/* Dark overlay for better text readability - reduced opacity to show more image */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                    zIndex: 1,
                }}
            />
            <div 
                className="auth-card" 
                style={{ 
                    position: 'relative', 
                    zIndex: 2,
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    width: '90%',
                    maxWidth: '550px',
                    margin: '2vh auto',
                    padding: '1.25rem'
                }}
            >
                <style>{`
                    .auth-card .form-input,
                    .auth-card .form-select,
                    .auth-card textarea.form-input {
                        padding: 0.5rem !important;
                        font-size: 0.9rem !important;
                        margin-bottom: 0 !important;
                    }
                    .auth-card .form-group {
                        margin-bottom: 0.75rem !important;
                    }
                    .auth-card .auth-footer {
                        margin-top: 0.75rem !important;
                        padding-top: 0.75rem !important;
                    }
                `}</style>
                <Link 
                    to="/" 
                    className="home-button"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        padding: '8px 16px',
                        backgroundColor: '#0284c7',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0369a1';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#0284c7';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                </Link>
                <div className="auth-header" style={{ marginBottom: '1rem' }}>
                    <div className="auth-logo" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💧</div>
                    <h1 className="auth-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create Account</h1>
                    <p className="auth-subtitle" style={{ fontSize: '0.9rem' }}>Register for Village Water System</p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginBottom: '0.5rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        />
                        {errors.full_name && <span className="form-error">{errors.full_name}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <span className="form-error">{errors.username}</span>}
                    </div>

                    {formData.role === 'Household' && (
                        <>
                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Household Name</label>
                                <input
                                    type="text"
                                    name="household_name"
                                    className="form-input"
                                    placeholder="Enter household name (optional)"
                                    value={formData.household_name || formData.full_name || ''}
                                    onChange={handleChange}
                                />
                                <small className="text-gray-500">Defaults to full name if empty</small>
                            </div>

                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>National ID</label>
                                <input
                                    type="text"
                                    name="national_id"
                                    className="form-input"
                                    placeholder="Enter 16-digit National ID"
                                    value={formData.national_id || ''}
                                    onChange={handleChange}
                                    maxLength="16"
                                    required
                                />
                                {errors.national_id && <span className="form-error">{errors.national_id}</span>}
                            </div>

                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Address</label>
                                <textarea
                                    name="address"
                                    className="form-input"
                                    placeholder="Enter full address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    rows="2"
                                    style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                    required
                                />
                                {errors.address && <span className="form-error">{errors.address}</span>}
                            </div>
                        </>
                    )}

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Phone Number</label>
                        <input
                            type="tel"
                            name="phone_number"
                            className="form-input"
                            placeholder="Enter phone number (10-15 digits)"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone_number && <span className="form-error">{errors.phone_number}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Household">Household</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a password (min 8 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label required" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            className="form-input"
                            placeholder="Confirm your password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
