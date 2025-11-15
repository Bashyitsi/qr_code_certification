-- Create certificates table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  course_name TEXT NOT NULL,
  description TEXT,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date DATE,
  instructor_name TEXT,
  organization TEXT NOT NULL,
  certificate_code TEXT UNIQUE NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- German Certificate Fields (Kigali Deutsch Academy)
  deutschLevel VARCHAR(2), -- A1, A2, B1, B2, C1, C2
  geburtstag DATE, -- Date of birth
  geburtsort TEXT, -- Place of birth
  pruefungsdatum DATE, -- Exam date
  pruefungsort TEXT, -- Exam location
  
  -- Test Scores (out of 100)
  hoeren INTEGER DEFAULT 0, -- Listening score
  hoeren_max INTEGER DEFAULT 100,
  lesen INTEGER DEFAULT 0, -- Reading score
  lesen_max INTEGER DEFAULT 100,
  schreiben INTEGER DEFAULT 0, -- Writing score
  schreiben_max INTEGER DEFAULT 100,
  sprechen INTEGER DEFAULT 0, -- Speaking score
  sprechen_max INTEGER DEFAULT 100
);

-- Create index for certificate_code for faster lookups
CREATE INDEX idx_certificates_certificate_code ON certificates(certificate_code);

-- Create index for recipient_email for faster lookups
CREATE INDEX idx_certificates_recipient_email ON certificates(recipient_email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_certificates_updated_at 
    BEFORE UPDATE ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active certificates
CREATE POLICY "Allow public read access to active certificates" ON certificates
  FOR SELECT USING (is_active = true);

-- Create policy for authenticated users to manage certificates (for admin)
CREATE POLICY "Allow authenticated users to manage certificates" ON certificates
  FOR ALL USING (auth.role() = 'authenticated');
