import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const publicPages = ['/', '/login', '/register', '/about', '/features', '/benefits'];
    if (publicPages.includes(location.pathname) || !isAuthenticated) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">💧</div>
                <div className="sidebar-title">
                    <h2>VWS</h2>
                    <span>Village Water System</span>
                </div>
            </div>
            
            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <span className="nav-icon">📊</span>
                    <span>Dashboard</span>
                </Link>
                
                {(user?.role === 'Admin' || user?.role === 'Manager') && (
                    <>
                        <Link to="/households" className={`nav-item ${location.pathname === '/households' ? 'active' : ''}`}>
                            <span className="nav-icon">🏠</span>
                            <span>Households</span>
                        </Link>
                        <Link to="/usage" className={`nav-item ${location.pathname === '/usage' ? 'active' : ''}`}>
                            <span className="nav-icon">💧</span>
                            <span>Usage Records</span>
                        </Link>
                        <Link to="/billing" className={`nav-item ${location.pathname === '/billing' ? 'active' : ''}`}>
                            <span className="nav-icon">📄</span>
                            <span>Billing</span>
                        </Link>
                        <Link to="/payments" className={`nav-item ${location.pathname === '/payments' ? 'active' : ''}`}>
                            <span className="nav-icon">💰</span>
                            <span>Payments</span>
                        </Link>
                        {user?.role === 'Admin' && (
                            <Link to="/tariffs" className={`nav-item ${location.pathname === '/tariffs' ? 'active' : ''}`}>
                                <span className="nav-icon">⚙️</span>
                                <span>Tariff Rates</span>
                            </Link>
                        )}
                        <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
                            <span className="nav-icon">📈</span>
                            <span>Analytics & Charts</span>
                        </Link>
                        {user?.role === 'Admin' && (
                            <Link to="/sms-logs" className={`nav-item ${location.pathname === '/sms-logs' ? 'active' : ''}`}>
                                <span className="nav-icon">📱</span>
                                <span>SMS Logs</span>
                            </Link>
                        )}
                    </>
                )}

                {user?.role === 'Household' && (
                    <>
                        <Link to="/billing" className={`nav-item ${location.pathname === '/billing' ? 'active' : ''}`}>
                            <span className="nav-icon">📄</span>
                            <span>My Bills</span>
                        </Link>
                        <Link to="/payments" className={`nav-item ${location.pathname === '/payments' ? 'active' : ''}`}>
                            <span className="nav-icon">💰</span>
                            <span>My Payments</span>
                        </Link>
                        <Link to="/usage" className={`nav-item ${location.pathname === '/usage' ? 'active' : ''}`}>
                            <span className="nav-icon">💧</span>
                            <span>My Usage</span>
                        </Link>
                    </>
                )}
                
                <Link to="/notifications" className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
                    <span className="nav-icon">🔔</span>
                    <span>Notifications</span>
                </Link>
                
                <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <span className="nav-icon">👤</span>
                    <span>Profile</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <span className="nav-icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
