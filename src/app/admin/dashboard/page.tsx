'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Certificate } from '@/types/certificate'
import { Plus, Eye, Trash2, Download, LogOut, QrCode } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const response = await fetch('/api/certificates')
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to load certificates')
      }

      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      setError('Failed to load certificates')
      console.error('Error loading certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return
    }

    try {
      const response = await fetch(`/api/certificates/${certificateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCertificates(prev => prev.filter(cert => cert.id !== certificateId))
      } else {
        throw new Error('Failed to delete certificate')
      }
    } catch (error) {
      setError('Failed to delete certificate')
      console.error('Error deleting certificate:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const downloadQRCode = (certificate: Certificate) => {
    if (!certificate.qr_code_url) return
    
    const link = document.createElement('a')
    link.href = certificate.qr_code_url
    link.download = `qr-${certificate.certificate_code}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadCertificatePDF = async (certificate: Certificate) => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/pdf`)
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Certificate-${certificate.certificate_code}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      alert('Error downloading PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certificate Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage and create digital certificates</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Certificate
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <QrCode className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Certificates
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {certificates.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Certificates
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {certificates.filter(cert => cert.is_active).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Download className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        This Month
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {certificates.filter(cert => {
                          const created = new Date(cert.created_at)
                          const thisMonth = new Date()
                          return created.getMonth() === thisMonth.getMonth() &&
                                 created.getFullYear() === thisMonth.getFullYear()
                        }).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Certificates
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              A list of all certificates with their details and actions.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new certificate.</p>
              <div className="mt-6">
                <Link
                  href="/admin/dashboard/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Certificate
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level & Birth Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificates.map((certificate) => (
                    <tr key={certificate.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {certificate.recipient_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {certificate.recipient_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          DEUTSCH {certificate.deutschlevel || '—'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certificate.geburtstag ? new Date(certificate.geburtstag).toLocaleDateString('de-DE') : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">
                          {certificate.certificate_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          certificate.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {certificate.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(certificate.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/verify/${certificate.certificate_code}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Certificate"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => downloadCertificatePDF(certificate)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {certificate.qr_code_url && (
                            <button
                              onClick={() => downloadQRCode(certificate)}
                              className="text-green-600 hover:text-green-900"
                              title="Download QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(certificate.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Certificate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
