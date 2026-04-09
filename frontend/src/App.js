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
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AnalyticsCharts from './components/AnalyticsCharts';
import Notifications from './components/Notifications';

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

// Main App Component
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Sidebar />
                    <div className="main-content">
                        <Topbar />
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

                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <AnalyticsCharts />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <Notifications />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    </div>

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
