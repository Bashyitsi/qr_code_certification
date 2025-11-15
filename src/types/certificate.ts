export interface Certificate {
  id: string
  recipient_name: string
  recipient_email: string
  course_name?: string
  description?: string
  issue_date: string
  completion_date?: string
  instructor_name?: string
  organization?: string
  certificate_code: string
  qr_code_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // German certificate specific fields (lowercase to match database)
  deutschlevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  geburtstag?: string // Date of birth (DD.MM.YYYY)
  geburtsort?: string // Place of birth
  pruefungsdatum?: string // Exam date (DD.MM.YYYY)
  pruefungsort?: string // Exam location
  hoeren?: number // Listening score
  hoeren_max?: number
  lesen?: number // Reading score
  lesen_max?: number
  schreiben?: number // Writing score
  schreiben_max?: number
  sprechen?: number // Speaking score
  sprechen_max?: number
}

export interface CreateCertificateData {
  recipient_name: string
  recipient_email: string
  // German certificate fields (lowercase to match database)
  deutschlevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  geburtstag?: string
  geburtsort?: string
  pruefungsdatum?: string
  pruefungsort?: string
  hoeren?: number
  hoeren_max?: number
  lesen?: number
  lesen_max?: number
  schreiben?: number
  schreiben_max?: number
  sprechen?: number
  sprechen_max?: number
}
