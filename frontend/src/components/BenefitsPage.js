/**
 * Benefits Page - Benefits of Village Water System
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BenefitsPage = () => {
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
              Benefits of Village Water System
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: '#D1D5DB' }}>
              Discover how digital transformation improves water management for everyone
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Sections */}
      <section className="py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* For Village Authorities */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                  <span className="text-4xl">🏛️</span>
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>For Village Authorities</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Reduced Administrative Workload</h3>
                      <p style={{ color: '#D1D5DB' }}>Automation eliminates manual calculations and paperwork, saving hours of administrative time.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Accurate Billing</h3>
                      <p style={{ color: '#D1D5DB' }}>Automated calculations ensure 100% accuracy in billing, eliminating human errors.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Better Revenue Tracking</h3>
                      <p style={{ color: '#D1D5DB' }}>Real-time tracking of payments and revenue with comprehensive analytics.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Comprehensive Reporting</h3>
                      <p style={{ color: '#D1D5DB' }}>Generate detailed reports for analysis, planning, and decision-making.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Improved Payment Collection</h3>
                      <p style={{ color: '#D1D5DB' }}>Faster payment processing with multiple payment methods and automated reminders.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#06B6D4' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Data-Driven Decisions</h3>
                      <p style={{ color: '#D1D5DB' }}>Access to historical data and trends for better resource planning.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* For Households */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(147, 51, 234, 0.2)' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                  <span className="text-4xl">👥</span>
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>For Households</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Transparent Billing</h3>
                      <p style={{ color: '#D1D5DB' }}>Clear, detailed bills showing usage, rates, and calculations.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>24/7 Access</h3>
                      <p style={{ color: '#D1D5DB' }}>Access your account, bills, and payment history anytime, anywhere.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Multiple Payment Options</h3>
                      <p style={{ color: '#D1D5DB' }}>Pay via Cash, Mobile Money, or Bank Transfer - choose what's convenient.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Usage History</h3>
                      <p style={{ color: '#D1D5DB' }}>Track your water consumption patterns over time.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>Digital Receipts</h3>
                      <p style={{ color: '#D1D5DB' }}>Instant digital receipts for all payments, easily accessible.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" style={{ color: '#9333EA' }}>✓</span>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: '#FFFFFF' }}>No More Queues</h3>
                      <p style={{ color: '#D1D5DB' }}>Handle everything online without waiting in long lines.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* For the Community */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mr-4" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                  <span className="text-4xl">🌍</span>
                </div>
                <h2 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>For the Community</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">💧</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Sustainable Management</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Better tracking leads to more efficient water resource management</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">⚖️</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Fair Billing</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Transparent system ensures fair and accurate billing for all</p>
                </div>
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#374151', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div className="text-4xl mb-3">📈</div>
                  <h3 className="font-bold mb-2" style={{ color: '#FFFFFF' }}>Digital Growth</h3>
                  <p className="text-sm" style={{ color: '#D1D5DB' }}>Modernizing rural services for better community development</p>
                </div>
              </div>
            </motion.div>

            {/* Impact Statistics */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-8 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">System Impact</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">90%</div>
                  <p style={{ color: '#D1D5DB' }}>Reduction in billing errors</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">75%</div>
                  <p style={{ color: '#D1D5DB' }}>Time saved on administration</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <p style={{ color: '#D1D5DB' }}>Payment transparency</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <p style={{ color: '#D1D5DB' }}>System availability</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#000000' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>Experience These Benefits</h2>
            <p className="text-xl mb-6" style={{ color: '#D1D5DB' }}>
              Join the digital transformation of water management
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="px-8 py-3 bg-transparent border-2 rounded-lg font-semibold transform hover:scale-105 transition-all"
                style={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#06B6D4' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                  e.target.style.borderColor = '#06B6D4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                }}
              >
                View Features
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

export default BenefitsPage;

