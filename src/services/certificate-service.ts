import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Certificate, CreateCertificateData } from '@/types/certificate'
import { generateCertificateCode, generateQRCode, getCertificateVerificationUrl } from '@/lib/qr-generator'

export class CertificateService {
  static async createCertificate(data: CreateCertificateData): Promise<Certificate> {
    try {
      const certificateCode = generateCertificateCode()
      const verificationUrl = getCertificateVerificationUrl(certificateCode)
      const qrCodeDataUrl = await generateQRCode(verificationUrl)

      const certificateData = {
        ...data,
        certificate_code: certificateCode,
        qr_code_url: qrCodeDataUrl,
        issue_date: new Date().toISOString(),
      }

      const { data: certificate, error } = await supabaseAdmin
        .from('certificates')
        .insert([certificateData])
        .select()
        .single()

      if (error) {
        console.error('Error creating certificate:', error)
        throw new Error('Failed to create certificate')
      }

      return certificate
    } catch (error) {
      console.error('Error in createCertificate:', error)
      throw error
    }
  }

  static async getCertificateByCode(certificateCode: string): Promise<Certificate | null> {
    try {
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('certificate_code', certificateCode)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching certificate:', error)
        throw new Error('Failed to fetch certificate')
      }

      return certificate
    } catch (error) {
      console.error('Error in getCertificateByCode:', error)
      return null
    }
  }

  static async getAllCertificates(): Promise<Certificate[]> {
    try {
      const { data: certificates, error } = await supabaseAdmin
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching certificates:', error)
        throw new Error('Failed to fetch certificates')
      }

      return certificates || []
    } catch (error) {
      console.error('Error in getAllCertificates:', error)
      throw error
    }
  }

  static async deactivateCertificate(certificateId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('certificates')
        .update({ is_active: false })
        .eq('id', certificateId)

      if (error) {
        console.error('Error deactivating certificate:', error)
        throw new Error('Failed to deactivate certificate')
      }
    } catch (error) {
      console.error('Error in deactivateCertificate:', error)
      throw error
    }
  }

  static async deleteCertificate(certificateId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('certificates')
        .delete()
        .eq('id', certificateId)

      if (error) {
        console.error('Error deleting certificate:', error)
        throw new Error('Failed to delete certificate')
      }
    } catch (error) {
      console.error('Error in deleteCertificate:', error)
      throw error
    }
  }
}
