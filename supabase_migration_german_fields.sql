-- Migration: Add German Certificate Fields to Certificates Table
-- Date: 2025-11-11
-- Description: Adds support for Kigali Deutsch Academy certificate fields

-- Add German certificate columns
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS deutschLevel VARCHAR(2);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS geburtstag DATE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS geburtsort TEXT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS pruefungsdatum DATE;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS pruefungsort TEXT;

-- Add score columns
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS hoeren INTEGER DEFAULT 0;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS hoeren_max INTEGER DEFAULT 100;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS lesen INTEGER DEFAULT 0;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS lesen_max INTEGER DEFAULT 100;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS schreiben INTEGER DEFAULT 0;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS schreiben_max INTEGER DEFAULT 100;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS sprechen INTEGER DEFAULT 0;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS sprechen_max INTEGER DEFAULT 100;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_certificates_deutschLevel ON certificates(deutschLevel);
CREATE INDEX IF NOT EXISTS idx_certificates_pruefungsdatum ON certificates(pruefungsdatum);

-- Add comments for documentation
COMMENT ON COLUMN certificates.deutschLevel IS 'German language proficiency level: A1, A2, B1, B2, C1, C2';
COMMENT ON COLUMN certificates.geburtstag IS 'Date of birth (Geburtsdatum)';
COMMENT ON COLUMN certificates.geburtsort IS 'Place of birth (Geburtsort)';
COMMENT ON COLUMN certificates.pruefungsdatum IS 'Exam date (Prüfungsdatum)';
COMMENT ON COLUMN certificates.pruefungsort IS 'Exam location (Prüfungsort)';
COMMENT ON COLUMN certificates.hoeren IS 'Listening score (Hören)';
COMMENT ON COLUMN certificates.lesen IS 'Reading score (Lesen)';
COMMENT ON COLUMN certificates.schreiben IS 'Writing score (Schreiben)';
COMMENT ON COLUMN certificates.sprechen IS 'Speaking score (Sprechen)';
