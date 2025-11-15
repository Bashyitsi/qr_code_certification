-- Migration to make course_name and organization nullable
-- These fields are no longer used in the German certificate system

-- Make course_name nullable
ALTER TABLE certificates 
ALTER COLUMN course_name DROP NOT NULL;

-- Make organization nullable
ALTER TABLE certificates 
ALTER COLUMN organization DROP NOT NULL;

-- Add comments to document the change
COMMENT ON COLUMN certificates.course_name IS 'Legacy field - no longer required for German certificates';
COMMENT ON COLUMN certificates.organization IS 'Legacy field - no longer required for German certificates';
