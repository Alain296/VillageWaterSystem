-- ============================================
-- Restore Original Database Setup
-- Run this in MySQL Workbench or command line
-- ============================================

-- Step 1: Drop existing database (if exists)
DROP DATABASE IF EXISTS village_water_system;

-- Step 2: Create fresh database
CREATE DATABASE village_water_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 3: Use the database
USE village_water_system;

-- Step 4: Run the schema.sql file from the database folder
-- Or run Django migrations: python manage.py migrate

