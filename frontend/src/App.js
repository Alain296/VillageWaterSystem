/**
 * Main App Component with Routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.css';
import './styles/responsive.css';

// Components
import Homepage from './components/Homepage';
import AboutSystem from './components/AboutSystem';
import FeaturesPage from './components/FeaturesPage';
import BenefitsPage from './components/BenefitsPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import HouseholdList from './components/HouseholdList';
import UsageRecords from './components/UsageRecords';
import Billing from './components/Billing';
import Payment from './components/Payment';
import Profile from './components/Profile';
import TariffRates from './components/TariffRates';
import SMSLogs from './components/SMSLogs';
import NotificationBell from './components/NotificationBell';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="spinner"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

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

// Navigation Bar Component
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    // Don't show navbar on homepage, login/register, or public info pages
    // Always hide on public pages regardless of authentication status
    const publicPages = ['/', '/login', '/register', '/about', '/features', '/benefits'];
    if (publicPages.includes(location.pathname)) return null;
    
    // Also hide if not authenticated
    if (!isAuthenticated) return null;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/dashboard" className="navbar-brand">
                    <div className="navbar-logo">💧</div>
                    <span>Village Water System</span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                    <Link to="/households" className="navbar-link">Households</Link>
                    <Link to="/usage" className="navbar-link">Usage</Link>
                    <Link to="/billing" className="navbar-link">Bills</Link>
                    <Link to="/payments" className="navbar-link">Payments</Link>
                    <Link to="/tariffs" className="navbar-link">Tariff Rates</Link>
                    <Link to="/sms-logs" className="navbar-link">SMS Logs</Link>
                    <Link to="/profile" className="navbar-link">Profile</Link>
                    <div className="flex items-center">
                        <NotificationBell />
                        <button onClick={handleLogout} className="navbar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="navbar-user">
                    <div className="user-avatar" style={{ overflow: 'hidden', padding: 0, border: '2px solid rgba(6, 182, 212, 0.5)' }}>
                        <img 
                            src={getUserProfileImage(user)} 
                            alt={user?.full_name || 'User'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                // Fallback to initial if image fails to load
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #06B6D4 0%, #9333EA 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; color: white;">${user?.full_name?.charAt(0).toUpperCase() || 'U'}</div>`;
                            }}
                        />
                    </div>
                    <div>
                        <div style={{ fontWeight: '600' }}>{user?.full_name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: '0.9' }}>{user?.role}</div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Main App Component
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Homepage />} />
                        <Route path="/about" element={<AboutSystem />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/benefits" element={<BenefitsPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/households"
                            element={
                                <ProtectedRoute>
                                    <HouseholdList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/usage"
                            element={
                                <ProtectedRoute>
                                    <UsageRecords />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/billing"
                            element={
                                <ProtectedRoute>
                                    <Billing />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/payments"
                            element={
                                <ProtectedRoute>
                                    <Payment />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/tariffs"
                            element={
                                <ProtectedRoute>
                                    <TariffRates />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/sms-logs"
                            element={
                                <ProtectedRoute>
                                    <SMSLogs />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                    {/* Toast Notifications */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
