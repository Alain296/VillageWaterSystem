-- Fix all missing columns in the database
USE village_water_system;

-- Check and add missing columns to bills table
-- First, let's see what columns exist
DESCRIBE bills;

-- Add generated_by_id if it doesn't exist (Django expects *_id suffix)
-- Note: The schema has 'generated_by' but Django ORM expects 'generated_by_id'
ALTER TABLE bills 
CHANGE COLUMN generated_by generated_by_id INT NULL;

-- Verify the change
DESCRIBE bills;

-- Also verify water_usage table has recorded_by_id
DESCRIBE water_usage;

-- Also verify households table has registered_by_id  
DESCRIBE households;
