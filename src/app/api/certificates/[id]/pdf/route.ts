import { NextRequest, NextResponse } from 'next/server'
import { CertificateService } from '@/services/certificate-service'
import { PDFGenerator } from '@/lib/pdf-generator'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Fetch certificate from database
    const certificates = await CertificateService.getAllCertificates()
    const certificate = certificates.find(cert => cert.id === id)

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfBuffer = await PDFGenerator.generateCertificatePDF(certificate)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${certificate.certificate_code}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
