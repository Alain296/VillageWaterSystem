-- Add missing Django fields to users table
-- Run this in MySQL to fix the schema mismatch

USE village_water_system;

-- Add is_superuser column (required by PermissionsMixin)
ALTER TABLE users ADD COLUMN is_superuser TINYINT(1) NOT NULL DEFAULT 0 AFTER status;

-- Add is_staff column (required for Django admin)
ALTER TABLE users ADD COLUMN is_staff TINYINT(1) NOT NULL DEFAULT 0 AFTER is_superuser;

-- Add is_active column (required by Django auth)
ALTER TABLE users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER is_staff;

-- Update admin user to have superuser and staff privileges
UPDATE users SET is_superuser = 1, is_staff = 1, is_active = 1 WHERE username = 'admin';

-- Update manager user to be active
UPDATE users SET is_active = 1 WHERE username = 'manager1';

-- Show the updated table structure
DESCRIBE users;

-- Show the users
SELECT user_id, username, role, status, is_superuser, is_staff, is_active FROM users;
