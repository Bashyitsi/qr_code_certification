import { NextRequest, NextResponse } from 'next/server'
import { CertificateService } from '@/services/certificate-service'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificateData = await request.json()

    // Validate required fields
    const requiredFields = ['recipient_name', 'recipient_email']
    for (const field of requiredFields) {
      if (!certificateData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const certificate = await CertificateService.createCertificate(certificateData)

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificates = await CertificateService.getAllCertificates()

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}
