-- ============================================
-- Village Water System Database Schema
-- MySQL 8.0
-- ============================================

-- Create Database
DROP DATABASE IF EXISTS village_water_system;
CREATE DATABASE village_water_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE village_water_system;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    role ENUM('Admin', 'Manager', 'Household') NOT NULL DEFAULT 'Household',
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================
-- Table: households
-- ============================================
CREATE TABLE households (
    household_id INT AUTO_INCREMENT PRIMARY KEY,
    household_code VARCHAR(20) UNIQUE NOT NULL,
    household_name VARCHAR(100) NOT NULL,
    head_of_household VARCHAR(100) NOT NULL,
    national_id VARCHAR(16) UNIQUE NOT NULL,
    address TEXT,
    sector VARCHAR(50),
    cell VARCHAR(50),
    village VARCHAR(50),
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    number_of_members INT DEFAULT 1,
    meter_number VARCHAR(50) UNIQUE,
    connection_date DATE NOT NULL,
    status ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active',
    registered_by INT,
    user_id INT UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registered_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_household_code (household_code),
    INDEX idx_national_id (national_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- Table: tariff_rates
-- ============================================
CREATE TABLE tariff_rates (
    tariff_id INT AUTO_INCREMENT PRIMARY KEY,
    rate_name VARCHAR(100) NOT NULL,
    rate_per_liter DECIMAL(10, 2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    set_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (set_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_is_active (is_active),
    INDEX idx_effective_dates (effective_from, effective_to)
) ENGINE=InnoDB;

-- ============================================
-- Table: water_usage
-- ============================================
CREATE TABLE water_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    previous_reading DECIMAL(10, 2) NOT NULL DEFAULT 0,
    current_reading DECIMAL(10, 2) NOT NULL,
    liters_used DECIMAL(10, 2) NOT NULL,
    reading_date DATE NOT NULL,
    reading_month VARCHAR(7) NOT NULL,
    recorded_by INT,
    status ENUM('Pending', 'Verified', 'Billed') NOT NULL DEFAULT 'Pending',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE KEY unique_household_month (household_id, reading_month),
    INDEX idx_reading_month (reading_month),
    INDEX idx_household_id (household_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- Table: bills
-- ============================================
CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(30) UNIQUE NOT NULL,
    household_id INT NOT NULL,
    usage_id INT,
    tariff_id INT,
    liters_consumed DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rate_applied DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    billing_period VARCHAR(7) NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue', 'Cancelled') NOT NULL DEFAULT 'Pending',
    generated_by INT,
    generation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
    FOREIGN KEY (usage_id) REFERENCES water_usage(usage_id) ON DELETE SET NULL,
    FOREIGN KEY (tariff_id) REFERENCES tariff_rates(tariff_id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_bill_number (bill_number),
    INDEX idx_household_id (household_id),
    INDEX idx_status (status),
    INDEX idx_billing_period (billing_period)
) ENGINE=InnoDB;

-- ============================================
-- Table: payments
-- ============================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_number VARCHAR(30) UNIQUE NOT NULL,
    bill_id INT NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_time TIME NOT NULL,
    payment_method ENUM('Cash', 'Mobile Money', 'Bank Transfer') NOT NULL,
    transaction_reference VARCHAR(100),
    payer_name VARCHAR(100) NOT NULL,
    payer_phone VARCHAR(15),
    payment_status ENUM('Completed', 'Pending', 'Failed') NOT NULL DEFAULT 'Completed',
    received_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_receipt_number (receipt_number),
    INDEX idx_bill_id (bill_id),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB;

-- ============================================
-- Insert Default Data
-- ============================================

-- Default Admin User (password: admin123)
INSERT INTO users (username, password, full_name, email, phone_number, role, status) VALUES
('admin', 'pbkdf2_sha256$600000$defaultsalt$admin123hash', 'System Administrator', 'admin@villagwater.rw', '0788000001', 'Admin', 'Active');

-- Default Manager User (password: manager123)
INSERT INTO users (username, password, full_name, email, phone_number, role, status) VALUES
('manager1', 'pbkdf2_sha256$600000$defaultsalt$manager123hash', 'Water Manager', 'manager@villagwater.rw', '0788000002', 'Manager', 'Active');

-- Default Tariff Rate (10 RWF per liter)
INSERT INTO tariff_rates (rate_name, rate_per_liter, effective_from, is_active, set_by) VALUES
('Standard Rate 2025', 10.00, '2025-01-01', TRUE, 1);

-- ============================================
-- Triggers for Auto-calculations
-- ============================================

-- Trigger to calculate liters_used in water_usage
DELIMITER //
CREATE TRIGGER calculate_liters_used BEFORE INSERT ON water_usage
FOR EACH ROW
BEGIN
    SET NEW.liters_used = NEW.current_reading - NEW.previous_reading;
END//
DELIMITER ;

-- Trigger to update liters_used on update
DELIMITER //
CREATE TRIGGER update_liters_used BEFORE UPDATE ON water_usage
FOR EACH ROW
BEGIN
    SET NEW.liters_used = NEW.current_reading - NEW.previous_reading;
END//
DELIMITER ;

-- ============================================
-- Views for Easy Data Access
-- ============================================

-- View: Household Details with User Info
CREATE VIEW v_household_details AS
SELECT 
    h.*,
    u.username,
    u.email as user_email,
    u.status as user_status
FROM households h
LEFT JOIN users u ON h.user_id = u.user_id;

-- View: Bills with Household Info
CREATE VIEW v_bills_details AS
SELECT 
    b.*,
    h.household_name,
    h.head_of_household,
    h.phone_number as household_phone,
    u.liters_used,
    u.reading_month
FROM bills b
JOIN households h ON b.household_id = h.household_id
LEFT JOIN water_usage u ON b.usage_id = u.usage_id;

-- View: Payments with Bill and Household Info
CREATE VIEW v_payments_details AS
SELECT 
    p.*,
    b.bill_number,
    b.total_amount as bill_total,
    h.household_name,
    h.head_of_household
FROM payments p
JOIN bills b ON p.bill_id = b.bill_id
JOIN households h ON b.household_id = h.household_id;

-- ============================================
-- Database Setup Complete
-- ============================================
