import React from 'react';
import { useAuth } from '../context/AuthContext';
import ChangePassword from './ChangePassword';

// Helper function to get user profile image
const getUserProfileImage = (user) => {
    if (!user) return '/Image/rwanda-water7.jpg'; // Default image
    
    // Map users to profile images based on name or username
    const name = (user.full_name || user.username || '').toLowerCase();
    
    // You can customize this mapping based on your users
    // For now, using a simple hash-based approach to assign images
    const images = [
        '/Image/rwanda-water7.jpg',
        '/Image/rwanda-water8.jpg',
        '/Image/rwanda-water9.jpg',
        '/Image/rwanda-water10.jpg',
        '/Image/rwanda-water11.jpg'
    ];
    
    // Simple hash to consistently assign images
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    
    return images[Math.abs(hash) % images.length];
};

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="page">
            <div className="container">
                <div className="mb-4">
                    <h1 className="card-title">My Profile</h1>
                    <p className="card-subtitle">Manage your account settings</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* User Info Card */}
                    <div className="card animate-fade-in">
                        <div className="card-header">
                            <h3 className="card-title">Account Information</h3>
                        </div>
                        <div className="card-body">
                            {/* Profile Image */}
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: '3px solid rgba(6, 182, 212, 0.5)' }}>
                                    <img 
                                        src={getUserProfileImage(user)} 
                                        alt={user?.full_name || 'User'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to initial if image fails to load
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<div style="width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, #06B6D4 0%, #9333EA 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 2rem; color: white;">${user?.full_name?.charAt(0).toUpperCase() || 'U'}</div>`;
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="p-2 bg-gray-50 rounded border">
                                        {user?.full_name}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <div className="p-2 bg-gray-50 rounded border">
                                        {user?.username}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <div className="p-2 bg-gray-50 rounded border">
                                        {user?.email || 'Not set'}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <div className="p-2 bg-gray-50 rounded border">
                                        <span className={`badge ${user?.role === 'Admin' ? 'badge-danger' : 'badge-info'}`}>
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                {user?.role === 'Household' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Household Code</label>
                                            <div className="p-2 bg-gray-50 rounded border font-mono">
                                                {user?.household_code || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <div className="p-2 bg-gray-50 rounded border">
                                                <span className={`badge badge-${user?.household_status === 'Active' ? 'success' : 'warning'}`}>
                                                    {user?.household_status || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div>
                        <ChangePassword />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
