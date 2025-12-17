/**
 * Homepage Component - Modern, Professional Landing Page
 * Village Water System - Rwanda
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle feature navigation - route to informational pages
  const handleFeatureClick = (path) => {
    navigate(path);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* ============================================
          HEADER / NAVBAR
          ============================================ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black shadow-md' : 'bg-black/95 backdrop-blur-sm'
      }`}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                💧
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">
                Village Water System
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                About
              </Link>
              <a href="#services" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                Services
              </a>
              <Link to="/features" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                Features
              </Link>
              <Link to="/benefits" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                Benefits
              </Link>
              <a href="#contact" className="text-gray-300 hover:text-cyan-400 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Action Buttons - Top Right Corner (Always Visible) */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 font-semibold transition-colors border rounded-lg text-sm sm:text-base whitespace-nowrap"
                style={{ 
                  color: '#06B6D4', 
                  borderColor: 'rgba(6, 182, 212, 0.5)',
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
                className="px-3 sm:px-5 py-2 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image - Rwanda Village Water Fetching */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Image/rwanda-water2.JPG')`,
          }}
        >
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,23,42,0.8) 50%, rgba(0,0,0,0.7) 100%)' }}></div>
          {/* Cyan/Purple Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}></div>
          {/* Pattern Overlay for texture */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Reliable Water Supply &<br />
              <span style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Transparent Billing</span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: '#D1D5DB' }}
            >
              A modern digital system for managing village water usage, billing, and payments in Rwanda.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-transparent border-2 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-200"
                style={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                  e.target.style.borderColor = '#06B6D4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                }}
              >
                View System Features
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT THE SYSTEM
          ============================================ */}
      <section className="py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                About The System
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
                Transforming water management for village communities in Rwanda through digital innovation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image - Rwanda Village Water Scene */}
              <motion.div
                variants={fadeInUp}
                className="relative"
              >
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Village water infrastructure in Rwanda"
                    className="w-full h-full object-cover"
                    // Alternative: Use local image - uncomment and add your image to public/images/
                    // src="/images/rwanda-village-water.jpg"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="absolute inset-0 bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                          <div class="text-center text-white">
                            <div class="text-8xl mb-4">💧</div>
                            <p class="text-xl font-semibold">Water Infrastructure</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                  {/* Gradient overlay for better text contrast if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                variants={fadeInUp}
                className="space-y-6"
              >
                <h3 className="text-2xl sm:text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                  Digital Water Management for Modern Communities
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#D1D5DB' }}>
                  Our system replaces traditional pen-and-paper methods with a comprehensive digital platform 
                  that ensures accuracy, transparency, and efficiency in water usage tracking and billing.
                </p>
                <ul className="space-y-4">
                  {[
                    'Automated water usage tracking',
                    'Accurate and transparent billing',
                    'Secure household account management',
                    'Digital payments and receipts',
                    'Real-time monitoring and analytics'
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={fadeInUp}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg" style={{ color: '#D1D5DB' }}>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
                  >
                    Learn More About the System
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          KEY FEATURES SECTION
          ============================================ */}
      <section id="features" className="relative py-20 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Image/rwanda-water6.jpg')`,
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,23,42,0.8) 50%, rgba(0,0,0,0.7) 100%)' }}></div>
          {/* Cyan/Purple Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Key Features
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
                Comprehensive tools designed for efficient water management
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '👥',
                  title: 'Household Management',
                  description: 'Complete household registration and profile management',
                  path: '/features'
                },
                {
                  icon: '📊',
                  title: 'Water Meter Readings',
                  description: 'Easy recording and tracking of water consumption',
                  path: '/features'
                },
                {
                  icon: '🧾',
                  title: 'Automatic Bill Generation',
                  description: 'Automated billing based on usage and tariff rates',
                  path: '/features'
                },
                {
                  icon: '💳',
                  title: 'Payment Tracking',
                  description: 'Support for Cash, Mobile Money, and Bank transfers',
                  path: '/features'
                },
                {
                  icon: '✅',
                  title: 'Usage Validation',
                  description: 'Error prevention and data validation systems',
                  path: '/features'
                },
                {
                  icon: '🔐',
                  title: 'Role-Based Access',
                  description: 'Secure access for Admin, Manager, and Household roles',
                  path: '/features'
                },
                {
                  icon: '📈',
                  title: 'Dashboard & Analytics',
                  description: 'Real-time insights and comprehensive reporting',
                  path: '/features'
                },
                {
                  icon: '🛡️',
                  title: 'Secure Authentication',
                  description: 'JWT-based secure authentication system',
                  path: '/features'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => handleFeatureClick(feature.path)}
                  className="p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#374151';
                    e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1F2937';
                    e.target.style.borderColor = 'rgba(6, 182, 212, 0.2)';
                  }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 transition-colors" style={{ color: '#FFFFFF' }}>{feature.title}</h3>
                  <p style={{ color: '#D1D5DB' }}>{feature.description}</p>
                  <div className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#06B6D4' }}>
                    <span className="text-sm font-medium">Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SERVICES SECTION
          ============================================ */}
      <section id="services" className="relative py-20 overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Image/rwanda-water5.jpg')`,
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,23,42,0.8) 50%, rgba(0,0,0,0.7) 100%)' }}></div>
          {/* Cyan/Purple Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Our Services
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
                Everything you need for efficient water management
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '📝',
                  title: 'Household Registration',
                  description: 'Streamlined registration process for new households with comprehensive data collection',
                  path: '/features'
                },
                {
                  icon: '💧',
                  title: 'Water Usage Recording',
                  description: 'Simple and accurate meter reading entry with automatic validation',
                  path: '/features'
                },
                {
                  icon: '🧾',
                  title: 'Bill Calculation & Invoices',
                  description: 'Automated bill generation with detailed invoice breakdowns',
                  path: '/features'
                },
                {
                  icon: '💰',
                  title: 'Payment Processing',
                  description: 'Multiple payment methods with instant receipt generation',
                  path: '/features'
                },
                {
                  icon: '📊',
                  title: 'Usage History & Reports',
                  description: 'Comprehensive historical data and customizable reports',
                  path: '/features'
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleFeatureClick(service.path)}
                  className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  style={{ backgroundColor: '#1F2937', border: '1px solid rgba(147, 51, 234, 0.2)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#374151';
                    e.target.style.borderColor = 'rgba(147, 51, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1F2937';
                    e.target.style.borderColor = 'rgba(147, 51, 234, 0.2)';
                  }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ color: '#FFFFFF' }}>{service.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#D1D5DB' }}>{service.description}</p>
                  <div className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9333EA' }}>
                    <span className="text-sm font-medium">Explore service</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          DASHBOARD PREVIEW SECTION
          ============================================ */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Image/rwanda-water12.jpg')`,
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,23,42,0.8) 50%, rgba(0,0,0,0.7) 100%)' }}></div>
          {/* Cyan/Purple Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(147,51,234,0.2) 100%)' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Dashboard Preview
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: '#D1D5DB' }}>
                Real-time insights and comprehensive analytics at your fingertips
              </p>
              <motion.button
                variants={fadeInUp}
                onClick={() => handleFeatureClick('/features')}
                className="px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
              >
                View Full Features
              </motion.button>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Water Usage Statistics Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleFeatureClick('/features')}
                className="p-8 rounded-xl text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891b2 100%)' }}
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-2">Water Usage Statistics</h3>
                <p className="text-water-100 mb-4">Track consumption patterns and trends</p>
                <div className="text-3xl font-bold">2,450 L</div>
                <p className="text-water-100 text-sm">This Month</p>
                <div className="mt-4 flex items-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View Details →</span>
                </div>
              </motion.div>

              {/* Revenue Charts Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleFeatureClick('/benefits')}
                className="p-8 rounded-xl text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #9333EA 0%, #7e22ce 100%)' }}
              >
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-2">Revenue Charts</h3>
                <p className="text-green-100 mb-4">Visualize income and payment trends</p>
                <div className="text-3xl font-bold">RWF 125K</div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <div className="mt-4 flex items-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View Details →</span>
                </div>
              </motion.div>

              {/* Bill Status Overview Card */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleFeatureClick('/features')}
                className="p-8 rounded-xl text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-2">Bill Status Overview</h3>
                <p className="text-purple-100 mb-4">Monitor payment statuses</p>
                <div className="text-3xl font-bold">85%</div>
                <p className="text-purple-100 text-sm">Paid Bills</p>
                <div className="mt-4 flex items-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View Details →</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIAL SECTION
          ============================================ */}
      <section className="py-20" style={{ backgroundColor: '#0F172A' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                What Our Community Says
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
                Trusted by village communities across Rwanda
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Jean Baptiste',
                  role: 'Household Member',
                  rating: 5,
                  message: 'The system has made paying water bills so much easier. I can now track my usage and payments online anytime.',
                  image: '/Image/rwanda-water7.jpg'
                },
                {
                  name: 'Marie Uwimana',
                  role: 'Village Manager',
                  rating: 5,
                  message: 'Transparency has improved significantly. We can now generate accurate reports and track payments in real-time.',
                  image: '/Image/rwanda-water11.jpg'
                },
                {
                  name: 'Anastasie Mukamana',
                  role: 'Household Member',
                  rating: 5,
                  message: 'I love being able to see my water usage history. It helps me manage my consumption better.',
                  image: '/Image/rwanda-water10.jpg'
                },
                {
                  name: 'Emmanuel Nsengimana',
                  role: 'Village Manager',
                  rating: 5,
                  message: 'The automated billing system has reduced errors and improved our revenue collection efficiency.',
                  image: '/Image/rwanda-water11.jpg'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: '#1F2937', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0" style={{ border: '2px solid rgba(6, 182, 212, 0.5)', background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                      {testimonial.image ? (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          style={{ display: 'block', minWidth: '100%', minHeight: '100%' }}
                          onError={(e) => {
                            // Fallback to initial if image fails to load
                            const parent = e.target.parentElement;
                            parent.innerHTML = `<div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)">${testimonial.name.charAt(0)}</div>`;
                          }}
                          onLoad={(e) => {
                            // Ensure image is visible when loaded
                            e.target.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold" style={{ color: '#FFFFFF' }}>{testimonial.name}</h4>
                      <p className="text-sm" style={{ color: '#9CA3AF' }}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#9333EA' }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="leading-relaxed" style={{ color: '#D1D5DB' }}>"{testimonial.message}"</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          CALL TO ACTION (CTA)
          ============================================ */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Image/rwanda-water4.jpg')`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,23,42,0.8) 50%, rgba(0,0,0,0.7) 100%)' }}></div>
          {/* Cyan/Purple Overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(147,51,234,0.3) 100%)' }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
              Digital Water Management for<br />
              Sustainable Village Communities
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
              Join the digital transformation of water management in Rwanda
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-200 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)', color: '#FFFFFF' }}
              >
                Register Your Household
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-200"
                style={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                  e.target.style.borderColor = '#06B6D4';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                }}
              >
                Login to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl font-bold" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #9333EA 100%)' }}>
                  💧
                </div>
                <span className="text-xl font-bold text-white">Village Water System</span>
              </div>
              <p style={{ color: '#9CA3AF' }}>
                Digital water management for sustainable village communities in Rwanda.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Home</Link></li>
                <li><Link to="/login" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Login</Link></li>
                <li><Link to="/register" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Register</Link></li>
                <li><a href="#services" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Services</a></li>
                <li><a href="#features" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Features</a></li>
              </ul>
            </div>

            {/* System Links */}
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>System</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>About</a></li>
                <li><Link to="/dashboard" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Dashboard</Link></li>
                <li><a href="#contact" className="transition-colors" style={{ color: '#D1D5DB' }} onMouseEnter={(e) => e.target.style.color = '#06B6D4'} onMouseLeave={(e) => e.target.style.color = '#D1D5DB'}>Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span style={{ color: '#D1D5DB' }}>Rwanda</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span style={{ color: '#D1D5DB' }}>info@villagewatersystem.rw</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📞</span>
                  <span style={{ color: '#D1D5DB' }}>+20 782 499 569</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t pt-8 text-center" style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}>
            <p style={{ color: '#9CA3AF' }}>
              © {new Date().getFullYear()} Village Water System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

