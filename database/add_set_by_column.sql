-- Add set_by_id column to tariff_rates table
-- This column is required by the Django TariffRate model

USE village_water_system;

-- Add the set_by_id column (foreign key to users table)
ALTER TABLE tariff_rates
ADD COLUMN set_by_id INT NULL AFTER is_active;

-- Add foreign key constraint
ALTER TABLE tariff_rates
ADD CONSTRAINT fk_tariff_rates_set_by
FOREIGN KEY (set_by_id) REFERENCES users(user_id)
ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_tariff_rates_set_by ON tariff_rates(set_by_id);

SELECT 'Migration completed successfully!' AS status;
