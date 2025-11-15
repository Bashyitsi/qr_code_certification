import { NextRequest, NextResponse } from 'next/server'
import { CertificateService } from '@/services/certificate-service'

interface Props {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await CertificateService.deleteCertificate(id)

    return NextResponse.json({ message: 'Certificate deleted successfully' })
  } catch (error) {
    console.error('Error deleting certificate:', error)
    return NextResponse.json(
      { error: 'Failed to delete certificate' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin-session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { action } = await request.json()

    if (action === 'deactivate') {
      await CertificateService.deactivateCertificate(id)
      return NextResponse.json({ message: 'Certificate deactivated successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to update certificate' },
      { status: 500 }
    )
  }
}
