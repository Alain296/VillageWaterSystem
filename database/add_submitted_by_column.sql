-- Add submitted_by_id column to payments table
-- This fixes the "Unknown column 'payments.submitted_by_id'" error

ALTER TABLE payments 
ADD COLUMN submitted_by_id INT NULL AFTER received_by_id,
ADD CONSTRAINT fk_payments_submitted_by 
FOREIGN KEY (submitted_by_id) REFERENCES users(user_id) 
ON DELETE SET NULL;

-- Verify the column was added
DESCRIBE payments;
