import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const getUserProfileImage = (user) => {
    if (!user) return '/Image/rwanda-water7.jpg';
    const name = (user.full_name || user.username || '').toLowerCase();
    const images = [
        '/Image/rwanda-water7.jpg',
        '/Image/rwanda-water8.jpg',
        '/Image/rwanda-water9.jpg',
        '/Image/rwanda-water10.jpg',
        '/Image/rwanda-water11.jpg'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash = hash & hash;
    }
    return images[Math.abs(hash) % images.length];
};

const Topbar = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    const publicPages = ['/', '/login', '/register', '/about', '/features', '/benefits'];
    if (publicPages.includes(location.pathname) || !isAuthenticated) return null;

    const getPageTitle = (pathname) => {
        const path = pathname.split('/')[1] || 'dashboard';
        const titleMap = {
            'dashboard': 'Dashboard',
            'households': 'Households',
            'usage': 'Water Usage Records',
            'billing': 'Billing & Invoices',
            'payments': 'Payments',
            'tariffs': 'Tariff Rates',
            'analytics': 'Analytics & Charts',
            'sms-logs': 'SMS Logs',
            'profile': 'My Profile',
            'notifications': 'Notifications'
        };
        return titleMap[path] || 'Village Water System';
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
            </div>
            
            <div className="topbar-right">
                <NotificationBell />
                
                <div className="user-profile-menu">
                    <div className="user-avatar" style={{ overflow: 'hidden', padding: 0, border: '2px solid rgba(14, 165, 233, 0.5)' }}>
                        <img 
                            src={getUserProfileImage(user)} 
                            alt={user?.full_name || 'User'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; color: white;">${user?.full_name?.charAt(0).toUpperCase() || 'U'}</div>`;
                            }}
                        />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.full_name}</div>
                        <div className="user-role">{user?.role}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
