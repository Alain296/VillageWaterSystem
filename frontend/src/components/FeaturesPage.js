/**
 * Features Page - Detailed features of Village Water System
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: '👥',
      title: 'Household Management',
      description: 'Complete household registration and profile management system',
      details: [
        'Auto-generated unique household codes (HH-YYYY-####)',
        'Comprehensive household information storage',
        'Search and filter functionality',
        'Household status management (Active, Inactive, Suspended)',
        'Contact information and location tracking'
      ]
    },
    {
      icon: '📊',
      title: 'Water Meter Readings',
      description: 'Easy recording and tracking of water consumption',
      details: [
        'Simple meter reading entry interface',
        'Automatic calculation of liters used',
        'Validation to prevent duplicate entries',
        'Current reading must be >= previous reading',
        'Monthly usage tracking per household'
      ]
    },
    {
      icon: '🧾',
      title: 'Automatic Bill Generation',
      description: 'Automated billing based on usage and tariff rates',
      details: [
        'Automatic bill calculation (liters × rate)',
        'Penalty and discount application',
        'Bill status tracking (Pending, Paid, Overdue)',
        'Auto-update bill status on payment',
        'Detailed invoice generation'
      ]
    },
    {
      icon: '💳',
      title: 'Payment Tracking',
      description: 'Support for Cash, Mobile Money, and Bank transfers',
      details: [
        'Multiple payment methods',
        'Auto-generated receipt numbers (RCP-YYYY-MM-####)',
        'Payment history tracking',
        'Amount validation',
        'Digital receipt generation'
      ]
    },
    {
      icon: '✅',
      title: 'Usage Validation',
      description: 'Error prevention and data validation systems',
      details: [
        'Prevent duplicate usage entries per household/month',
        'Validate current reading >= previous reading',
        'Email and phone number validation',
        'National ID validation',
        'Payment amount validation'
      ]
    },
    {
      icon: '🔐',
      title: 'Role-Based Access Control',
      description: 'Secure access for Admin, Manager, and Household roles',
      details: [
        'Admin: Full system access',
        'Manager: Operational access',
        'Household: Personal account access',
        'Permission-based feature access',
        'Secure authentication system'
      ]
    },
    {
      icon: '📈',
      title: 'Dashboard & Analytics',
      description: 'Real-time insights and comprehensive reporting',
      details: [
        'Real-time statistics display',
        'Revenue trend charts',
        'Bill status distribution',
        'Top water consumers',
        'Recent activity tracking'
      ]
    },
    {
      icon: '🛡️',
      title: 'Secure Authentication',
      description: 'JWT-based secure authentication system',
      details: [
        'JWT token-based authentication',
        'Secure password hashing',
        'Session persistence with token refresh',
        'Protected routes and API endpoints',
        'Automatic token refresh mechanism'
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#000000', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(6, 182, 212, 0.2)' }}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                💧
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">Village Water System</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link 
                to="/" 
                className="px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                style={{ 
                  color: '#06B6D4', 
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#06B6D4';
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 font-semibold rounded-lg transition-colors"
                style={{ 
                  color: '#06B6D4', 
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#06B6D4';
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 rounded-lg font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(147,51,234,0.3) 100%)', backgroundColor: '#000000' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              System Features
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: '#D1D5DB' }}>
              Comprehensive tools designed for efficient water management
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>{feature.title}</h2>
                <p className="mb-4" style={{ color: '#D1D5DB' }}>{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start" style={{ color: '#D1D5DB' }}>
                      <span className="mr-2" style={{ color: '#06B6D4' }}>✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20" style={{ backgroundColor: '#000000' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#FFFFFF' }}>Additional Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>📱 SMS Notifications</h3>
                <p style={{ color: '#D1D5DB' }}>Automated SMS alerts for bill generation, payment confirmations, and important updates</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>📄 PDF Export</h3>
                <p style={{ color: '#D1D5DB' }}>Generate and download PDF reports for households, bills, and payments</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>📊 CSV Export</h3>
                <p style={{ color: '#D1D5DB' }}>Export data in CSV format for external analysis and record-keeping</p>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>🔔 Real-time Notifications</h3>
                <p style={{ color: '#D1D5DB' }}>In-app notification system for important updates and alerts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Experience These Features</h2>
            <p className="text-xl mb-6" style={{ color: '#D1D5DB' }}>
              Start using the Village Water System today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all"
                style={{ backgroundColor: '#FFFFFF', color: '#06B6D4' }}
              >
                Register Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-transparent border-2 rounded-lg font-semibold transform hover:scale-105 transition-all"
                style={{ borderColor: 'rgba(255, 255, 255, 0.5)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#000000', color: '#D1D5DB' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} Village Water System. All rights reserved.</p>
          <Link 
            to="/" 
            className="mt-2 inline-block transition-colors"
            style={{ color: '#06B6D4' }}
            onMouseEnter={(e) => e.target.style.color = '#22d3ee'}
            onMouseLeave={(e) => e.target.style.color = '#06B6D4'}
          >
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;

