/**
 * About System Page - Detailed information about Village Water System
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutSystem = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

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
              About Village Water System
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: '#D1D5DB' }}>
              A comprehensive digital platform transforming water management for village communities in Rwanda
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Overview */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>System Overview</h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: '#D1D5DB' }}>
                The Village Water System is a modern, full-stack web application designed to automate and 
                streamline water usage tracking and billing for village communities in Rwanda. This system 
                replaces traditional pen-and-paper methods with a comprehensive digital platform that ensures 
                accuracy, transparency, and efficiency.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#D1D5DB' }}>
                Built with cutting-edge technology, our system provides real-time monitoring, automated billing, 
                secure payment processing, and comprehensive analytics to help village authorities manage water 
                resources effectively while providing households with transparent and convenient access to their 
                water usage and billing information.
              </p>
            </motion.div>

            {/* Problem Statement */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>The Challenge</h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: '#D1D5DB' }}>
                Traditional water management systems in rural areas often rely on manual record-keeping, 
                which leads to:
              </p>
              <ul className="space-y-3 text-lg" style={{ color: '#D1D5DB' }}>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: '#06B6D4' }}>✗</span>
                  <span>Time-consuming manual data entry and calculations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-600 mr-3">✗</span>
                  <span>Human errors in billing and record-keeping</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: '#06B6D4' }}>✗</span>
                  <span>Lack of transparency for households</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: '#06B6D4' }}>✗</span>
                  <span>Difficulty in tracking payments and generating reports</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: '#06B6D4' }}>✗</span>
                  <span>Limited access to historical data and analytics</span>
                </li>
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(147, 51, 234, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Our Solution</h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#D1D5DB' }}>
                The Village Water System provides a complete digital solution that addresses all these challenges:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-3xl mb-3">🤖</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Automation</h3>
                  <p style={{ color: '#D1D5DB' }}>Automated bill generation, calculations, and payment tracking</p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Transparency</h3>
                  <p style={{ color: '#D1D5DB' }}>Real-time access to usage data and billing information</p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Security</h3>
                  <p style={{ color: '#D1D5DB' }}>Secure authentication and role-based access control</p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Accessibility</h3>
                  <p style={{ color: '#D1D5DB' }}>Access from any device, anywhere, anytime</p>
                </div>
              </div>
            </motion.div>

            {/* Key Benefits */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Key Benefits</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>For Village Authorities</h3>
                    <ul className="space-y-1" style={{ color: '#D1D5DB' }}>
                      <li>• Reduced administrative workload</li>
                      <li>• Accurate billing and revenue tracking</li>
                      <li>• Comprehensive reporting and analytics</li>
                      <li>• Improved payment collection efficiency</li>
                      <li>• Better resource planning and management</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>For Households</h3>
                    <ul className="space-y-1" style={{ color: '#D1D5DB' }}>
                      <li>• Transparent billing information</li>
                      <li>• Easy access to usage history</li>
                      <li>• Multiple payment options</li>
                      <li>• Digital receipts and records</li>
                      <li>• 24/7 access to account information</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#FFFFFF' }}>For the Community</h3>
                    <ul className="space-y-1" style={{ color: '#D1D5DB' }}>
                      <li>• Sustainable water resource management</li>
                      <li>• Fair and transparent billing practices</li>
                      <li>• Digital transformation of rural services</li>
                      <li>• Improved service delivery</li>
                      <li>• Data-driven decision making</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Technology Stack */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Technology Stack</h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#D1D5DB' }}>
                Built with modern, reliable technologies to ensure performance, security, and scalability:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">⚛️</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>React.js 18</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Modern frontend framework</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">🐍</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Django 4.2</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Robust backend framework</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">🗄️</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>MySQL 8.0</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Reliable database system</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">🔐</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>JWT Authentication</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Secure token-based auth</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Chart.js</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Data visualization</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>SMS Integration</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Africa's Talking API</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl text-white text-center"
              style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-6" style={{ color: '#D1D5DB' }}>
                Join the digital transformation of water management in Rwanda
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all"
                  style={{ backgroundColor: '#FFFFFF', color: '#06B6D4' }}
                >
                  Register Your Household
                </Link>
                <Link
                  to="/login"
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
                  Login to Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
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

export default AboutSystem;

